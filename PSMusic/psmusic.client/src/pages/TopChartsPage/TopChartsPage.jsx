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
    const [usaSongs, setUsaSongs] = useState([]);
    const [vnSongs, setVnSongs] = useState([]);
    const [popSongs, setPopSongs] = useState([]);
    const [youngSongs, setYoungSongs] = useState([]);
    const [rapSongs, setRapSongs] = useState([]);

    useEffect(() => {
        const cachedData = getTopChartsData();
        if (cachedData) {
            setPopularArtists(cachedData.popularArtists || []);
            setPopularCategories(cachedData.popularCategories || []);
            setUsaSongs(cachedData.usaSongs || []);
            setVnSongs(cachedData.vnSongs || []);
            setPopSongs(cachedData.popSongs || []);
            setYoungSongs(cachedData.youngSongs || []);
            setRapSongs(cachedData.rapSongs || []);
        } else {
            fetchAllData();
        }
    }, []);

    const fetchAllData = async () => {
        try {
        setLoading(true);
        setError(null);

        // Gọi tất cả các API song song
        const [artistsRes, categoriesRes, usaRes, vnRes, popRes, youngRes, rapRes] =
            await Promise.all([
            topChartsService.getPopularArtists(1, 10),
            topChartsService.getPopularCategories(1, 10),
            topChartsService.getPopularSongsByCategory(26, 1, 10), // Nhạc Âu Mỹ
            topChartsService.getPopularSongsByCategory(10, 1, 10), // Nhạc Việt
            topChartsService.getPopularSongsByCategory(1, 1, 10), // Nhạc Pop
            topChartsService.getPopularSongsByCategory(2, 1, 10), // Nhạc Trẻ
            topChartsService.getPopularSongsByCategory(31, 1, 10), // Rap Việt
            ]);

            const data = {
                popularArtists: artistsRes?.items || [],
                popularCategories: categoriesRes?.items || [],
                usaSongs: usaRes?.items || [],
                vnSongs: vnRes?.items || [],
                popSongs: popRes?.items || [],
                youngSongs: youngRes?.items || [],
                rapSongs: rapRes?.items || [],
            };

            setPopularArtists(data.popularArtists);
            setPopularCategories(data.popularCategories);
            setUsaSongs(data.usaSongs);
            setVnSongs(data.vnSongs);
            setPopSongs(data.popSongs);
            setYoungSongs(data.youngSongs);
            setRapSongs(data.rapSongs);

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

    return (
    <div className={styles["charts-main-content"]}>
        {/* Top Nghệ Sĩ */}
        {/* <section className={styles["content-section"]}>
            <div className={styles["section-header"]}>
            <h2 className={styles["section-title"]}>Top Nghệ Sĩ</h2>
            <Link to="/charts/artists" className={styles["see-all-link"]}>
                Xem tất cả
                <ChevronRight />
            </Link>
            </div>
            <div className={styles["items-grid"]}>
            {popularArtists.length > 0 ? (
                popularArtists.map((artist, index) => (
                <ItemTopCharts
                    key={artist.id || artist.artistId}
                    rank={index + 1}
                    song={{
                    id: artist.id || artist.artistId,
                    title: artist.name,
                    artist: artist.bio || "Nghệ sĩ",
                    imageUrl:
                        artist.avatarUrl || "https://via.placeholder.com/100",
                    }}
                />
                ))
            ) : (
                <p className={styles["no-data"]}>Không có dữ liệu</p>
            )}
            </div>
        </section> */}

        {/* Top Nhạc Âu Mỹ và Nhạc Việt */}
        <section className={styles["content-section"]}>
        <div className={styles["dual-column-container"]}>
            {/* Nhạc Âu Mỹ */}
            <div className={styles["column"]}>
                <div className={styles["section-header"]}>
                <h2 className={styles["section-title"]}>Top Nhạc Âu Mỹ</h2>
                <Link to="/charts/usa" className={styles["see-all-link"]}>
                    Xem tất cả
                    <ChevronRight />
                </Link>
                </div>
                <div className={styles["items-list"]}>
                {usaSongs.length > 0 ? (
                    usaSongs.map((song, index) => (
                    <ItemTopCharts
                        key={song.id || song.songId}
                        rank={index + 1}
                    song={{
                        id: song.id || song.songId,
                        title: song.title || song.name,
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
            </div>

            {/* Nhạc Việt */}
            <div className={styles["column"]}>
                <div className={styles["section-header"]}>
                <h2 className={styles["section-title"]}>Top Nhạc Việt</h2>
                <Link to="/charts/vietnam" className={styles["see-all-link"]}>
                    Xem tất cả
                    <ChevronRight />
                </Link>
                </div>
                <div className={styles["items-list"]}>
                {vnSongs.length > 0 ? (
                    vnSongs.map((song, index) => (
                    <ItemTopCharts
                        key={song.id || song.songId}
                        rank={index + 1}
                        song={{
                        id: song.id || song.songId,
                        title: song.title || song.name,
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
            </div>
        </div>
        </section>

        {/* Top Nhạc Pop */}
        <section className={styles["content-section"]}>
            <div className={styles["section-header"]}>
            <h2 className={styles["section-title"]}>Top Nhạc Pop</h2>
            <Link to="/charts/pop" className={styles["see-all-link"]}>
                Xem tất cả
                <ChevronRight />
            </Link>
            </div>
            <div className={styles["items-list"]}>
            {popSongs.length > 0 ? (
                popSongs.map((song, index) => (
                <ItemTopCharts
                    key={song.id || song.songId}
                    rank={index + 1}
                    song={{
                    id: song.id || song.songId,
                    title: song.title || song.name,
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
        </section>

        {/* Top Nhạc Trẻ */}
        <section className={styles["content-section"]}>
            <div className={styles["section-header"]}>
            <h2 className={styles["section-title"]}>Top Nhạc Trẻ</h2>
            <Link to="/charts/young" className={styles["see-all-link"]}>
                Xem tất cả
                <ChevronRight />
            </Link>
            </div>
            <div className={styles["items-list"]}>
            {youngSongs.length > 0 ? (
                youngSongs.map((song, index) => (
                <ItemTopCharts
                    key={song.id || song.songId}
                    rank={index + 1}
                    song={{
                    id: song.id || song.songId,
                    title: song.title || song.name,
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
        </section>

        {/* Top Rap Việt */}
        <section className={styles["content-section"]}>
            <div className={styles["section-header"]}>
            <h2 className={styles["section-title"]}>Top Rap Việt</h2>
            <Link to="/charts/rap" className={styles["see-all-link"]}>
                Xem tất cả
                <ChevronRight />
            </Link>
            </div>
            <div className={styles["items-list"]}>
            {rapSongs.length > 0 ? (
                rapSongs.map((song, index) => (
                <ItemTopCharts
                    key={song.id || song.songId}
                    rank={index + 1}
                    song={{
                    id: song.id || song.songId,
                    title: song.title || song.name,
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
        </section>
    </div>
    );
};

export default TopChartsPage;
