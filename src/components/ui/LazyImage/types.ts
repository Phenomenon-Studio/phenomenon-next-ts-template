import type { ImageProps } from 'next/image';

export type LazyImageProps = Omit<ImageProps, 'width' | 'height'> & {
    /**
     * Image width
     */
    width: number;
    /**
     * Image height
     */
    height: number;
};
