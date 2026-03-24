import { createParser } from 'nuqs';

export const parseAsExample = createParser({
    parse(value) {
        return value === 'example' ? value : 'unknown';
    },
    serialize(value) {
        return value;
    },
});
