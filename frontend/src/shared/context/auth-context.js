import { createContext } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    userId: null,
    token: null,
    email: null,
    firstName: null,
    lastName: null,
    isAdmin: false,
    isTutor: false,
    login: () => { },
    logout: () => { }
});