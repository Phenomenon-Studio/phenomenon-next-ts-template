import type { LazyImageProps } from './types';
import Image from 'next/image';
import { generateSvgShimmer } from '@/lib/utils/generateSvgShimmer';
import { toBase64 } from '@/lib/utils/toBase64';

export const LazyImage: React.FC<LazyImageProps> = ({ src, alt, width, height, style, ...props }) => {
    if (!src) {
        return null;
    }

    return (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            style={{ width: '100%', height: 'auto', ...style }}
            {...props}
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(generateSvgShimmer(width, height))}`}
        />
    );
};
