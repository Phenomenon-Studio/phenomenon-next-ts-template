export type IntlNumberFormatOptions = {
    precision?: number;
    applyPrecisionOnZeroes?: boolean;
} & Partial<Intl.NumberFormatOptions>;

export const intlNumberFormat = (value: number, options: IntlNumberFormatOptions = {}): string => {
    const { precision = 2, applyPrecisionOnZeroes = false, ...rest } = options;

    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: applyPrecisionOnZeroes ? precision : 0,
        maximumFractionDigits: precision,
        ...rest,
    }).format(value);
};
