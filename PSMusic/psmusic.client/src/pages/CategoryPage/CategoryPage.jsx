import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import LoadSpinnder from "../../components/LoadSpinner/LoadSpinner";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import SquareCard from "../../components/SquareCard/SquareCard";
import ItemCardColumn from "../../components/ItemCardColumn/ItemCardColumn";
import Pagination from "../../components/Pagination/Pagination";
import { usePlayer } from "../../contexts/PlayerContext";
import styles from "./CategoryPage.module.css";

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

const extractDominantColor = (imgEl) => {
    const canvas = document.createElement("canvas");
    // willReadFrequently để tránh warning
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const width = imgEl.naturalWidth || imgEl.width;
    const height = imgEl.naturalHeight || imgEl.height;

    if (!width || !height) {
        return { r: 120, g: 120, b: 120, css: "rgb(120,120,120)" };
    }

    // Scale nhỏ lại cho nhanh
    const targetSize = 50;
    canvas.width = targetSize;
    canvas.height = targetSize;

    ctx.drawImage(imgEl, 0, 0, targetSize, targetSize);

    const data = ctx.getImageData(0, 0, targetSize, targetSize).data;

    let r = 0, g = 0, b = 0, count = 0;

    // Lấy mẫu mỗi 10 pixel
    for (let i = 0; i < data.length; i += 40) {
        r += data[i];     // R
        g += data[i + 1]; // G
        b += data[i + 2]; // B
        count++;
    }

    const rAvg = Math.round(r / count);
    const gAvg = Math.round(g / count);
    const bAvg = Math.round(b / count);

    return {
        r: rAvg,
        g: gAvg,
        b: bAvg,
        css: `rgb(${rAvg}, ${gAvg}, ${bAvg})`,
    };
};

// Độ sáng tương đối (WCAG luminance)
const getLuminance = (r, g, b) => {
    const normalize = (v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };

    const R = normalize(r);
    const G = normalize(g);
    const B = normalize(b);

    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

// Làm sáng màu (factor: 0 → giữ nguyên, 1 → trắng)
const lightenColor = (r, g, b, factor = 0.4) => {
    const mix = (channel) =>
        Math.round(channel + (255 - channel) * factor);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
};

// Làm tối màu (factor: 0 → đen, 1 → giữ nguyên)
const darkenColor = (r, g, b, factor = 0.6) => {
    const mix = (channel) =>
        Math.round(channel * factor);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
};

const DEFAULT_SONG_IMAGE =
    "https://cdn.pixabay.com/photo/2019/08/11/18/27/icon-4399630_1280.png";
const DEFAULT_ARTIST_IMAGE =
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const checkImage = (url, fallback) => (!url ? fallback : url);

// Thêm hook này vào đầu file CategoryPage.jsx (bên ngoài component)
// hoặc tạo file hooks/useDynamicPageSize.js

const useDynamicPageSize = (minItemWidth, gap, numRows = 2) => {
    const [pageSize, setPageSize] = useState(numRows * 4);
    const [columns, setColumns] = useState(4); // Thêm state để lưu số cột chính xác
    const containerRef = useRef(null);

    useEffect(() => {
        const calculateSize = () => {
            if (containerRef.current) {
                // Lấy style để trừ đi padding của container cha (đảm bảo tính chính xác)
                const style = getComputedStyle(containerRef.current);
                const paddingLeft = parseFloat(style.paddingLeft) || 0;
                const paddingRight = parseFloat(style.paddingRight) || 0;
                
                // Chiều rộng khả dụng cho nội dung
                const containerWidth = containerRef.current.offsetWidth - paddingLeft - paddingRight;

                const itemTotalSpace = minItemWidth + gap;
                
                // Tính số cột tối đa có thể chứa
                let cols = Math.floor((containerWidth + gap) / itemTotalSpace);
                
                // Đảm bảo ít nhất 1 cột
                const safeColumns = cols > 0 ? cols : 1;

                setColumns(safeColumns);
                
                // PageSize luôn là bội số của số cột -> Lấp đầy hàng
                const newSize = safeColumns * numRows;
                
                setPageSize(prev => prev !== newSize ? newSize : prev);
            }
        };

        calculateSize();

        const observer = new ResizeObserver(() => calculateSize());
        if (containerRef.current) observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [minItemWidth, gap, numRows]);

    return { pageSize, columns, containerRef }; // Return thêm columns
};

//const mapSong = (item) => ({
//    id: item.id,
//    title: item.name,
//    artists: item.artists,
//    artistText: item.artists.map(a => a.name).join(", "),
//    imageUrl: checkImage(item.avatarUrl, DEFAULT_SONG_IMAGE),
//});

const mapSong = (item) => ({
    id: item.id,
    title: item.name || "Không tên",
    artistText: item.artists.map(a => a.name).join(", "),
    artists: item.artists,
    imageUrl: checkImage(item.avatarUrl, DEFAULT_SONG_IMAGE),
    mp3Url: item.mp3Url || "",
    duration: item.duration || "00:00",
});

const mapArtist = (item) => ({
    id: item.id,
    name: item.name,
    imageUrl: checkImage(item.avatarUrl, DEFAULT_ARTIST_IMAGE),
});



const CategoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { playSong } = usePlayer();


    const [category, setCategory] = useState({ id, name: "Category", imageUrl: ""});

    const [artists, setArtists] = useState([]);
    const [songs, setSongs] = useState([]);

    const { pageSize: artistPageSize, columns: artistColumns, containerRef: artistRef } = useDynamicPageSize(240, 20, 2);
    const { pageSize: songPageSize, columns: songColumns, containerRef: songRef } = useDynamicPageSize(150, 20, 2);

    // pagination
    const [artistPage, setArtistPage] = useState(1);
    const [artistTotalPages, setArtistTotalPages] = useState(1);

    const [showAllArtists, setShowAllArtists] = useState(false);
    const [showAllSongs, setShowAllSongs] = useState(false);


    const [songPage, setSongPage] = useState(1);
    const [songTotalPages, setSongTotalPages] = useState(1);

    // loading
    const [loading, setLoading] = useState(false);

    // ===========================
    // CALL API: CATEGORY DETAILS
    // ===========================
    useEffect(() => {
        if (!id) return;

        const load = async () => {
            try {
                setLoading(true);

                const res = await axiosInstance.get(`/category/${id}`);
                const data = res.data || {};

                setCategory({
                    id: data.id,
                    name: data.name,
                    imageUrl: data.avatarUrl
                });

            } catch (err) {
                //console.error(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    // ===========================
    // CALL API: ARTISTS
    // ===========================
    useEffect(() => {
        const load = async () => {
            try {
                const res = await axiosInstance.get(`/artist/category/${id}`, {
                    params: { id: id, page: artistPage, size: artistPageSize },
                });

                const data = res.data || {};
                const items = data.items || [];

                setArtists(items.map(mapArtist));
                setArtistTotalPages(data.totalPages || 1);
            } catch (err) {
                //console.error(err);
            }
        };

        if (id) load();
    }, [id, artistPage, artistPageSize]);

    // ===========================
    // CALL API: SONGS
    // ===========================
    useEffect(() => {
        const load = async () => {
            try {
                const res = await axiosInstance.get(`song/category/popular/${id}`, {
                    params: { id: id, page: songPage, size: songPageSize },
                });

                const data = res.data || {};
                const items = data.items || [];

                setSongs(items.map(mapSong));
                setSongTotalPages(data.totalPages || 1);
            } catch (err) {
                //console.error(err);
            }
        };

        if (id) load();
    }, [id, songPage, songPageSize ]);

    useEffect(() => {
        if (!category) return;

        const img = new Image();
        img.crossOrigin = "Anonymous";
        //console.log(category.imageUrl);
        img.src = category.imageUrl;

        img.onload = () => {
            try {
                const { r, g, b, css } = extractDominantColor(img);

                // 1) Màu chủ đạo dùng cho nền
                document.documentElement.style.setProperty("--bg-hero", css);

                // 2) Quyết định độ sáng/tối
                const luminance = getLuminance(r, g, b);

                let playBg;
                let playText;

                if (luminance < 0.45) {
                    // Màu tối → làm nút sáng hơn
                    playBg = lightenColor(r, g, b, 0.4);
                    playText = "#000000";
                } else {
                    // Màu sáng → làm nút đậm hơn
                    playBg = darkenColor(r, g, b, 0.6);
                    playText = "#ffffff";
                }

                document.documentElement.style.setProperty("--artist-play-bg", playBg);
                document.documentElement.style.setProperty("--artist-play-text", playText);
            } catch (err) {
                //console.warn("Không lấy được màu dominant:", err);
            }
        };
    }, [category]);

    const artistsPreview = useMemo(() => artists.slice(0, artistColumns), [artists, artistColumns]);
    const songsPreview = useMemo(() => songs.slice(0, songColumns), [songs, songColumns]);

    const handleViewArtist = (artistId) => navigate(`/artist/${artistId}`);
    //const handleViewSong = (song) => navigate(`/song/${song.id}`);

    if (loading) {
        return (
            <div className={styles.loadingWrapper}>
                <LoadSpinnder />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/* HERO */}
            <section className={styles.hero}>
                <div
                    className={styles.heroBg}
                />
                <div className={styles.heroOverlay}>
                    <h1 className={styles.categoryName}>
                        {category.name}
                    </h1>
                </div>
            </section>

            {/* ARTISTS */}
            {artists.length > 0 && (
                <section className={styles.section} ref={artistRef}>
                    <SectionHeader
                        title="Nghệ sĩ nổi bật"
                        onMore={showAllArtists === false ? () => setShowAllArtists(true) : undefined} // mở chế độ xem đầy đủ
                    />

                    {/* PREVIEW MODE */}
                    <div className={styles.resultGrid} style={{ gridTemplateColumns: `repeat(${artistColumns}, 1fr)` }}>
                        {(!showAllArtists ? artistsPreview : artists).map(a => (
                            <SquareCard
                                key={a.id}
                                imageUrl={a.imageUrl}
                                title={a.name}
                                circle
                                onClick={() => handleViewArtist(a.id)}
                            />
                        ))}
                    </div>

                    {showAllArtists && (
                        <Pagination
                            page={artistPage}
                            totalPages={artistTotalPages}
                            onChange={setArtistPage}
                        />
                    )}
                </section>
            )}

            {/* SONGS */}
            {songs.length > 0 && (
                <section className={styles.section} ref={songRef}>
                    <SectionHeader
                        title="Bài hát"
                        onMore={showAllSongs === false ? () => setShowAllSongs(true) : undefined}
                    />

                    {/* PREVIEW MODE */}
                    {!showAllSongs ? (
                        // PREVIEW MODE
                        <div className={styles.resultGrid}>
                            {songsPreview.map((s) => (
                                <ItemCardColumn
                                    key={s.id}
                                    item={s}
                                    type="song"
                                    onPlay={() => playSong({
                                        ...s,
                                        audioUrl: s.mp3Url,
                                        coverUrl: s.imageUrl,
                                        artist: s.artists?.map(a => a.name) || [],
                                    })}
                                />
                            ))}
                        </div>
                        ) : (
                            // FULL LIST
                            <>
                                <div className={styles.resultGrid}>
                                    {songs.map((s) => (
                                        <ItemCardColumn
                                            key={s.id}
                                            item={s}
                                            type="song"
                                            onPlay={() => playSong({
                                                ...s,
                                                audioUrl: s.mp3Url,
                                                coverUrl: s.imageUrl,
                                                artist: s.artists?.map(a => a.name) || [],
                                            })}
                                        />
                                    ))}
                                </div>

                                <Pagination
                                    page={songPage}
                                    totalPages={songTotalPages}
                                    onChange={setSongPage}
                                />
                            </>
                        )
                    }

                </section>
            )}
        </div>
    );
};

export default CategoryPage;
