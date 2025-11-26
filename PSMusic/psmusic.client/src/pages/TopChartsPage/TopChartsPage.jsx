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

    // Cấu hình các category cần hiển thị
    const categoryConfigs = [
        { id: 26, key: 'usaSongs', title: 'Top Nhạc Âu Mỹ', route: '/charts/usa' },
        { id: 10, key: 'vnSongs', title: 'Top Nhạc Việt', route: '/charts/vietnam' },
        { id: 1, key: 'popSongs', title: 'Top Nhạc Pop', route: '/charts/pop' },
        { id: 2, key: 'youngSongs', title: 'Top Nhạc Trẻ', route: '/charts/young' },
        { id: 31, key: 'rapSongs', title: 'Top Rap Việt', route: '/charts/rap' },
    ];

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

            // Gọi tất cả các API song song
            const apiCalls = [
                topChartsService.getPopularArtists(1, 10),
                topChartsService.getPopularCategories(1, 10),
                ...categoryConfigs.map(config => 
                    topChartsService.getPopularSongsByCategory(config.id, 1, 10)
                )
            ];

            const results = await Promise.all(apiCalls);
            const [artistsRes, categoriesRes, ...categoryResults] = results;

            // Map kết quả theo key của từng category
            const songsData = {};
            categoryConfigs.forEach((config, index) => {
                songsData[config.key] = categoryResults[index]?.items || [];
            });

            const data = {
                popularArtists: artistsRes?.items || [],
                popularCategories: categoriesRes?.items || [],
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
    const renderCategorySection = (config, isDualColumn = false) => {
        const songs = categorySongs[config.key] || [];        
        const content = (
            <>
                <div className={styles["section-header"]}>
                    <h2 className={styles["section-title"]}>{config.title}</h2>
                    <Link to={config.route} className={styles["see-all-link"]}>
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
            <div className={styles["column"]} key={config.key}>
                {content}
            </div>
        ) : (
            <section className={styles["content-section"]} key={config.key}>
                {content}
            </section>
        );
    };

    return (
        <div className={styles["charts-main-content"]}>
            {/* Top Nhạc Âu Mỹ và Nhạc Việt - Dual Column */}
            <section className={styles["content-section"]}>
                <div className={styles["dual-column-container"]}>
                    {categoryConfigs.slice(0, 2).map(config => renderCategorySection(config, true))}
                </div>
            </section>

            {/* Các category còn lại - Single Column */}
            {categoryConfigs.slice(2).map(config => renderCategorySection(config, false))}
        </div>
    );
};

export default TopChartsPage;
