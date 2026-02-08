import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import TrackTable from "../../components/TrackTable/TrackTable";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import EmptyState from "../../components/EmptyState/EmptyState";
import topChartsService from "../../services/topChartsService";
import { useAuth } from "../../hooks/useAuth";
import { usePlayer } from "../../contexts/PlayerContext";
import { useDataCache } from "../../contexts/DataCacheContext";
import { getTranslatedGenre } from "../../utils/genreTranslation";
import styles from "./TopChartsPage.module.css";

const TopChartsPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { audioRef, setIsPlaying } = usePlayer();
    const { getTopChartsData, setTopChartsData, updateSongFavoriteStatus, topChartsData, clearCache } = useDataCache();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State cho các danh sách
    const [popularArtists, setPopularArtists] = useState([]);
    const [popularCategories, setPopularCategories] = useState([]);
    const [categorySongs, setCategorySongs] = useState({});

    useEffect(() => {
        const cachedData = getTopChartsData();
        if (cachedData) {
            setPopularArtists(cachedData.popularArtists || []);
            setPopularCategories(cachedData.popularCategories || []);
            setCategorySongs(cachedData.categorySongs || {});
            setLoading(false);
        } else {
            fetchAllData();
        }
    }, []);

    // Sync with global cache updates (e.g. from PlayerControl)
    useEffect(() => {
        if (topChartsData && topChartsData.categorySongs) {
            setCategorySongs(topChartsData.categorySongs);
        }
    }, [topChartsData]);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Lấy danh sách popular categories trước
            const categoriesRes = await topChartsService.getPopularCategories(1, 10);
            const categories = categoriesRes?.items || [];

            // Sắp xếp: đưa Nhạc Việt (10) và Âu Mỹ (26) lên đầu
            const sortedCategories = [
                ...categories.filter(cat => cat.id === 10 || cat.id === 26).sort((a, b) => a.id - b.id),
                ...categories.filter(cat => cat.id !== 10 && cat.id !== 26)
            ];

            // Gọi các API còn lại song song
            const apiCalls = [
                topChartsService.getPopularArtists(1, 10),
                ...sortedCategories.map(cat =>
                    topChartsService.getPopularSongsByCategory(cat.id, 1, 10)
                )
            ];

            const results = await Promise.all(apiCalls);
            const [artistsRes, ...categoryResults] = results;

            // Map kết quả theo ID của từng category
            const songsData = {};
            sortedCategories.forEach((cat, index) => {
                songsData[cat.id] = categoryResults[index]?.items || [];
            });

            const data = {
                popularArtists: artistsRes?.items || [],
                popularCategories: sortedCategories,
                categorySongs: songsData,
            };

            setPopularArtists(data.popularArtists);
            setPopularCategories(data.popularCategories);
            setCategorySongs(data.categorySongs);

            setTopChartsData(data);
        } catch (err) {
            //console.error("Error fetching top charts data:", err);
            setError(t('error_fetching_data'));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadSpinner />;
    }

    if (error) {
        return <EmptyState message={t('empty_content')} />;
    }

    const hasNoData = popularCategories.length === 0;

    if (hasNoData && !loading) {
        return <EmptyState message={t('empty_content')} />;
    }

    const handleToggleFavorite = async (song) => {
        const songId = song.id || song.songId;
        try {
            const res = await topChartsService.toggleFavorite(songId);
            if (res && res.isFavorited !== undefined) {
                // 1. Update local state
                setCategorySongs(prev => {
                    const next = { ...prev };
                    Object.keys(next).forEach(catId => {
                        next[catId] = next[catId].map(s => {
                            if ((s.id || s.songId) === songId) {
                                return { ...s, isFavorited: res.isFavorited };
                            }
                            return s;
                        });
                    });
                    return next;
                });

                // 2. Update global cache for sync
                updateSongFavoriteStatus(songId, res.isFavorited);

                // 3. Clear favorites cache to force refresh on next visit
                clearCache('favorites');
            }
        } catch (err) {
            //console.error("Toggle favorite error:", err);
        }
    };

    const handleViewArtist = (artistId) => {
        navigate(`/artist/${artistId}`);
    };

    const handleTitleClick = (song) => {
        navigate(`/song/${song.id}`);
    };

    // Render một section cho category
    const renderCategorySection = (category, isDualColumn = false) => {
        const songs = categorySongs[category.id] || [];
        const content = (
            <>
                <div className={styles["section-header"]}>
                    <h2 className={styles["section-title"]}>{t('top_chart_title', { name: getTranslatedGenre(category.name, t) })}</h2>
                    <Link to={`/category/${category.id}`} className={styles["see-all-link"]}>
                        {t('see_all')}
                        <ChevronRight />
                    </Link>
                </div>
                {songs.length > 0 ? (
                    <div className={styles["items-list"]}>
                        <TrackTable
                            songs={songs.map(song => ({
                                ...song,
                                id: song.id || song.songId,
                                title: song.name || song.title,
                                imageUrl: song.avatarUrl || song.imageUrl,
                                artists: Array.isArray(song.artists) ? song.artists : [{ name: t('unknown_artist') }],
                            }))}
                            showRank={true}
                            hideDuration={isDualColumn}
                            isDualColumn={isDualColumn}
                            onTitleClick={handleTitleClick}
                            onViewArtist={handleViewArtist}
                        />
                    </div>
                ) : (
                    <p className={styles["no-data"]}>{t('no_data')}</p>
                )}
            </>
        );

        return isDualColumn ? (
            <div className={styles["column"]} key={category.id}>
                {content}
            </div>
        ) : (
            <section className={styles["content-section"]} key={category.id}>
                {content}
            </section>
        );
    };

    return (
        <div className={styles["charts-main-content"]}>
            {/* 2 category đầu tiên - Dual Column */}
            {popularCategories.length > 0 && (
                <section className={styles["content-section"]}>
                    <div className={styles["dual-column-container"]}>
                        {popularCategories.slice(0, 2).map(category => renderCategorySection(category, true))}
                    </div>
                </section>
            )}

            {/* Các category còn lại - Single Column */}
            {popularCategories.slice(2).map(category => renderCategorySection(category, false))}
        </div>
    );
};

export default TopChartsPage;
