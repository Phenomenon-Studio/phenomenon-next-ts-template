import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactCompiler: true,
    reactStrictMode: true,
    outputFileTracingRoot: import.meta.dirname,
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    turbopack: {
        root: import.meta.dirname,
        rules: {
            '*.svg': {
                as: '*.js',
                loaders: ['@svgr/webpack'],
            },
        },
    },
    webpack(config) {
        // Grab the existing rule that handles SVG imports
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fileLoaderRule = config.module.rules.find((rule: any) => {
            return rule.test?.test?.('.svg');
        });

        config.module.rules.push(
            // Reapply the existing rule, but only for svg imports ending in ?url
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/, // *.svg?url
            },
            // Convert all other *.svg imports to React components
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
                use: [{ loader: '@svgr/webpack', options: { icon: true } }],
            }
        );

        // Modify the file loader rule to ignore *.svg, since we have it handled now.
        fileLoaderRule.exclude = /\.svg$/i;

        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                pathname: '/**',
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '5mb',
        },
    },
};

export default nextConfig;
