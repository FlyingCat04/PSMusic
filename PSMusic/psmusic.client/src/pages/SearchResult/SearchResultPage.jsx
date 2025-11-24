import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./SearchResultPage.module.css";
import SearchTabs from "../../components/SearchTab/SearchTab";
import SongRow from "../../components/SongRow/SongRow";
import SquareCard from "../../components/SquareCard/SquareCard";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import Pagination from "../../components/Pagination/Pagination";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import axiosInstance from "../../services/axiosInstance"; 

const TAB_TO_TYPE = {
    "Tất cả": "all",
    "Bài hát": "songs",
    "Playlists": "playlists",
    "Nghệ sĩ": "artists",
    "Albums": "albums",
};

const TYPE_TO_TAB = {
    all: "Tất cả",
    songs: "Bài hát",
    playlists: "Playlists",
    artists: "Nghệ sĩ",
    albums: "Albums",
};

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
    artist: Array.isArray(item.artistsName)
        ? item.artistsName.join(", ")
        : "The Cassette",
    imageUrl: checkImage(item.avatarUrl, DEFAULT_SONG_IMAGE),
});

const mapArtist = (item) => ({
    id: item.id,
    name: item.name || "Nghệ sĩ",
    followers: "",
    imageUrl: checkImage(item.avatarUrl, DEFAULT_ARTIST_IMAGE),
});

const SearchResultPage = () => {
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();

    // Header đang navigate `/search?q=...`
    const keyword = params.get("q") || "";
    const type = params.get("t") || "all";
    const pageFromUrl = parseInt(params.get("page") || "1", 10);

    const [activeTab, setActiveTab] = useState(TYPE_TO_TAB[type] || "Tất cả");
    const [page, setPage] = useState(pageFromUrl);

    const [playingSongId, setPlayingSongId] = useState(null);

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
        setActiveTab(TYPE_TO_TAB[type] || "Tất cả");
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
                console.error(err);
                setError("Không tải được kết quả tìm kiếm. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [keyword, page]);

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
        () => (activeTab === "Tất cả" ? artists.slice(0, 4) : artists),
        [artists, activeTab]
    );

    const handlePageChange = (newPage) => {
        setPage(newPage);
        const newParams = Object.fromEntries(params.entries());
        newParams.page = newPage.toString();
        setParams(newParams);
    };

    const handleTabChange = (tabLabel) => {
        setActiveTab(tabLabel);
        const newType = TAB_TO_TYPE[tabLabel] || "all";

        const newParams = Object.fromEntries(params.entries());
        newParams.t = newType;
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

    const handleViewArtist = (artistName) => {
        navigate(`/artist/${encodeURIComponent(artistName)}`);
    };
    if (loading) {
        <LoadSpinner />;
    }

    if (error) {
        return (<p style={{ color: "red" }}>{error}</p>);
    }

    return (
        <div className="content-container">
            <h1 className={styles["sr-title-xl"]}>Kết quả tìm kiếm</h1>

            <SearchTabs active={activeTab} onChange={handleTabChange} />


            {!loading &&
                !error &&
                keyword &&
                songs.length === 0 &&
                !topResult && ( 
                    <p>Không tìm thấy kết quả cho "{keyword}".</p>
                )}

            {/* TOP RESULT: kết quả khớp chính xác */}
            {activeTab === "Tất cả" && topResult && (
                <section className={styles["content-section"]}>
                    <SectionHeader title="Kết quả chính xác" />
                    {topResult.kind === "song" ? (
                        <div className={styles["top-result-row"]}>
                            <SongRow
                                item={{
                                    id: topResult.id,
                                    title: topResult.title,
                                    artist: topResult.artist,
                                    imageUrl: topResult.imageUrl,
                                }}
                                showPlayingIcon={topResult.id === playingSongId}
                                onPlay={() => setPlayingSongId(topResult.id)}
                                onTitleClick={handleTitleClick}
                                onAddToPlaylist={handleAddToPlaylist}
                                onViewArtist={handleViewArtist}
                                activeTab={activeTab}
                            />
                        </div>
                    ) : (
                        <div className={styles["top-result-card"]}>
                            <SquareCard
                                imageUrl={topResult.imageUrl}
                                title={topResult.name}
                                subtitle={topResult.followers}
                                circle
                                onClick={() => handleViewArtist(topResult.name)}
                            />
                        </div>
                    )}
                </section>
            )}

            {/* BÀI HÁT */}
            {(activeTab === "Tất cả" || activeTab === "Bài hát") && songs.length > 0 && (
                <section className={styles["content-section"]}>
                    <SectionHeader
                        title="Bài hát"
                        onMore={
                            activeTab === "Tất cả"
                                ? () => handleTabChange("Bài hát")
                                : undefined
                        }
                    />

                    {/* 2 cột cho tab Tất cả */}
                    {activeTab === "Tất cả" && (
                        <div className={`${styles["sr-rows"]} ${styles["two-col"]}`}>
                            <div className={styles["sr-col"]}>
                                {leftCol.map((s) => (
                                    <SongRow
                                        key={s.id}
                                        item={s}
                                        showPlayingIcon={s.id === playingSongId}
                                        onPlay={() => setPlayingSongId(s.id)}
                                        onTitleClick={handleTitleClick}
                                        onAddToPlaylist={handleAddToPlaylist}
                                        onViewArtist={handleViewArtist}
                                        activeTab={activeTab}
                                    />
                                ))}
                            </div>
                            <div className={styles["sr-col"]}>
                                {rightCol.map((s) => (
                                    <SongRow
                                        key={s.id}
                                        item={s}
                                        showPlayingIcon={s.id === playingSongId}
                                        onPlay={() => setPlayingSongId(s.id)}
                                        onTitleClick={handleTitleClick}
                                        onAddToPlaylist={handleAddToPlaylist}
                                        onViewArtist={handleViewArtist}
                                        activeTab={activeTab}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* bảng + phân trang cho tab Bài hát */}
                    {activeTab === "Bài hát" && (
                        <div className={styles.songsTable}>
                            <div className={styles.songsHeader}>
                                <span>Title</span>
                                <span>Artist</span>
                            </div>
                            {songs.map((s) => (
                                <SongRow
                                    key={s.id}
                                    item={s}
                                    showPlayingIcon={s.id === playingSongId}
                                    onPlay={() => setPlayingSongId(s.id)}
                                    onTitleClick={handleTitleClick}
                                    onAddToPlaylist={handleAddToPlaylist}
                                    onViewArtist={handleViewArtist}
                                    activeTab={activeTab}
                                />
                            ))}

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
            {(activeTab === "Tất cả" || activeTab === "Nghệ sĩ") && artistsForView.length > 0 && (
                <section className={styles["content-section"]}>
                    <SectionHeader
                        title="Nghệ sĩ"
                        onMore={
                            activeTab === "Tất cả"
                                ? () => handleTabChange("Nghệ sĩ")
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
                                onClick={() => handleViewArtist(a.name)}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default SearchResultPage;
