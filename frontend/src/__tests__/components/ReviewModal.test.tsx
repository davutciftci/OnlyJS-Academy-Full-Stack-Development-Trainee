import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewModal from '../../components/ReviewModal';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ProductComment } from '../../types/product';

// Use vi.hoisted to ensure we have the exact same references for mocks
const { mockPost, mockPatch } = vi.hoisted(() => ({
    mockPost: vi.fn(),
    mockPatch: vi.fn(),
}));

vi.mock('../../api/client', () => ({
    apiClient: {
        post: mockPost,
        get: vi.fn(),
        patch: mockPatch,
        delete: vi.fn(),
    },
    setAuthToken: vi.fn(),
    getAuthToken: vi.fn(),
}));

// ReviewModal does not use AuthContext but we mock it for safety or in case of future changes
vi.mock('../../context/AuthContext', () => ({
    useAuth: vi.fn(),
    AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ReviewModal Bileşeni', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSuccess: vi.fn(),
        productId: 1,
        productName: 'Test Ürünü',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset implementations to default success
        mockPost.mockReset();
        mockPatch.mockReset();
        mockPost.mockResolvedValue({ data: { status: 'success' } });
        mockPatch.mockResolvedValue({ data: { status: 'success' } });
    });

    it('Açık olduğunda ürün adını göstermelidir', () => {
        render(<ReviewModal {...defaultProps} />);
        expect(screen.getByText('Test Ürünü')).toBeInTheDocument();
    });

    it('Yıldız puanlama butonları olmalıdır', () => {
        render(<ReviewModal {...defaultProps} />);
        const stars = screen.getAllByRole('button').filter(b => b.querySelector('.lucide-star'));
        expect(stars).toHaveLength(5);
    });

    it('Başlık ve yorum alanları olmalıdır', () => {
        render(<ReviewModal {...defaultProps} />);
        expect(screen.getByPlaceholderText(/Örn: Süper, Harika/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Ürün hakkındaki düşüncelerinizi paylaşın/i)).toBeInTheDocument();
    });

    it('Yıldız seçildiğinde ve form doldurulduğunda başarılı gönderim yapmalıdır', async () => {
        const user = userEvent.setup();
        
        render(<ReviewModal {...defaultProps} />);
        
        // Yıldız seç (3. yıldız)
        const stars = screen.getAllByRole('button').filter(b => b.querySelector('.lucide-star'));
        await user.click(stars[2]);

        // Inputları doldur
        await user.type(screen.getByPlaceholderText(/Örn: Süper, Harika/i), 'Harika Ürün');
        await user.type(screen.getByPlaceholderText(/Ürün hakkındaki düşüncelerinizi paylaşın/i), 'Çok beğendim, tavsiye ederim.');

        // Gönder
        await user.click(screen.getByText('Gönder'));

        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/comments', expect.objectContaining({
                rating: 3,
                productId: 1,
                title: 'Harika Ürün',
                comment: 'Çok beğendim, tavsiye ederim.',
            }));
            expect(defaultProps.onSuccess).toHaveBeenCalled();
        }, { timeout: 4000 });
    });

    it('API hatası durumunda hata mesajı göstermelidir', async () => {
        const user = userEvent.setup();
        mockPost.mockRejectedValue({ 
            response: { data: { message: 'Daha önce yorum yapmışsınız' } } 
        });
        
        render(<ReviewModal {...defaultProps} />);
        
        // Formu doldur ve gönder (5. yıldız)
        const stars = screen.getAllByRole('button').filter(b => b.querySelector('.lucide-star'));
        await user.click(stars[4]);
        
        // Formu doldur (Validation için gerekli)
        await user.type(screen.getByPlaceholderText(/Örn: Süper, Harika/i), 'Test Başlık');
        await user.type(screen.getByPlaceholderText(/Ürün hakkındaki düşüncelerinizi paylaşın/i), 'Test Yorum');
        
        await user.click(screen.getByText('Gönder'));

        const errorMsg = await screen.findByText(/Daha önce yorum yapmışsınız/i);
        expect(errorMsg).toBeInTheDocument();
    });

    it('Yorum alanı boş bırakıldığında hata vermelidir', async () => {
        const user = userEvent.setup();
        render(<ReviewModal {...defaultProps} />);
        
        // Sadece yıldız seç, yorum yazma
        const stars = screen.getAllByRole('button').filter(b => b.querySelector('.lucide-star'));
        await user.click(stars[4]);
        
        // Submit form directly to bypass HTML validation in JSDOM/userEvent
        const form = screen.getByPlaceholderText(/Örn: Süper, Harika/i).closest('form');
        if (form) fireEvent.submit(form);

        expect(await screen.findByText(/Lütfen yorum yazınız/i)).toBeInTheDocument();
        expect(mockPost).not.toHaveBeenCalled();
    });

    it('Düzenleme modunda mevcut yorumu yüklemelidir', () => {
        const existingComment: ProductComment = {
            id: 1,
            rating: 4,
            title: 'Eski Başlık',
            comment: 'Eski Yorum',
            productId: 1,
            userId: 1,
            isApproved: true,
            createdAt: new Date().toISOString(),
        };

        render(<ReviewModal {...defaultProps} editMode={true} existingComment={existingComment} />);

        expect(screen.getByDisplayValue('Eski Başlık')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Eski Yorum')).toBeInTheDocument();
        
        const stars = screen.getAllByRole('button').filter(b => b.querySelector('.lucide-star'));
        const star4 = stars[3].querySelector('svg');
        expect(star4).toHaveClass('fill-yellow-400');
    });

    it('Düzenleme modunda yama (patch) isteği başarılı olmalıdır', async () => {
        const user = userEvent.setup();
        const existingComment: ProductComment = {
            id: 123,
            rating: 4,
            title: 'Eski Başlık',
            comment: 'Eski Yorum',
            productId: 1,
            userId: 1,
            isApproved: true,
            createdAt: new Date().toISOString(),
        };

        render(<ReviewModal {...defaultProps} editMode={true} existingComment={existingComment} />);

        // Değişiklik yap
        await user.clear(screen.getByDisplayValue('Eski Başlık'));
        await user.type(screen.getByPlaceholderText(/Örn: Süper, Harika/i), 'Yeni Başlık');
        
        await user.click(screen.getByText('Güncelle'));

        await waitFor(() => {
            expect(mockPatch).toHaveBeenCalledWith('/comments/123', expect.objectContaining({
                rating: 4,
                title: 'Yeni Başlık',
                comment: 'Eski Yorum',
            }));
            expect(defaultProps.onSuccess).toHaveBeenCalled();
        }, { timeout: 4000 });
    });
});
