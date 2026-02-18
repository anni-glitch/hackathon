import React from 'react';

export const Badge = ({ children, variant = 'blue', className = '' }) => {
    const variantClass = {
        red: 'badge-red',
        yellow: 'badge-yellow',
        green: 'badge-green',
        blue: 'badge-blue',
        gray: 'badge-gray',
    }[variant] || 'badge-blue';

    return (
        <span className={`badge ${variantClass} ${className}`}>
            {children}
        </span>
    );
};
