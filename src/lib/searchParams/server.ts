import { createParser } from 'nuqs/server';

export const parseAsExample = createParser({
    parse(value) {
        return value === 'example' ? value : 'unknown';
    },
    serialize(value) {
        return value;
    },
});
