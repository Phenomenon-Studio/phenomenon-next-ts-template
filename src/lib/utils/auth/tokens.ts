export const setAccessToken = (token: string) => {
    localStorage.setItem('access_token', token);
};

export const getAccessToken = () => {
    return typeof localStorage === 'object' ? localStorage.getItem('access_token') : null;
};

export const removeAccessToken = () => {
    if (!getAccessToken()) {
        localStorage.removeItem('access_token');
    }
};

export const setRefreshToken = (token: string) => {
    localStorage.setItem('refresh_token', token);
};

export const getRefreshToken = () => {
    return typeof localStorage === 'object' ? localStorage.getItem('refresh_token') : null;
};

export const removeRefreshToken = () => {
    if (!getRefreshToken()) {
        localStorage.removeItem('refresh_token');
    }
};
