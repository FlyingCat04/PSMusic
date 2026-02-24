import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import LoadSpinnder from "../../components/LoadSpinner/LoadSpinner";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import SquareCard from "../../components/SquareCard/SquareCard";
import ItemCardColumn from "../../components/ItemCardColumn/ItemCardColumn";
import Pagination from "../../components/Pagination/Pagination";
import { usePlayer } from "../../contexts/PlayerContext";
import { getTranslatedGenre } from "../../utils/genreTranslation";
import styles from "./CategoryPage.module.css";

const TAB_TO_TYPE = {
    "Tất cả": "all",
    "Bài hát": "songs",
    "Playlists": "playlists",
    "Nghệ sĩ": "artists",
    "Albums": "albums",
};

// Removed TAB_TO_TYPE and TYPE_TO_TAB constants as we'll handle translation inside the component or differently if needed.
// For now, if these were used for UI logic that needs translation, we might need to adjust.
// Checking usage: TAB_TO_TYPE is not used in the provided code. TYPE_TO_TAB is not used in the provided code.
// I will just leave them or comment them out if they are unused.
// Based on file content, they are defined but seemingly unused in the rendered output or logic shown.
// However, to be safe, I will leave them alone if they are not preventing compile.
// Wait, looking at the code again, they are NOT used in the visible code. 
// I will proceed with adding useTranslation hook.

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

const ARTIST_PAGE_SIZE = 10;
const SONG_PAGE_SIZE = 12;

const checkImage = (url, fallback) => (!url ? fallback : url);

//const mapSong = (item) => ({
//    id: item.id,
//    title: item.name,
//    artists: item.artists,
//    artistText: item.artists.map(a => a.name).join(", "),
//    imageUrl: checkImage(item.avatarUrl, DEFAULT_SONG_IMAGE),
//});

const mapSong = (item) => ({
    id: item.id,
    title: item.name || "Untitled", // handled by component usually, or we can leave it.
    artistText: item.artists.map(a => a.name).join(", "),
    artists: item.artists,
    imageUrl: checkImage(item.avatarUrl, DEFAULT_SONG_IMAGE),
    mp3Url: item.mp3Url || "",
});

const mapArtist = (item) => ({
    id: item.id,
    name: item.name,
    imageUrl: checkImage(item.avatarUrl, DEFAULT_ARTIST_IMAGE),
});



const CategoryPage = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { playSong, currentSong, isPlaying } = usePlayer();


    const [category, setCategory] = useState({ id, name: "Category", imageUrl: "" });

    const [artists, setArtists] = useState([]);
    const [songs, setSongs] = useState([]);

    // pagination
    const [artistPage, setArtistPage] = useState(1);
    const [artistTotalPages, setArtistTotalPages] = useState(1);

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
                    params: { id: id, page: artistPage, size: ARTIST_PAGE_SIZE },
                });

                const data = res.data || {};
                const items = data.items || [];

                setArtists(items.map(mapArtist));
                setArtistTotalPages(data.totalPages || 1);
            } catch (err) {
                //console.error(err);
            }
        };

        load();
    }, [id, artistPage]);

    // ===========================
    // CALL API: SONGS
    // ===========================
    useEffect(() => {
        const load = async () => {
            try {
                const res = await axiosInstance.get(`song/category/popular/${id}`, {
                    params: { id: id, page: songPage, size: SONG_PAGE_SIZE },
                });

                const data = res.data || {};
                const items = data.items || [];

                setSongs(items.map(mapSong));
                setSongTotalPages(data.totalPages || 1);
            } catch (err) {
                //console.error(err);
            }
        };

        load();
    }, [id, songPage]);

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

    const handleViewArtist = (artistId) => navigate(`/artist/${artistId}`);
    const handleViewSong = (song) => navigate(`/song/${song.id}`);

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
                        {getTranslatedGenre(category.name, t)}
                    </h1>
                </div>
            </section>

            {/* ARTISTS */}
            {artists.length > 0 && (
                <section className={styles.section}>
                    <SectionHeader
                        title={t('featured_artists')}
                    />

                    <div className={styles.artistsGrid}>
                        {artists.map(a => (
                            <SquareCard
                                key={a.id}
                                imageUrl={a.imageUrl}
                                title={a.name}
                                circle
                                onClick={() => handleViewArtist(a.id)}
                            />
                        ))}
                    </div>

                    <Pagination
                        page={artistPage}
                        totalPages={artistTotalPages}
                        onChange={setArtistPage}
                    />
                </section>
            )}

            {/* SONGS */}
            {songs.length > 0 && (
                <section className={styles.section}>
                    <SectionHeader
                        title={t('songs')}
                    />

                    <div className={styles.songsGrid}>
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
                </section>
            )}
        </div>
    );
};

export default CategoryPage;
