import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role"));
    
    // isAuthenticated is derived from token and role
    const isAuthenticated = !!token && !!role && role === 'admin';

    // Effect to clear legacy tokens or invalid roles
    useEffect(() => {
        console.log("AuthContext state check:", { hasToken: !!token, role, isAuthenticated });
        if (token && (!role || role === 'undefined' || role !== 'admin')) {
            console.warn("Invalid auth state detected, clearing session.");
            logout();
        }
    }, [token, role, isAuthenticated]);

    const login = (newToken, newRole) => {
        console.log("Login success. Setting role:", newRole);
        localStorage.setItem("token", newToken);
        localStorage.setItem("role", newRole);
        setToken(newToken);
        setRole(newRole);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setToken(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ token, role, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
