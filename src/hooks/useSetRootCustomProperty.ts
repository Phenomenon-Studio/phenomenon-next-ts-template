'use client';

import React from 'react';

export const useSetRootCustomProperty = (name: string, value?: string) => {
    React.useEffect(() => {
        if (value) {
            document.documentElement.style.setProperty(name, value);
        } else {
            document.documentElement.style.removeProperty(name);
        }
    }, [name, value]);
};
