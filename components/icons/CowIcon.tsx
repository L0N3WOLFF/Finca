
import React from 'react';

export const CowIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18.8 6.2C18.2 5 17.1 4 16 4H8C5.8 4 4 5.8 4 8v5.5A3.5 3.5 0 0 0 7.5 17H12v2.5A1.5 1.5 0 0 0 13.5 21h.03a1.5 1.5 0 0 0 1.47-1.46V17h2.5a3.5 3.5 0 0 0 3.5-3.5V8c0-1.1-.6-2.1-1.2-2.8z"></path>
        <path d="M6 12h2"></path>
        <path d="M10 12h2"></path>
        <path d="M8 8V6.5A1.5 1.5 0 0 1 9.5 5h1A1.5 1.5 0 0 1 12 6.5V8"></path>
    </svg>
);
