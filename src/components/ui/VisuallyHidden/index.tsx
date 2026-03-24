import React from 'react';

export const VisuallyHidden: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <span className="sr-only">{children}</span>;
};
