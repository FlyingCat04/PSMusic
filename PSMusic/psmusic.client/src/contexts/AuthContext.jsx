import React, { createContext, useState, useEffect, useRef, useLayoutEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import authService from "../services/authService";
import { useLocation, useNavigate } from "react-router-dom";
import { useDataCache } from "./DataCacheContext";

const AuthContext = createContext({
    user: null,
    loading: true,
    accessToken: null,
    login: () => { },
    logout: () => { },
});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const isRefreshing = useRef(false);
    const failedQueue = useRef([]);
    const { clearCache } = useDataCache();

    const processQueue = (error, token = null) => {
        failedQueue.current.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        failedQueue.current = [];
    };

    // useEffect(() => {
    //     if (location.pathname.startsWith("/auth")) {
    //         setLoading(false);
    //         return;
    //     }
    //     checkAuth();
    // }, [location.pathname]);

    // useEffect(() => {
    //     const initializeAuth = async () => {
    //         try {
    //             const res = await authService.refresh();
    //             if (res.isSuccess && res.token) {
    //                 const newToken = res.token;
    //                 setAccessToken(newToken);
    //                 axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    //                 // await checkAuth();
    //             } else {
    //                 setLoading(false);
    //             }
    //         } catch (error) {
    //             setLoading(false);
    //         }
    //     };

    //     initializeAuth();
    // }, []);

    useEffect(() => {
        const init = async () => {
            try {
                const res = await authService.refresh();
                if (res?.token && res?.user) {
                    setAccessToken(res.token);
                    setUser(res.user);
                    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${res.token}`;
                } else {
                    setAccessToken(null);
                    setUser(null);
                }
            } catch (error) {
                setAccessToken(null);
                setUser(null);
            }
            setLoading(false);
        };
        init();
    }, []);

    useLayoutEffect(() => {
        if (accessToken) {
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        } else {
            delete axiosInstance.defaults.headers.common["Authorization"];
        }
    }, [accessToken]);

    // const checkAuth = async () => {
    //     try {
    //         const result = await authService.getCurrentUser();
    //         if (result.isSuccess) {
    //             setUser(result.data);
    //         }
    //     } catch (error) {
    //         if (error.message !== "Chưa đăng nhập hoặc phiên đăng nhập đã hết hạn") {
    //             //console.error("Auth check failed:", error.message);
    //         }
    //         setUser(null);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    const login = async (username, password) => {
        const result = await authService.login(username, password);
        
        if (result.isSuccess) {
            const token = result.token;
            setAccessToken(token);
            setUser(result.user);
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            // await checkAuth();
        }
        
        return result;
    } 

    const logout = async () => {
        await authService.logout();
        setUser(null);
        setAccessToken(null);
        delete axiosInstance.defaults.headers.common["Authorization"];
        clearCache();
        navigate("/");
    }

    // useEffect(() => {
    //     const interceptor = axiosInstance.interceptors.response.use(
    //         (response) => response,
    //         async (error) => {
    //             if (error.response?.status === 401) {
    //                 //console.warn("Cần đăng nhập!!");
    //             }
    //             return Promise.reject(error);
    //         }
    //     );

    //     return () => {
    //         axiosInstance.interceptors.response.eject(interceptor);
    //     };
    // }, []);

    useLayoutEffect(() => {
        const interceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (originalRequest.url.includes("/refresh")) {
                    return Promise.reject(error);
                }

                if (error.response?.status === 401 && !originalRequest._retry) {
                    
                    if (isRefreshing.current) {
                        return new Promise(function (resolve, reject) {
                            failedQueue.current.push({ resolve, reject });
                        })
                            .then((token) => {
                                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                                return axiosInstance(originalRequest);
                            })
                            .catch((err) => {
                                return Promise.reject(err);
                            });
                    }

                    originalRequest._retry = true;
                    isRefreshing.current = true;

                    try {
                        const res = await authService.refresh(); 
                        
                        if (res?.token) {
                            const newToken = res.token;
                            
                            setAccessToken(newToken);
                            if (res?.user) {
                                setUser(res.user);
                            }
                            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                            
                            processQueue(null, newToken);
                            
                            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                            return axiosInstance(originalRequest);
                        } else {
                            throw new Error("Refresh failed logic");
                        }
                    } catch (refreshError) {
                        //console.error("Refresh Token API Error:", refreshError);
                        processQueue(refreshError, null);
                        logout(); 
                        return Promise.reject(refreshError);
                    } finally {
                        isRefreshing.current = false;
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.response.eject(interceptor);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider };