import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import GenreCard from '../../components/GenreCard/GenreCard';
import ItemCardColumn from '../../components/ItemCardColumn/ItemCardColumn';
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner';
import exploreCategoriesService from '../../services/exploreCategoriesService';
import { useDataCache } from '../../contexts/DataCacheContext';
import styles from './ExploreCategoriesPage.module.css';

const ExploreCategoriesPage = () => {
    const { getExploreCategoriesData, setExploreCategoriesData } = useDataCache();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [categorySongs, setCategorySongs] = useState({});

    // Danh sách category IDs cần lấy songs
    const FEATURED_CATEGORY_IDS = [1, 2, 8, 10, 26, 38, 39, 40];

    useEffect(() => {
        const cachedData = getExploreCategoriesData();
        if (cachedData) {
            setCategories(cachedData.categories || []);
            setCategorySongs(cachedData.categorySongs || {});
        } else {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Lấy tất cả categories
            const categoriesRes = await exploreCategoriesService.getAllCategories(1, 100);
            const allCategories = categoriesRes?.items || [];

            // Lấy songs cho các category được chọn
            const songPromises = FEATURED_CATEGORY_IDS.map(id =>
                exploreCategoriesService.getSongsByCategory(id, 1, 10)
            );
            const songsResults = await Promise.all(songPromises);

            // Map results to category IDs
            const songsMap = {};
            FEATURED_CATEGORY_IDS.forEach((id, index) => {
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
            console.error('Error fetching explore categories data:', err);
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadSpinner />;
    }

    if (error) {
        return (
            <div className={styles['explore-main-content']}>
                <div className={styles['error-container']}>
                    <p>{error}</p>
                    <button onClick={fetchData} className={styles['retry-button']}>
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    // Lấy tên category theo ID
    const getCategoryName = (id) => {
        const category = categories.find(cat => cat.id === id);
        return category?.name || `Category ${id}`;
    };

    return (
        <div className={styles['explore-main-content']}>
            {/* Categories Grid Section */}
            <section className={styles['content-section']}>
                <div className={styles['category-grid']}>
                    {categories.length > 0 ? (
                        categories.slice(0, 16).map((category) => (
                            <GenreCard
                                key={category.id}
                                genre={{
                                    id: category.id,
                                    title: category.name,
                                    imageUrl: category.avatarUrl || 'https://via.placeholder.com/200',
                                    color: category.color || '#FF4E50'
                                }}
                            />
                        ))
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>Không có thể loại nào</p>
                    )}
                </div>
            </section>

            {/* Category Songs Sections */}
            {FEATURED_CATEGORY_IDS.map((categoryId) => {
                const songs = categorySongs[categoryId] || [];
                if (songs.length === 0) return null;

                return (
                    <section key={categoryId} className={styles['content-section']}>
                        <div className={styles['section-header']}>
                            <h2 className={styles['section-title']}>Khám phá thể loại {getCategoryName(categoryId)}</h2>
                            <Link to={`/category/${categoryId}`} className={styles['see-all-link']}>
                                Tất cả
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
                                        : [{ name: 'Unknown Artist' }],
                                        imageUrl: song.avatarUrl || song.imageUrl || 'https://via.placeholder.com/200',
                                        mp3Url: song.mp3Url
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
