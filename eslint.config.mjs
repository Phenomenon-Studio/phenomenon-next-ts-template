import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
    recommendedConfig: js.configs.recommended,
    ignores: ['/node_modules', '/.next', '/build', '/out', '/storybook-static'],
    files: ['**/*.{js,ts,tsx,cjs,mjs}'],
});

const eslintConfig = [
    ...compat.config({
        extends: [
            'eslint:recommended',
            'next/core-web-vitals',
            'next/typescript',
            'prettier',
            'plugin:@tanstack/query/recommended',
            'plugin:prettier/recommended',
        ],
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
    }),
];

export default eslintConfig;
