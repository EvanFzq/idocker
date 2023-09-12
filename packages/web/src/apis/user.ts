import { fetch } from './fetch';

export const login = async (username: string, password: string) => {
    return fetch.post<{ token: string }>('/auth/login', { username, password });
};
