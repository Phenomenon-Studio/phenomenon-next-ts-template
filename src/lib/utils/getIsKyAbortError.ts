export const getIsKyAbortError = (error: Error) => {
    return error.name === 'AbortError';
};
