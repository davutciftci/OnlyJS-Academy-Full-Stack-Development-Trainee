/// <reference types="jest" />

import { ConflictError, UnauthorizedError } from '../src/utils/customErrors';




jest.mock('../src/utils/prisma', () => ({
    __esModule: true,
    default: {
        user: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    },
}));

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
    genSalt: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
}));

jest.mock('../src/services/mail', () => ({
    sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
}));




const prismaMock = (require('../src/utils/prisma').default) as {
    user: {
        findUnique: jest.Mock;
        findFirst: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
    };
};


const bcryptMock = require('bcrypt') as {
    hash: jest.Mock;
    compare: jest.Mock;
};


const jwtMock = require('jsonwebtoken') as {
    sign: jest.Mock;
};
const mailMock = require('../src/services/mail') as {
    sendWelcomeEmail: jest.Mock;
    sendPasswordResetEmail: jest.Mock;
};




const { createUser, loginUser, requestPasswordReset, resetPassword } =
    require('../src/services/user') as typeof import('../src/services/user');
const flushPromises = (): Promise<void> =>
    new Promise((resolve) => setImmediate(resolve));

describe('User / Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test-jwt-secret';
    });



    describe('createUser', () => {
        it('throws ConflictError when the email is already registered', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: 1, email: 'dup@test.com' });

            await expect(
                createUser({ firstName: 'A', lastName: 'B', email: 'dup@test.com', password: 'pass', birthDay: new Date() })
            ).rejects.toThrow(ConflictError);

            expect(prismaMock.user.create).not.toHaveBeenCalled();
        });

        it('throws ConflictError with the message "Bu email zaten kullanılıyor"', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: 1, email: 'dup@test.com' });

            await expect(
                createUser({ firstName: 'A', lastName: 'B', email: 'dup@test.com', password: 'pass', birthDay: new Date() })
            ).rejects.toThrow('Bu email zaten kullanılıyor');
        });

        it('hashes the password with bcrypt before persisting', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);
            bcryptMock.hash.mockResolvedValue('hashed_pw');
            prismaMock.user.create.mockResolvedValue({ id: 1, email: 'new@test.com', firstName: 'Davut' });

            await createUser({ firstName: 'Davut', lastName: 'C', email: 'new@test.com', password: 'raw_pass', birthDay: new Date() });

            expect(bcryptMock.hash).toHaveBeenCalledWith('raw_pass', 10);
            expect(prismaMock.user.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ hashedPassword: 'hashed_pw' }),
                })
            );
        });

        it('returns the created user object', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);
            bcryptMock.hash.mockResolvedValue('h');
            const mockUser = { id: 5, email: 'new@test.com', firstName: 'Davut' };
            prismaMock.user.create.mockResolvedValue(mockUser);

            const result = await createUser({ firstName: 'Davut', lastName: 'C', email: 'new@test.com', password: 'pass', birthDay: new Date() });

            expect(result).toEqual(mockUser);
        });

        it('schedules a welcome email after creation (fire-and-forget)', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);
            bcryptMock.hash.mockResolvedValue('h');
            prismaMock.user.create.mockResolvedValue({ id: 1, email: 'hi@test.com', firstName: 'Hi' });

            await createUser({ firstName: 'Hi', lastName: 'T', email: 'hi@test.com', password: 'p', birthDay: new Date() });
            await flushPromises();

            expect(mailMock.sendWelcomeEmail).toHaveBeenCalledWith('hi@test.com', 'Hi');
        });
    });



    describe('loginUser', () => {
        it('throws UnauthorizedError if the user does not exist', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(loginUser('ghost@test.com', 'pass')).rejects.toThrow(UnauthorizedError);
        });

        it('throws UnauthorizedError with the message "Email veya şifre hatalı" for missing user', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(loginUser('ghost@test.com', 'pass')).rejects.toThrow('Email veya şifre hatalı');
        });

        it('throws UnauthorizedError when the password does not match', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: 1, email: 'a@b.com', hashedPassword: 'hash' });
            bcryptMock.compare.mockResolvedValue(false);

            await expect(loginUser('a@b.com', 'wrong')).rejects.toThrow(UnauthorizedError);
        });

        it('returns user (without hashedPassword) and a signed JWT on success', async () => {
            const dbUser = { id: 2, email: 'ok@test.com', role: 'USER', hashedPassword: 'h' };
            prismaMock.user.findUnique.mockResolvedValue(dbUser);
            bcryptMock.compare.mockResolvedValue(true);
            jwtMock.sign.mockReturnValue('jwt_abc');

            const result = await loginUser('ok@test.com', 'pass');

            expect(jwtMock.sign).toHaveBeenCalledWith(
                { userId: 2, email: 'ok@test.com', role: 'USER' },
                'test-jwt-secret',
                { expiresIn: '7d' }
            );
            expect(result.token).toBe('jwt_abc');
            expect(result.user).not.toHaveProperty('hashedPassword');
            expect(result.user.email).toBe('ok@test.com');
        });

        it('passes the email to findUnique to locate the user', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await loginUser('lookup@test.com', 'pass').catch(() => { /* expected */ });

            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: 'lookup@test.com' } });
        });
    });


    describe('requestPasswordReset', () => {
        it('resolves silently without doing anything when user not found (prevents enumeration)', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(requestPasswordReset('ghost@test.com')).resolves.toBeUndefined();
            expect(prismaMock.user.update).not.toHaveBeenCalled();
            expect(mailMock.sendPasswordResetEmail).not.toHaveBeenCalled();
        });

        it('stores a 64-char hex reset token and ~1h expiry for the found user', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: 7, email: 'r@test.com', firstName: 'Re' });
            prismaMock.user.update.mockResolvedValue({});

            const before = Date.now();
            await requestPasswordReset('r@test.com');
            const after = Date.now();

            const [[arg]] = prismaMock.user.update.mock.calls;
            expect(arg.where).toEqual({ id: 7 });
            expect(arg.data.resetToken).toMatch(/^[a-f0-9]{64}$/);
            const expiry: Date = arg.data.resetTokenExpiry;
            expect(expiry.getTime()).toBeGreaterThanOrEqual(before + 3600000 - 200);
            expect(expiry.getTime()).toBeLessThanOrEqual(after  + 3600000 + 200);
        });

        it('sends the password-reset email with the generated token', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: 8, email: 'r@test.com', firstName: 'Re' });
            prismaMock.user.update.mockResolvedValue({});

            await requestPasswordReset('r@test.com');

            expect(mailMock.sendPasswordResetEmail).toHaveBeenCalledWith(
                'r@test.com',
                'Re',
                expect.stringMatching(/^[a-f0-9]{64}$/)
            );
        });
    });


    describe('resetPassword', () => {
        it('throws UnauthorizedError for an invalid or expired token', async () => {
            prismaMock.user.findFirst.mockResolvedValue(null);

            await expect(resetPassword('bad-tok', 'newpass')).rejects.toThrow(UnauthorizedError);
        });

        it('throws with the message "Geçersiz veya süresi dolmuş token"', async () => {
            prismaMock.user.findFirst.mockResolvedValue(null);

            await expect(resetPassword('bad-tok', 'newpass')).rejects.toThrow('Geçersiz veya süresi dolmuş token');
        });

        it('hashes the new password and updates the user record', async () => {
            prismaMock.user.findFirst.mockResolvedValue({ id: 10 });
            bcryptMock.hash.mockResolvedValue('new_hash');
            prismaMock.user.update.mockResolvedValue({});

            await resetPassword('good-tok', 'newPass123');

            expect(bcryptMock.hash).toHaveBeenCalledWith('newPass123', 10);
            expect(prismaMock.user.update).toHaveBeenCalledWith({
                where: { id: 10 },
                data: {
                    hashedPassword: 'new_hash',
                    resetToken: null,
                    resetTokenExpiry: null,
                },
            });
        });

        it('returns a success message object', async () => {
            prismaMock.user.findFirst.mockResolvedValue({ id: 10 });
            bcryptMock.hash.mockResolvedValue('hash');
            prismaMock.user.update.mockResolvedValue({});

            const res = await resetPassword('tok', 'pass');

            expect(res.message).toBe('Şifreniz başarıyla güncellendi');
        });

        it('queries findFirst with the token and a future-date expiry filter', async () => {
            prismaMock.user.findFirst.mockResolvedValue(null);

            await resetPassword('my-token', 'p').catch(() => { /* expected */ });

            const [[arg]] = prismaMock.user.findFirst.mock.calls;
            expect(arg.where.resetToken).toBe('my-token');
            expect(arg.where.resetTokenExpiry.gt).toBeInstanceOf(Date);
        });
    });
});
