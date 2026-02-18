import React from 'react';

export const Card = ({ children, className = '' }) => {
    return (
        <div className={`card ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => {
    return (
        <div className={`card-header ${className}`}>
            {children}
        </div>
    );
};

export const CardBody = ({ children, className = '' }) => {
    return (
        <div className={`card-body ${className}`}>
            {children}
        </div>
    );
};
