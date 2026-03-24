'use client';

import React from 'react';
import clsx from 'clsx';
import s from './styles.module.css';

export const Counter: React.FC = () => {
    const [count, setCount] = React.useState(0);

    const increment = () => {
        setCount((prev) => {
            return prev + 1;
        });
    };

    const decrement = () => {
        setCount((prev) => {
            return prev - 1;
        });
    };

    return (
        <article className={s.wrap}>
            <div className={s['counter-wrap']}>
                Count:&nbsp;<strong>{count}</strong>
            </div>
            <footer className={s.footer}>
                <button className={clsx(s.cta, 'focus-primary')} onClick={decrement}>
                    -
                </button>
                <button className={clsx(s.cta, 'focus-primary')} onClick={increment}>
                    +
                </button>
            </footer>
        </article>
    );
};
