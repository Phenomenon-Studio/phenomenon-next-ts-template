export const authQueryKeys = {
    all: ['auth'] as const,
    login() {
        return [...authQueryKeys.all, 'login'] as const;
    },
    signUp() {
        return [...authQueryKeys.all, 'sign-up'] as const;
    },
    logout() {
        return [...authQueryKeys.all, 'logout'] as const;
    },
};
