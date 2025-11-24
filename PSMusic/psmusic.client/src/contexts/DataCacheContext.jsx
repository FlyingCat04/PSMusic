import React, { createContext, useContext, useState } from 'react';

const DataCacheContext = createContext();

export const useDataCache = () => {
    const context = useContext(DataCacheContext);
    if (!context) {
        throw new Error('useDataCache must be used within DataCacheProvider');
    }
    return context;
};

export const DataCacheProvider = ({ children }) => {
    const [cache, setCache] = useState({
        homePage: null,
        topCharts: null,
    });

    const [timestamps, setTimestamps] = useState({
        homePage: null,
        topCharts: null,
    });

    // Cache expiration time
    const CACHE_EXPIRATION = 15 * 60 * 1000;

    const isCacheValid = (key) => {
        if (!cache[key] || !timestamps[key]) return false;
        const now = Date.now();
        return (now - timestamps[key]) < CACHE_EXPIRATION;
    };

    const setHomePageData = (data) => {
        setCache(prev => ({ ...prev, homePage: data }));
        setTimestamps(prev => ({ ...prev, homePage: Date.now() }));
    };

    const setTopChartsData = (data) => {
        setCache(prev => ({ ...prev, topCharts: data }));
        setTimestamps(prev => ({ ...prev, topCharts: Date.now() }));
    };

    const getHomePageData = () => {
        return isCacheValid('homePage') ? cache.homePage : null;
    };

    const getTopChartsData = () => {
        return isCacheValid('topCharts') ? cache.topCharts : null;
    };

    const clearCache = (key) => {
        if (key) {
            setCache(prev => ({ ...prev, [key]: null }));
            setTimestamps(prev => ({ ...prev, [key]: null }));
        } else {
            setCache({ homePage: null, topCharts: null });
            setTimestamps({ homePage: null, topCharts: null });
        }
    };

    const value = {
        setHomePageData,
        setTopChartsData,
        getHomePageData,
        getTopChartsData,
        clearCache,
    };

    return (
        <DataCacheContext.Provider value={value}>
            {children}
        </DataCacheContext.Provider>
    );
};