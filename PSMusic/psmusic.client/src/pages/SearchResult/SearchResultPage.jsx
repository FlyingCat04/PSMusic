import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./SearchResultPage.module.css";
import SearchTabs from "../../components/SearchTab/SearchTab";
import ItemCardRow from "../../components/ItemCardRow/ItemCardRow";
import SquareCard from "../../components/SquareCard/SquareCard";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import Pagination from "../../components/Pagination/Pagination";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import TrackTable from "../../components/TrackTable/TrackTable";
import axiosInstance from "../../services/axiosInstance";
import { usePlayer } from "../../contexts/PlayerContext";
import { useTranslation } from 'react-i18next';

// Dùng type key cố định (không phụ thuộc ngôn ngữ) để làm anchor
// labelKey tương ứng với key đã có sẵn trong file i18n (vi.json, en.json...)
const SEARCH_TABS = [
    { type: "all", labelKey: "all" },
    { type: "songs", labelKey: "songs" },
    { type: "artists", labelKey: "artists" },
    // { type: "playlists", labelKey: "playlists" },
    // { type: "albums",    labelKey: "albums"    },
];

const PAGE_SIZE = 12;
const SONG_NUMBER = 500;

// ảnh mặc định nếu backend không có avatarUrl
const DEFAULT_SONG_IMAGE =
    "https://cdn.pixabay.com/photo/2019/08/11/18/27/icon-4399630_1280.png";
const DEFAULT_ARTIST_IMAGE =
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";



// helper map dữ liệu từ backend sang dạng frontend dùng
const checkImage = (url, fallback) => {
    if (!url) return fallback;

    const img = new Image();
    img.src = url;

    img.onerror = () => {
        img.src = fallback;
    };

    return url;
};


const mapSong = (item) => ({
    id: item.id,
    title: item.name || "Không tên",
    artistText: item.artists.map(a => a.name).join(", "),
    artists: item.artists,
    imageUrl: checkImage(item.avatarUrl, DEFAULT_SONG_IMAGE),
    mp3Url: item.mp3Url || "",
    duration: item.duration || "",
});

const mapArtist = (item) => ({
    id: item.id,
    name: item.name || "Nghệ sĩ",
    followers: "",
    imageUrl: checkImage(item.avatarUrl, DEFAULT_ARTIST_IMAGE),
});

const SearchResultPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();

    // Header đang navigate `/search?q=...`
    const keyword = params.get("q") || "";
    const type = params.get("t") || "all";
    const pageFromUrl = parseInt(params.get("page") || "1", 10);

    // activeTab lưu type key ("all", "songs"...) thay vì chuỗi hiển thị
    const [activeTab, setActiveTab] = useState(type || "all");
    const [page, setPage] = useState(pageFromUrl);

    //const [playingSongId, setPlayingSongId] = useState(null);
    const { playSong, currentSong, isPlaying } = usePlayer();

    // dữ liệu từ backend
    const [topResult, setTopResult] = useState(null); // { kind: "song"/"artist", ...mapped }
    const [songs, setSongs] = useState([]);           // chỉ type = "song"
    const [artists, setArtists] = useState([]);       // chỉ type = "artist"

    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // đồng bộ với URL
    useEffect(() => {
        setPage(pageFromUrl);
    }, [pageFromUrl]);

    useEffect(() => {
        setActiveTab(type || "all");
    }, [type]);

    // gọi API thật mỗi khi keyword hoặc page thay đổi
    useEffect(() => {
        const fetchResults = async () => {
            const trimmed = keyword.trim();
            if (!trimmed) {
                setTopResult(null);
                setSongs([]);
                setArtists([]);
                setTotalPages(1);
                setError("");
                return;
            }

            try {
                setLoading(true);
                setError("");

                const res = await axiosInstance.get("/song/search", {
                    params: {
                        keyword: trimmed,
                        page,
                        size: PAGE_SIZE,
                    },
                });

                const data = res.data || {};
                const rawTop = data.topResult || null;
                const results = data.results || [];
                setTotalPages(data.totalPages || 1);

                // map topResult
                let mappedTop = null;
                if (rawTop) {
                    if (rawTop.type === "song") {
                        mappedTop = { kind: "song", ...mapSong(rawTop) };
                    } else if (rawTop.type === "artist") {
                        mappedTop = { kind: "artist", ...mapArtist(rawTop) };
                    }
                }

                // tách riêng song / artist
                const songItems = [];
                const artistItems = [];

                results.forEach((item) => {
                    if (item.type === "song") {
                        songItems.push(mapSong(item));
                    } else if (item.type === "artist") {
                        artistItems.push(mapArtist(item));
                    }
                    // sau này nếu có playlist/album thì thêm case ở đây
                });

                setTopResult(mappedTop);
                setSongs(songItems);
                setArtists(artistItems);

                // tuỳ backend, nếu có totalPages hoặc total thì set chính xác

            } catch (err) {
                //console.error(err);
                setError("Không tải được kết quả tìm kiếm. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [keyword, page]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    // 2 cột bài hát cho tab "Tất cả"
    const { leftCol, rightCol } = useMemo(() => {
        let base = songs.slice(0, 10); // giới hạn 10 bài trong tab Tất cả
        const half = Math.ceil(base.length / 2);
        return {
            leftCol: base.slice(0, half),
            rightCol: base.slice(half),
        };
    }, [songs]);

    // danh sách bài hát cho tab "Bài hát" (bảng + phân trang)
    //const pagedSongs = useMemo(() => {
    //    // page bắt đầu từ 1
    //    const start = (page - 1) * PAGE_SIZE; // bài đầu của trang hiện tại
    //    const end = start + PAGE_SIZE;        // bài cuối (không bao gồm end)
    //    return songs.slice(start, end);       // cắt mảng songs theo trang
    //}, [songs, page]);

    // nghệ sĩ hiển thị
    const artistsForView = useMemo(
        () => (activeTab === "all" ? artists.slice(0, 4) : artists),
        [artists, activeTab]
    );

    // Danh sách tab với label đã dịch, tạo trong component để t() reactive
    const tabItems = SEARCH_TABS.map((tab) => ({
        type: tab.type,
        label: t(tab.labelKey),
    }));

    const handlePageChange = (newPage) => {
        setPage(newPage);
        const newParams = Object.fromEntries(params.entries());
        newParams.page = newPage.toString();
        setParams(newParams);
    };

    const handleTabChange = (tabType) => {
        // tabType là type key cố định ("all", "songs"...) từ SearchTabs
        setActiveTab(tabType);
        const newParams = Object.fromEntries(params.entries());
        newParams.t = tabType;
        newParams.page = "1";
        setParams(newParams);
    };

    const handleTitleClick = (song) => {
        navigate(`/song/${song.id}`);
    };

    const handleAddToPlaylist = (song, playlist) => {
        if (playlist.id === "new") {
            // mở modal tạo playlist
        } else {
            // call API add vào playlist.id
        }
    };

    const handleViewArtist = (artistId) => {
        navigate(`/artist/${artistId}`);
    };
    if (loading) {
        <LoadSpinner />;
    }

    if (error) {
        return (<p style={{ color: "red" }}>{error}</p>);
    }



    return (
        <div className="content-container">
            <h1 className={styles["sr-title-xl"]}>{t('search_result_page_header')}</h1>

            <SearchTabs items={tabItems} active={activeTab} onChange={handleTabChange} />


            {!loading &&
                !error &&
                keyword &&
                songs.length === 0 &&
                !topResult && (
                    <p>{t('not_found_msg')} "{keyword}".</p>
                )}

            {/* TOP RESULT: kết quả khớp chính xác */}
            {activeTab === "all" && topResult && (
                <section className={styles["content-section"]}>
                    <SectionHeader title={t('top_result_label')} />
                    {topResult.kind === "song" ? (
                        <div className={styles["top-result-row"]}>
                            <ItemCardRow
                                song={{
                                    id: topResult.id,
                                    title: topResult.title,
                                    artists: topResult.artists,
                                    imageUrl: topResult.imageUrl,
                                    mp3Url: topResult.mp3Url,
                                }}
                            />
                        </div>
                    ) : (
                        <div className={styles["top-result-card"]}>
                            <SquareCard
                                imageUrl={topResult.imageUrl}
                                title={topResult.name}
                                subtitle={topResult.followers}
                                circle
                                onClick={() => handleViewArtist(topResult.id)}
                            />
                        </div>
                    )}
                </section>
            )}

            {/* BÀI HÁT */}
            {(activeTab === "all" || activeTab === "songs") && songs.length > 0 && (
                <section className={styles["content-section"]}>
                    <SectionHeader
                        title={t('tab_songs')}
                        onMore={
                            activeTab === "all"
                                ? () => handleTabChange("songs")
                                : undefined
                        }
                    />

                    {/* 2 cột cho tab Tất cả */}
                    {activeTab === "all" && (
                        <div className={`${styles["sr-rows"]} ${styles["two-col"]}`}>
                            <div className={styles["sr-col"]}>
                                {leftCol.map((s) => (
                                    <ItemCardRow
                                        key={s.id}
                                        song={s}
                                    />
                                ))}
                            </div>
                            <div className={styles["sr-col"]}>
                                {rightCol.map((s) => (
                                    <ItemCardRow
                                        key={s.id}
                                        song={s}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* bảng + phân trang cho tab Bài hát */}
                    {activeTab === "songs" && (
                        <div className={styles.songList}>

                            <TrackTable
                                songs={songs}
                                currentSong={currentSong}
                                isPlaying={isPlaying}
                                onPlay={playSong}
                                onTitleClick={handleTitleClick}
                                onAddToPlaylist={handleAddToPlaylist}
                                onViewArtist={handleViewArtist}
                                page={page}
                                pageSize={PAGE_SIZE}
                            />

                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onChange={handlePageChange}
                            />
                        </div>
                    )}
                </section>
            )}

            {/* NGHỆ SĨ */}
            {(activeTab === "all" || activeTab === "artists") && artistsForView.length > 0 && (
                <section className={styles["content-section"]}>
                    <SectionHeader
                        title={t('tab_artists')}
                        onMore={
                            activeTab === "all"
                                ? () => handleTabChange("artists")
                                : undefined
                        }
                    />
                    <div className={styles["result-grid"]}>
                        {artistsForView.map((a) => (
                            <SquareCard
                                key={a.id}
                                imageUrl={a.imageUrl}
                                title={a.name}
                                subtitle={a.followers}
                                circle
                                onClick={() => handleViewArtist(a.id)}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default SearchResultPage;
