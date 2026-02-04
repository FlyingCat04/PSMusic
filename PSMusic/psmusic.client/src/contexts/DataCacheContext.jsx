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
        exploreCategories: null,
    });

    const [timestamps, setTimestamps] = useState({
        homePage: null,
        topCharts: null,
        exploreCategories: null,
    });

    const [lastFavoriteUpdate, setLastFavoriteUpdate] = useState(null);

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

    const setExploreCategoriesData = (data) => {
        setCache(prev => ({ ...prev, exploreCategories: data }));
        setTimestamps(prev => ({ ...prev, exploreCategories: Date.now() }));
    };

    const getHomePageData = () => {
        return isCacheValid('homePage') ? cache.homePage : null;
    };

    const getTopChartsData = () => {
        return isCacheValid('topCharts') ? cache.topCharts : null;
    };

    const getExploreCategoriesData = () => {
        return isCacheValid('exploreCategories') ? cache.exploreCategories : null;
    };

    const clearCache = (key) => {
        if (key) {
            setCache(prev => ({ ...prev, [key]: null }));
            setTimestamps(prev => ({ ...prev, [key]: null }));
        } else {
            setCache({ homePage: null, topCharts: null, exploreCategories: null });
            setTimestamps({ homePage: null, topCharts: null, exploreCategories: null });
        }
    };

    const updateSongFavoriteStatus = (songId, status) => {
        // Update TopCharts Cache
        if (cache.topCharts && cache.topCharts.categorySongs) {
            const currentData = cache.topCharts;
            const updatedCategorySongs = { ...currentData.categorySongs };
            
            let hasChanges = false;
            Object.keys(updatedCategorySongs).forEach(catId => {
                updatedCategorySongs[catId] = updatedCategorySongs[catId].map(song => {
                    const id = song.id || song.songId;
                    if (id === songId) {
                        hasChanges = true;
                        return { ...song, isFavorited: status };
                    }
                    return song;
                });
            });

            if (hasChanges) {
                setCache(prev => ({
                    ...prev,
                    topCharts: {
                        ...currentData,
                        categorySongs: updatedCategorySongs
                    }
                }));
            }
        }
        
        // Future: Update other caches like HomePage or ExploreCategories if they contain the song
        
        // Trigger event for listeners
        setLastFavoriteUpdate({ songId, isFavorited: status, timestamp: Date.now() });
    };

    const value = {
        setHomePageData,
        setTopChartsData,
        setExploreCategoriesData,
        getHomePageData,
        getTopChartsData,
        getExploreCategoriesData,
        clearCache,
        clearCache,
        updateSongFavoriteStatus,
        lastFavoriteUpdate,
        topChartsData: isCacheValid('topCharts') ? cache.topCharts : null,
    };

    return (
        <DataCacheContext.Provider value={value}>
            {children}
        </DataCacheContext.Provider>
    );
};