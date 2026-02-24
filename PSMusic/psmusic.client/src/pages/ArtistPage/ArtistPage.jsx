import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import axiosInstance from "../../services/axiosInstance";
import { usePlayer } from "../../contexts/PlayerContext";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import SquareCard from "../../components/SquareCard/SquareCard";
import TrackTable from "../../components/TrackTable/TrackTable";
import Pagination from "../../components/Pagination/Pagination";
import styles from "./ArtistPage.module.css";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";



const DEFAULT_SONG_IMAGE =
    "https://cdn.pixabay.com/photo/2019/08/11/18/27/icon-4399630_1280.png";
const DEFAULT_ARTIST_IMAGE =
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const PAGE_SIZE = 10;


// helper check ảnh
const checkImage = (url, fallback) => {
    if (!url) return fallback;

    const img = new Image();
    img.src = url;
    img.onerror = () => {
        img.src = fallback;
    };

    return url;
};

// Lấy màu trung bình từ ảnh + trả về cả r,g,b và css string
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


// map dữ liệu từ backend
const mapSong = (item) => ({
    id: item.id,
    title: item.name || "Không tên",
    artistText: item.artists.map(a => a.name).join(", "),
    artists: item.artists,
    imageUrl: checkImage(item.avatarUrl, DEFAULT_SONG_IMAGE),
    mp3Url: item.mp3Url || "",
    duration: item.duration,
});

const mapArtist = (item) => ({
    id: item.id,
    name: item.name || "Nghệ sĩ",
    imageUrl: checkImage(item.avatarUrl, DEFAULT_ARTIST_IMAGE),
});


const ArtistPage = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    //const [playingSongId, setPlayingSongId] = useState(null);
    const { playSong, currentSong, isPlaying, playPlaylist } = usePlayer();

    // hero artist
    const [artist, setArtist] = useState({
        id,
        name: "Artist",
        avatarUrl: DEFAULT_ARTIST_IMAGE,
    });
    const [loadingArtist, setLoadingArtist] = useState(false);

    // main songs
    const [mainSongs, setMainSongs] = useState([]);
    const [mainPage, setMainPage] = useState(1);
    const [mainTotalPages, setMainTotalPages] = useState(1);
    const [loadingMain, setLoadingMain] = useState(false);

    // collab songs
    const [collabSongs, setCollabSongs] = useState([]);
    const [collabPage, setCollabPage] = useState(1);
    const [collabTotalPages, setCollabTotalPages] = useState(1);
    const [loadingCollab, setLoadingCollab] = useState(false);

    // related artists
    const [relatedArtists, setRelatedArtists] = useState([]);
    const [loadingRelated, setLoadingRelated] = useState(false);
    const [relatedArtistPage, setRelatedArtistPage] = useState(1);
    const [relatedArtistTotalPages, setRelatedArtistTotalPages] = useState(1);

    const [error, setError] = useState("");

    //gọi API nghệ sĩ

    useEffect(() => {
        if (!id) return;

        const fetchArtistDetails = async () => {
            try {
                setLoadingArtist(true);
                <LoadSpinner />
                setError("");

                const res = await axiosInstance.get(
                    `/artist/${id}`);

                const data = res.data || {};

                setArtist({
                    id: data.id,
                    name: data.name,
                    avatarUrl: data.avatarUrl || DEFAULT_ARTIST_IMAGE
                });

            } catch (err) {
                //console.error(err);
                setError(t('error_loading_artist'));
            } finally {
                setLoadingArtist(false);
            }
        };
        fetchArtistDetails();
    }, [id]);

    //chỉnh màu nền hero
    useEffect(() => {
        if (!artist || !artist) return;

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = artist.avatarUrl;

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
    }, [artist]);



    // gọi API bài hát chính
    useEffect(() => {
        if (!id) return;

        const fetchMain = async () => {
            try {
                setLoadingMain(true);
                setError("");

                const res = await axiosInstance.get(
                    `/song/artist/main/${id}`,
                    {
                        params: {
                            page: mainPage,
                            size: PAGE_SIZE,
                        },
                    }
                );

                const data = res.data || {};
                const items = data.items || [];
                setMainSongs(items.map(mapSong));
                setMainTotalPages(data.totalPages || 1);
            } catch (err) {
                //console.error(err);
                setError(t('error_loading_main_songs'));
            } finally {
                setLoadingMain(false);
            }
        };

        fetchMain();
    }, [id, mainPage]);

    // gọi API bài hát collab
    useEffect(() => {
        if (!id) return;

        const fetchCollab = async () => {
            try {
                setLoadingCollab(true);
                setError("");

                const res = await axiosInstance.get(
                    `/song/artist/collab/${id}`,
                    {
                        params: {
                            page: collabPage,
                            size: PAGE_SIZE,
                        },
                    }
                );

                const data = res.data || {};
                const items = data.items || [];
                setCollabSongs(items.map(mapSong));
                setCollabTotalPages(data.totalPages || 1);
            } catch (err) {
                //console.error(err);
                setError(t('error_loading_collab_songs'));
            } finally {
                setLoadingCollab(false);
            }
        };

        fetchCollab();
    }, [id, collabPage]);

    // gọi API nghệ sĩ liên quan (khi backend xong)
    useEffect(() => {
        if (!id) return;

        const fetchRelated = async () => {
            try {
                setLoadingRelated(true);
                // nếu API đang hư thì có thể comment khối này
                const res = await axiosInstance.get(
                    `/artist/related/${id}`
                );
                const data = res.data || {};
                const items = data.items || data || [];
                // tuỳ backend: nếu trả về [] thì map trực tiếp, nếu {items:[]} thì lấy items
                const mapped = Array.isArray(items)
                    ? items.map(mapArtist)
                    : [];
                setRelatedArtists(mapped);

                const total = Math.max(1, Math.ceil(mapped.length / 4));
                setRelatedArtistTotalPages(total);
            } catch (err) {
                //console.error(err);
                setRelatedArtists([]);
                setRelatedArtistTotalPages(1);
            } finally {
                setLoadingRelated(false);
            }
        };

        fetchRelated();
    }, [id]);

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

    const handleMainPageChange = (newPage) => {
        setMainPage(newPage);
    };

    const handleCollabPageChange = (newPage) => {
        setCollabPage(newPage);
    };

    const handlerelatedArtistPageChange = (newPage) => {
        setRelatedArtistPage(newPage);
    };

    const handlePlayArtist = () => {
        if (mainSongs && mainSongs.length > 0) {
            playPlaylist(mainSongs, 0, {
                type: 'ARTIST_MAIN',
                id: id,
                page: 1
            });
        }
        else if (collabSongs && collabSongs.length > 0) {
            playPlaylist(collabSongs, 0, {
                type: 'ARTIST_COLLAB',
                id: id,
                page: 1
            });
        }
    };

    if (!artist) {
        <LoadSpinner />
    }

    const relatedForView = useMemo(() => {
        const start = (relatedArtistPage - 1) * 4;
        return relatedArtists.slice(start, start + 4);
    }, [relatedArtists, relatedArtistPage]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id, mainPage, collabPage]);

    return (
        <div className={styles.page}>
            {/* HERO */}
            <section className={styles.hero}>
                <div className={styles.heroBg} />

                <div className={styles.heroOverlay}>
                    <img
                        src={artist.avatarUrl}
                        alt={artist.name}
                        className={styles.avatar}
                        onError={(e) => {
                            e.target.src = DEFAULT_ARTIST_IMAGE;
                        }}
                    />

                    <div className={styles.heroMeta}>
                        <h1 className={styles.artistName}>
                            {artist.name}
                        </h1>

                        <div className={styles.actions}>
                            <button className={styles.playButton} onClick={handlePlayArtist}
                                disabled={mainSongs.length === 0 && collabSongs.length === 0}>
                                <Play className={styles.playIcon} />
                                {t('play')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {error && (
                <p style={{ color: "red", marginTop: 16 }}>{error}</p>
            )}

            {/* BÀI HÁT CHÍNH */}
            {mainSongs.length > 0 && (
                <section className={styles.section}>
                    <SectionHeader title={t('artist_main_songs')} />
                    {loadingMain ? (
                        <LoadSpinner />
                    ) : (
                        <>
                            <div className={styles.songList}>
                                <TrackTable
                                    songs={mainSongs}
                                    currentSong={currentSong}
                                    isPlaying={isPlaying}
                                    onPlay={playSong}
                                    onTitleClick={handleTitleClick}
                                    onAddToPlaylist={handleAddToPlaylist}
                                    onViewArtist={handleViewArtist}
                                    page={mainPage}
                                    pageSize={PAGE_SIZE}
                                />
                            </div>
                            <Pagination
                                page={mainPage}
                                totalPages={mainTotalPages}
                                onChange={handleMainPageChange}
                            />
                        </>
                    )}
                </section>
            )}

            {/* BÀI HÁT COLLAB */}
            {collabSongs.length > 0 && (
                <section className={styles.section}>
                    <SectionHeader title={t('artist_collab_songs')} />
                    {loadingCollab ? (
                        <LoadSpinner />
                    ) : (
                        <>
                            <div className={styles.songList}>
                                <TrackTable
                                    songs={collabSongs}
                                    currentSong={currentSong}
                                    isPlaying={isPlaying}
                                    onPlay={playSong}
                                    onTitleClick={handleTitleClick}
                                    onAddToPlaylist={handleAddToPlaylist}
                                    onViewArtist={handleViewArtist}
                                    page={collabPage}
                                    pageSize={PAGE_SIZE}
                                />
                            </div>
                            <Pagination
                                page={collabPage}
                                totalPages={collabTotalPages}
                                onChange={handleCollabPageChange}
                            />
                        </>
                    )}
                </section>
            )}

            {/* NGHỆ SĨ LIÊN QUAN */}
            {relatedArtists.length > 0 && (
                <section className={styles.section}>
                    <SectionHeader title={t('related_artists')} />
                    <div className={styles.resultGrid}>
                        {(relatedForView || relatedArtists).map((a) => (
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
                    <Pagination
                        page={relatedArtistPage}
                        totalPages={relatedArtistTotalPages}
                        onChange={handlerelatedArtistPageChange}
                    />
                </section>
            )}
        </div>
    );
};

export default ArtistPage;
