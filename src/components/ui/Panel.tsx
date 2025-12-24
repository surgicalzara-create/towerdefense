import type { ReactNode } from 'react';

interface PanelProps {
    children: ReactNode;
    className?: string;
    title?: string;
}

export const Panel = ({ children, className = '', title }: PanelProps) => {
    return (
        <div className={`
            bg-ocean-900/80 backdrop-blur-md 
            border border-white/10 
            rounded-2xl shadow-xl 
            flex flex-col gap-3 p-4
            ${className}
        `}>
            {title && (
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black text-center mb-1">
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};
