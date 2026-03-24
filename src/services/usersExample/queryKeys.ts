export const usersQueryKeys = {
    all: ['users'] as const,
    allLists() {
        return [...usersQueryKeys.all, 'list'] as const;
    },
    list(searchParams: Record<string, unknown> | URLSearchParams) {
        return [
            ...usersQueryKeys.allLists(),
            searchParams instanceof URLSearchParams ? searchParams.toString() : searchParams,
        ] as const;
    },
    allItems() {
        return [...usersQueryKeys.all, 'item'] as const;
    },
    item(id: string) {
        return [...usersQueryKeys.allItems(), id] as const;
    },
};
