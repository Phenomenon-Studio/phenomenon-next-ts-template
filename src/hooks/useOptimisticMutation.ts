import type { DataTag, MutationFunction, QueryKey } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type Updater<TQueryFnData, TVariables> = (
    _oldData: TQueryFnData | undefined,
    _variables: TVariables
) => TQueryFnData | undefined;

type OptimisticProps<
    TData = unknown,
    TVariables = unknown,
    TQueryKey extends QueryKey = QueryKey,
    TQueryFnData = unknown,
> = {
    mutationFn: MutationFunction<TData, TVariables>;
    queryKey: TQueryKey;
    updater: Updater<TQueryFnData, TVariables>;
    invalidate: () => Promise<void>;
};

export const useOptimisticMutation = <
    TData = unknown,
    TVariables = unknown,
    TQueryFnData = unknown,
    TQueryKey extends QueryKey = QueryKey,
    TInferredQueryFnData = TQueryKey extends DataTag<unknown, infer TaggedValue> ? TaggedValue : TQueryFnData,
>({
    mutationFn,
    queryKey,
    updater,
    invalidate,
}: OptimisticProps<TData, TVariables, TQueryKey, TInferredQueryFnData>) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        async onMutate(variables) {
            await queryClient.cancelQueries({
                queryKey,
            });

            const snapshot = queryClient.getQueryData(queryKey);

            queryClient.setQueryData<TInferredQueryFnData>(queryKey, (old) => {
                return updater(old, variables);
            });

            return () => {
                queryClient.setQueryData(queryKey, snapshot);
            };
        },
        onError(_error, _variables, rollback) {
            rollback?.();
        },
        onSettled() {
            return invalidate();
        },
    });
};
