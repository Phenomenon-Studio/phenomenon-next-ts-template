import type { IntlPluralSimplifyForms } from './intlPluralRulesSimplify';
import { intlPluralRulesSimplify } from './intlPluralRulesSimplify';

/**
 *
 * @param forms - The forms to create a plural.
 * @returns A function that returns the plural form of the value.
 * @example
 * const applesPlural = createPlural({ one: 'apple', many: 'apples' });
 * console.log(applePlural(1)); // 'apple'
 * console.log(applePlural(2)); // 'apples'
 */
export const createPlural = (forms: IntlPluralSimplifyForms) => {
    return (value: number) => {
        return intlPluralRulesSimplify(value, forms);
    };
};
