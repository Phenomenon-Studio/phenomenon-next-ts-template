export type IntlPluralSimplifyForms = Record<Extract<Intl.LDMLPluralRule, 'one' | 'many'>, string> &
    Partial<Record<Exclude<Intl.LDMLPluralRule, 'one' | 'many'>, string>>;

/**
 *
 * @param value - The value to simplify.
 * @param forms - The forms to simplify.
 * @returns The simplified form.
 * @example
 * const single = intlPluralRulesSimplify(1, { one: 'apple', many: 'apples' });
 * console.log(single); // 'apple'
 *
 * const plural = intlPluralRulesSimplify(2, { one: 'apple', many: 'apples' });
 * console.log(plural); // 'apples'
 */
export const intlPluralRulesSimplify = (value: number, forms: IntlPluralSimplifyForms) => {
    const pluralRules = new Intl.PluralRules('en-US');
    const rule = pluralRules.select(value);

    return forms?.[rule] ?? forms.many;
};
