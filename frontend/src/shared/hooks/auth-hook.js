import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(false);

    const [email, setEmail] = useState();
    const [firstName, setFirstname] = useState();
    const [lastName, setLastName] = useState();
    const [isAdmin, setIsAdmin] = useState();
    const [isTutor, setIsTutor] = useState();

    const login = useCallback((userId, token, email, firstName, lastName, isAdmin, isTutor, expirationDate) => {
        setToken(token);
        setUserId(userId);
        setEmail(email);
        setFirstname(firstName);
        setLastName(lastName);
        setIsAdmin(isAdmin);
        setIsTutor(isTutor);
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem('user', JSON.stringify({ userId, token, expiration: tokenExpirationDate.toISOString(), email, firstName, lastName, isAdmin, isTutor }));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(null);
        setUserId(null);
        localStorage.removeItem('user');
    }, []);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else { clearTimeout(logoutTimer); }
    }, [token, logout, tokenExpirationDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('user'));
        if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
            login(storedData.userId, storedData.token, storedData.email, storedData.firstName, storedData.lastName, storedData.isAdmin, storedData.isTutor, new Date(storedData.expiration));
        }
    }, [login]);

    return { token, login, logout, userId, email, firstName, lastName, isAdmin, isTutor };
};