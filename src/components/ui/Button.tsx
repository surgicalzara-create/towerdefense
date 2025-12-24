import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'danger' | 'success' | 'neutral' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: ReactNode;
    children: ReactNode;
    active?: boolean;
}

export const Button = ({
    variant = 'neutral',
    size = 'md',
    icon,
    children,
    className = '',
    active = false,
    ...props
}: ButtonProps) => {

    const baseStyles = "font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden";

    const variants = {
        primary: "bg-gradient-to-br from-tropical-400 to-tropical-600 text-white shadow-lg shadow-tropical-500/20 hover:brightness-110",
        danger: "bg-gradient-to-br from-lava-400 to-lava-600 text-white shadow-lg shadow-lava-500/20 hover:brightness-110",
        success: "bg-gradient-to-br from-palm-400 to-palm-600 text-white shadow-lg shadow-palm-500/20 hover:brightness-110",
        neutral: "bg-slate-700/50 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/5",
        ghost: "hover:bg-white/10 text-slate-400 hover:text-white",
    };

    const sizes = {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-4 py-3",
        lg: "text-lg px-6 py-4",
    };

    // Active state ring
    const activeRing = active ? "ring-2 ring-white ring-offset-2 ring-offset-ocean-900" : "";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${activeRing} ${className}`}
            {...props}
        >
            {icon && <span className="text-xl">{icon}</span>}
            <span>{children}</span>
        </button>
    );
};
