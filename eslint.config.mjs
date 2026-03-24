import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import pluginTanstackQuery from '@tanstack/eslint-plugin-query';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

const eslintConfig = [
    {
        ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
    },
    ...nextCoreWebVitals,
    ...nextTypescript,
    ...pluginTanstackQuery.configs['flat/recommended'],
    reactHooks.configs.flat['recommended-latest'],
    eslintPluginPrettierRecommended,
    ...compat.extends('prettier', 'plugin:react/recommended'),

    {
        rules: {
            'react/react-in-jsx-scope': ['off'],
            'react/prop-types': ['off'],
            'react/no-unused-prop-types': ['error'],
            'react/function-component-definition': [
                2,
                { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
            ],
            'react/jsx-no-useless-fragment': ['error'],
            'react/self-closing-comp': [
                'error',
                {
                    component: true,
                    html: true,
                },
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            'arrow-body-style': ['error', 'always'],
            'no-nested-ternary': ['error'],
            eqeqeq: ['error', 'always'],
            'no-alert': ['error'],
            'no-unneeded-ternary': ['error'],
            'require-await': ['error'],
            'no-tabs': ['error'],
            'max-len': [
                'error',
                {
                    code: 120,
                    ignoreUrls: true,
                    ignoreRegExpLiterals: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                },
            ],
            quotes: ['error', 'single', { allowTemplateLiterals: true }],
            semi: ['error', 'always'],
            'no-loop-func': ['error'],
            'comma-style': ['error', 'last'],
            'space-before-blocks': ['error', 'always'],
            'no-mixed-spaces-and-tabs': ['error'],
            'no-unused-vars': 'off',
            'no-extra-semi': ['error'],
            'no-console': ['warn'],
            'no-debugger': ['error'],
            'block-spacing': ['error', 'always'],
            'max-nested-callbacks': [
                'error',
                {
                    max: 7,
                },
            ],
            'no-trailing-spaces': ['error'],
            'semi-spacing': [
                'error',
                {
                    before: false,
                    after: true,
                },
            ],
            'no-var': ['error'],
            'no-multi-spaces': ['error'],
            'no-control-regex': ['off'],
        },
    },
];

export default eslintConfig;
