import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import GenreCard from '../../components/GenreCard/GenreCard';
import ItemCardColumn from '../../components/ItemCardColumn/ItemCardColumn';
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner';
import EmptyState from '../../components/EmptyState/EmptyState';
import exploreCategoriesService from '../../services/exploreCategoriesService';
import { useDataCache } from '../../contexts/DataCacheContext';
import { getTranslatedGenre } from '../../utils/genreTranslation';
import styles from './ExploreCategoriesPage.module.css';

const ExploreCategoriesPage = () => {
    const { t } = useTranslation();
    const { getExploreCategoriesData, setExploreCategoriesData } = useDataCache();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [categorySongs, setCategorySongs] = useState({});

    useEffect(() => {
        const cachedData = getExploreCategoriesData();
        if (cachedData) {
            setCategories(cachedData.categories || []);
            setCategorySongs(cachedData.categorySongs || {});
            setLoading(false);
        } else {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Lấy danh sách popular categories
            const categoriesRes = await exploreCategoriesService.getAllCategories(1, 100);
            const allCategories = categoriesRes?.items || [];

            // Lấy IDs từ popular categories
            const featuredCategoryIds = allCategories.map(cat => cat.id);

            // Lấy songs cho các category phổ biến
            const songPromises = featuredCategoryIds.map(id =>
                exploreCategoriesService.getSongsByCategory(id, 1, 10)
            );
            const songsResults = await Promise.all(songPromises);

            // Map results to category IDs
            const songsMap = {};
            featuredCategoryIds.forEach((id, index) => {
                songsMap[id] = songsResults[index]?.items || [];
            });

            const data = {
                categories: allCategories,
                categorySongs: songsMap,
            };

            setCategories(data.categories);
            setCategorySongs(data.categorySongs);

            // Cache data
            setExploreCategoriesData(data);
        } catch (err) {
            //console.error('Error fetching explore categories data:', err);
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

    const hasNoData = categories.length === 0;

    if (hasNoData && !loading) {
        return <EmptyState message={t('empty_content')} />;
    }

    return (
        window.scrollTo(0, 0),
        <div className={styles['explore-main-content']}>
            {/* Categories Grid Section */}
            {categories.length > 0 && (
                <section className={styles['content-section']}>
                    <div className={styles['category-grid']}>
                        {categories.slice(0, 12).map((category) => (
                            <GenreCard
                                key={category.id}
                                genre={{
                                    id: category.id,
                                    title: getTranslatedGenre(category.name, t),
                                    imageUrl: category.avatarUrl,
                                    color: category.color || '#FF4E50'
                                }}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Category Songs Sections */}
            {categories.map((category) => {
                const songs = categorySongs[category.id] || [];
                if (songs.length === 0) return null;

                return (
                    <section key={category.id} className={styles['content-section']}>
                        <div className={styles['section-header']}>
                            <h2 className={styles['section-title']}>{t('explore_genre_title', { name: getTranslatedGenre(category.name, t) })}</h2>
                            <Link to={`/category/${category.id}`} className={styles['see-all-link']}>
                                {t('see_all')}
                                <ChevronRight />
                            </Link>
                        </div>
                        <div className={styles['songs-grid']}>
                            {songs.map((song) => (
                                <ItemCardColumn
                                    key={song.id || song.songId}
                                    item={{
                                        id: song.id || song.songId,
                                        title: song.title || song.name,
                                        artists: Array.isArray(song.artists)
                                            ? song.artists
                                            : [{ name: t('unknown_artist') }],
                                        imageUrl: song.avatarUrl || song.imageUrl || 'https://via.placeholder.com/200',
                                        mp3Url: song.mp3Url,
                                        // premium: song.premium || false
                                    }}
                                    type="song"
                                />
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
};

export default ExploreCategoriesPage;
