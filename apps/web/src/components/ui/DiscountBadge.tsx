interface DiscountBadgeProps {
    percentage: number;
    className?: string;
}

export default function DiscountBadge({ percentage, className = '' }: DiscountBadgeProps) {
    return (
        <div
            className={`bg-[#ED2727] text-white w-[60px] h-[50px] text-[10px] font-bold flex flex-col items-center justify-center ${className}`}
        >
            <span className="block text-center">%{percentage}</span>
            <span className="block text-center">İNDİRİM</span>
        </div>
    );
}
