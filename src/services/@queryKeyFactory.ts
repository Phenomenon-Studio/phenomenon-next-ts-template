type QueryKeyGenerator<TScope extends string> = {
    <TOperation extends string>(operation: TOperation): readonly [TScope, TOperation];
    <TOperation extends string, TPayload>(
        operation: TOperation,
        payload: TPayload
    ): readonly [TScope, TOperation, TPayload];
};

/*
 * NOTE: `any` is required here because this function implements an overloaded call signature type
 * (QueryKeyGenerator). TypeScript cannot verify that a single implementation body satisfies all
 * overload branches simultaneously - the return type of each branch would be
 * `readonly [TScope, TOp]` or `readonly [TScope, TOp, TPayload]`, and their union cannot be
 * proven assignable to the specific overload being resolved at the call site.
 * The public contract is fully enforced by the QueryKeyGenerator type above; `any` is
 * intentionally scoped to this implementation body only.
 */
export const queryKeyFactory = <TScope extends string>(scope: TScope): QueryKeyGenerator<TScope> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (operation: string, payload?: unknown): any => {
        if (!payload) {
            return [scope, operation] as const;
        }

        return [scope, operation, payload] as const;
    };
};
