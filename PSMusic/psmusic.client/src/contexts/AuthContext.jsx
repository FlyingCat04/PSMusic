import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import authService from "../services/authService";

const AuthContext = createContext({
    user: null,
    loading: true,
    login: () => { },
    logout: () => { },
});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const result = await authService.getCurrentUser();
            if (result.isSuccess) {
                setUser(result.data);
            }
        } catch (error) {
            console.error("Auth check failed:", error.message);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    const login = async (username, password) => {
        const result = await authService.login(username, password);
        
        if (result.isSuccess) {
            await checkAuth();
        }
        
        return result;
    } 

    const logout = async () => {
        await authService.logout();
        setUser(null);
    }

    useEffect(() => {
        const interceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    console.warn("Cần đăng nhập!!");
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.response.eject(interceptor);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider };