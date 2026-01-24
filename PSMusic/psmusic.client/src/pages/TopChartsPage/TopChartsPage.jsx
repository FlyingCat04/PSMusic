import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ItemTopCharts from "../../components/ItemTopCharts/ItemTopCharts";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import topChartsService from "../../services/topChartsService";
import { useDataCache } from "../../contexts/DataCacheContext";
import styles from "./TopChartsPage.module.css";

const TopChartsPage = () => {
    const { getTopChartsData, setTopChartsData } = useDataCache();
    const [loading, setLoading] = useState(false);
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
        } else {
            fetchAllData();
        }
    }, []);

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
            console.error("Error fetching top charts data:", err);
            setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadSpinner />;
    }

    if (error) {
        return (
            <div className={styles["charts-main-content"]}>
                <div className={styles["error-container"]}>
                    <p>{error}</p>
                    <button onClick={fetchAllData} className={styles["retry-button"]}>
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    // Render một section cho category
    const renderCategorySection = (category, isDualColumn = false) => {
        const songs = categorySongs[category.id] || [];        
        const content = (
            <>
                <div className={styles["section-header"]}>
                    <h2 className={styles["section-title"]}>Top {category.name}</h2>
                    <Link to={`/category/${category.id}`} className={styles["see-all-link"]}>
                        Xem tất cả
                        <ChevronRight />
                    </Link>
                </div>
                <div className={styles["items-list"]}>
                    {songs.length > 0 ? (
                        songs.map((song, index) => (
                            <ItemTopCharts
                                key={song.id || song.songId}
                                rank={index + 1}
                                song={{
                                    id: song.id || song.songId,
                                    title: song.name || song.title,
                                    artists: Array.isArray(song.artists) 
                                        ? song.artists 
                                        : [{ name: 'Unknown Artist' }],
                                    imageUrl:
                                        song.avatarUrl ||
                                        song.imageUrl ||
                                        "https://via.placeholder.com/100",
                                    mp3Url: song.mp3Url
                                }}
                            />
                        ))
                    ) : (
                        <p className={styles["no-data"]}>Không có dữ liệu</p>
                    )}
                </div>
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
