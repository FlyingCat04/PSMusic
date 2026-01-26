import React, { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react";
import styles from "./SongRow.module.css";

const SongRow = ({ item, showPlayingIcon = false, onPlay, onTitleClick, onAddToPlaylist, onViewArtist, activeTab = "", hideInnerArtist= false}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isHoverCover, setIsHoverCover] = useState(false);
    //const [artistMenuOpen, setArtistMenuOpen] = useState(false);

    //const [playlistMenuOpen, setPlaylistMenuOpen] = useState(false);
    //const [playlistQuery, setPlaylistQuery] = useState("");

    //const [playlistMenuPlacement, setPlaylistMenuPlacement] = useState("right");
    //const playlistMenuRef = useRef(null);

    //const [artistMenuPlacement, setArtistMenuPlacement] = useState("right"); // "right" | "left"
    //const artistMenuRef = useRef(null);

    const menuRef = useRef(null);

    const activeTabChose = activeTab || "";
    

    const DEFAULT_SONG_IMAGE = "https://cdn.pixabay.com/photo/2019/08/11/18/27/icon-4399630_1280.png";

    const handleRowStyle = () => { 
        return activeTab === "Bài hát" ? "sr-song-tab" : "sr-row";
    };

    const handleMetaStyle = () => {
        return activeTab === "Bài hát" ? "sr-meta-tab" : "sr-meta";
    };

    const handleTitleStyle = () => {
        return activeTab === "Bài hát" ? "sr-title-tab" : "sr-title";
    };

    //const playlists = [
    //    { id: 1, name: "My 2024 Playlist in a Bottle" },
    //    { id: 2, name: "THE 8" },
    //    { id: 3, name: "Lộn xộn" },
    //    { id: 4, name: "hopeless romantic" },
    //    { id: 5, name: "Wishing" },
    //    { id: 6, name: "Shadow of you" },
    //    { id: 7, name: "Shadow of you" },
    //    { id: 8, name: "Shadow of you" },
    //    { id: 9, name: "Shadow of you" },
    //];

    //const filteredPlaylists = playlists.filter((pl) =>
    //    pl.name.toLowerCase().includes(playlistQuery.toLowerCase())
    //);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    //useEffect(() => {
    //    if (!artistMenuOpen) return;
    //    if (artistMenuPlacement === "left") return;

    //    const raf = window.requestAnimationFrame(() => {
    //        if (!artistMenuRef.current) return;
    //        const rect = artistMenuRef.current.getBoundingClientRect();
    //        const vw = window.innerWidth || document.documentElement.clientWidth;

    //        // Nếu chạm mép phải (chừa 30px), thì cho submenu mở sang trái
    //        if (rect.right > vw - 30) {
    //            setArtistMenuPlacement("left");
    //        } else {
    //            setArtistMenuPlacement("right");
    //        }
    //    });

    //    return () => window.cancelAnimationFrame(raf);
    //}, [artistMenuOpen, artistMenuPlacement]);

    //useEffect(() => {
    //    if (!playlistMenuOpen) return;
    //    if (playlistMenuPlacement === "left") return;

    //    const raf = window.requestAnimationFrame(() => {
    //        if (!playlistMenuRef.current) return;
    //        const rect = playlistMenuRef.current.getBoundingClientRect();
    //        const vw = window.innerWidth || document.documentElement.clientWidth;

    //        if (rect.right > vw - 15) {
    //            setPlaylistMenuPlacement("left");
    //        } else {
    //            setPlaylistMenuPlacement("right");
    //        }
    //    });

    //    return () => window.cancelAnimationFrame(raf);
    //}, [playlistMenuOpen, playlistMenuPlacement]);


    //const toggleMenu = (e) => {
    //    e.stopPropagation();          // không trigger click vào cả row
    //    setMenuOpen((prev) => !prev);
    //};

    //const handleMenuAction = (action, payload) => {
    //    switch (action) {
    //        case "play":
    //            onPlay?.(item);
    //            break;

    //        case "add-to-playlist":
    //            if (onAddToPlaylist) onAddToPlaylist(item, payload);
    //            break;

    //        case "view-artist":
    //            if (onViewArtist) onViewArtist(item.artistId);
    //            break;
    //        default:
    //            console.warn("No handler for action:", action);
    //    }
    //    setMenuOpen(false);
    //};

    return (

        <div className={styles[handleRowStyle(activeTab)]}>
            {/* COVER + TITLE + ARTIST */}
            {activeTab === "Bài hát" ? (
                <>
                    {/* Cột 1: avatar + tên bài hát */}
                    <div className={styles["sr-col-cover-title"]} onClick={() => onPlay?.(item)}>
                        <div
                            className={styles["sr-avatar-wrapper"]}
                            onMouseEnter={() => setIsHoverCover(true)}
                            onMouseLeave={() => setIsHoverCover(false)}
                        >
                            <img
                                className={styles["sr-cover"]}
                                src={item.imageUrl}
                                alt=""
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            />

                            {showPlayingIcon && (
                                <div className={styles["sr-cover-playing"]}>
                                    <div className={styles["sr-eq"]}>
                                        <span />
                                        <span />
                                        <span />
                                    </div>
                                </div>
                            )}

                            {/* Nếu KHÔNG phát và đang hover → hiện nút play */}
                            {!showPlayingIcon && isHoverCover && (
                                <div className={styles["sr-play-overlay"]}>
                                    <button
                                        type="button"
                                        className={styles["sr-play-button"]}
                                        onClick={() => onPlay?.(item)}
                                    >
                                        <Play className={styles["sr-play-icon"]} fill="currentColor" />
                                    </button>
                                </div>
                            )}

                        </div>

                        <button
                            className={styles["sr-title-songtab"]}
                            onClick={() => onTitleClick?.(item)}
                        >
                            {item.title}
                        </button>
                    </div>

                    {/* Cột 2: nghệ sĩ */}
                    <div className={styles["sr-col-artist"]}>
                        {item.artists && item.artists.length > 0 ? (() => { 
                            const maxArtists = 3; 
                            const displayed = item.artists.slice(0, maxArtists);
                            const hasMore = item.artists.length > maxArtists;
                            return (
                                <>
                                    {displayed.map((a, idx) => (
                                        <span
                                            key={a.id || `artist-${idx}`} // Sử dụng index làm dự phòng nếu id null
                                            className={styles.artistName}
                                            onClick={() => onViewArtist?.(a.id)}
                                        >
                                            {a.name}
                                            {idx < displayed.length - 1 ? ", " : ""}
                                        </span>
                                    ))}

                                    {hasMore && <span className={styles.moreArtists}>…</span>}
                                </>
                            );
                        })() : item.artistText}
                    </div>
                </>
            ) : (
                <>
                    {/* layout cũ cho tab khác */}
                        <div className={styles["sr-avatar-wrapper"]}
                            onClick={() => onPlay?.(item)}
                            onMouseEnter={() => setIsHoverCover(true)}
                            onMouseLeave={() => setIsHoverCover(false)}
                        >
                        <img
                            className={styles["sr-cover"]}
                            onClick={() => onPlay?.(item)} 
                            src={item.imageUrl}
                            alt=""
                            onError={(e) => {
                                e.target.src = DEFAULT_SONG_IMAGE;
                            }}
                        />

                        {showPlayingIcon && (
                            <div className={styles["sr-cover-playing"]}>
                                <div className={styles["sr-eq"]}>
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            </div>
                        )}

                        {/* Nếu KHÔNG phát và đang hover → hiện nút play */}
                        {!showPlayingIcon && isHoverCover && (
                            <div className={styles["sr-play-overlay"]}>
                                <button
                                    type="button"
                                    className={styles["sr-play-button"]}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPlay?.(item);   // Bấm 1 lần là play luôn
                                    }}
                                >
                                    <Play className={styles["sr-play-icon"]} fill="currentColor" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* META */}
                    <div className={styles[handleMetaStyle(activeTab)]}>
                        <button
                            className={styles[handleTitleStyle(activeTab)]}
                            onClick={() => onTitleClick?.(item)}
                        >
                            {item.title}
                        </button>
                        {!hideInnerArtist && (
                            <div className={styles["sr-subtitle"]}>
                            {(() => {
                                const maxArtists = 2;
                                const displayed = item.artists.slice(0, maxArtists);
                                const hasMore = item.artists.length > maxArtists;

                                return (
                                    <>
                                        {displayed.map((a, idx) => (
                                            <span
                                                key={a.id || `inner-artist-${idx}`} // Khắc phục lỗi key null tại đây
                                                className={styles.artistName}
                                                onClick={() => onViewArtist?.(a.id)}
                                            >
                                                {a.name}
                                                {idx < displayed.length - 1 ? ", " : ""}
                                            </span>
                                        ))}

                                        {hasMore && <span className={styles.moreArtists}>…</span>}
                                    </>
                                );
                            })()}
                            </div>
                        )}
                    </div>
                </>
            )}
             

            {/* ACTIONS */}
            {activeTab === "Bài hát" && item.duration && (
                <span className={styles["sr-duration"]}>
                    {item.duration}
                </span>
            )}
            {/*<div className={styles["sr-right"]}>*/}
            {/*    <button*/}
            {/*        type="button"*/}
            {/*        className={styles["sr-dotsButton"]}*/}
            {/*        onClick={toggleMenu}*/}
            {/*    >*/}
            {/*        <span className={styles["sr-dotsIcon"]}><div></div></span>*/}
            {/*    </button>*/}
            {/*</div>*/}

            {/*{menuOpen && (*/}
            {/*    <div className={styles["sr-menu"]} ref={menuRef}>*/}
            {/*        <button className={styles["sr-menuItem"]} onClick={() => handleMenuAction("play")}>Phát bài này</button>*/}
            {/*        <div*/}
            {/*            className={`${styles["sr-menuItem"]} ${styles["sr-menuItemHasSub"]}`}*/}
            {/*            onMouseEnter={() => setPlaylistMenuOpen(true)}*/}
            {/*            onMouseLeave={() => setPlaylistMenuOpen(false)}*/}
            {/*        >*/}
            {/*            <span>Thêm vào playlist</span>*/}
            {/*            <span className={styles["sr-menuItemArrow"]}>›</span>*/}

            {/*            {playlistMenuOpen && (*/}
            {/*                <div*/}
            {/*                    ref={playlistMenuRef}*/}
            {/*                    className={`${styles["sr-subMenu"]} ${playlistMenuPlacement === "left"*/}
            {/*                            ? styles["sr-subMenuLeft"]*/}
            {/*                            : styles["sr-subMenuRight"]*/}
            {/*                        } ${styles["sr-subMenuPlaylists"]}`}*/}
            {/*                >*/}
            {/*                    */}{/* Ô search */}
            {/*                    <div className={styles["sr-subMenuSearch"]}>*/}
            {/*                        <input*/}
            {/*                            type="text"*/}
            {/*                            className={styles["sr-subMenuInput"]}*/}
            {/*                            placeholder="Tìm playlist"*/}
            {/*                            value={playlistQuery}*/}
            {/*                            onChange={(e) => setPlaylistQuery(e.target.value)}*/}
            {/*                        />*/}
            {/*                    </div>*/}

            {/*                    */}{/* New playlist */}
            {/*                    <button*/}
            {/*                        type="button"*/}
            {/*                        className={styles["sr-subMenuItemPrimary"]}*/}
            {/*                        onClick={() => handleMenuAction("add-to-playlist", { id: "new" })}*/}
            {/*                    >*/}
            {/*                        + Playlist mới*/}
            {/*                    </button>*/}

            {/*                    <div className={styles["sr-subMenuDivider"]} />*/}

            {/*                    */}{/* Danh sách playlist – có scroll */}
            {/*                    <div className={styles["sr-subMenuScroll"]}>*/}
            {/*                        {filteredPlaylists.map((pl) => (*/}
            {/*                            <button*/}
            {/*                                key={pl.id}*/}
            {/*                                type="button"*/}
            {/*                                className={styles["sr-subMenuItem"]}*/}
            {/*                                onClick={() => handleMenuAction("add-to-playlist", pl)}*/}
            {/*                            >*/}
            {/*                                {pl.name}*/}
            {/*                            </button>*/}
            {/*                        ))}*/}

            {/*                        {filteredPlaylists.length === 0 && (*/}
            {/*                            <div className={styles["sr-subMenuEmpty"]}>Không tìm thấy playlist</div>*/}
            {/*                        )}*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            )}*/}
            {/*        </div>*/}
            {/*        <div*/}
            {/*            className={`${styles["sr-menuItem"]} ${styles["sr-menuItemHasSub"]}`}*/}
            {/*            onMouseEnter={() => setArtistMenuOpen(true)}*/}
            {/*            onMouseLeave={() => setArtistMenuOpen(false)}*/}
            {/*        >*/}
            {/*            <span>Xem nghệ sĩ</span>*/}

            {/*            <span*/}
            {/*                className={`${styles["sr-menuItemArrow"]}`}*/}
            {/*            >*/}
            {/*                ›*/}
            {/*            </span>*/}

            {/*            {artistMenuOpen && (*/}
            {/*                <div*/}
            {/*                    ref={artistMenuRef}*/}
            {/*                    className={`${styles["sr-subMenu"]} ${artistMenuPlacement === "left"*/}
            {/*                        ? styles["sr-subMenuLeft"]*/}
            {/*                        : styles["sr-subMenuRight"]*/}
            {/*                        }`}*/}
            {/*                >*/}
            {/*                    <button*/}
            {/*                        className={styles["sr-subMenuItem"]}*/}
            {/*                        onClick={() => handleMenuAction("view-artist")}*/}
            {/*                    >*/}
            {/*                        {item.artist}*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*            )}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
};


export default SongRow;