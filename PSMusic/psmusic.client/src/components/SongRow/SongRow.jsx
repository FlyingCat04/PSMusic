import React, { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import styles from "./SongRow.module.css";

const SongRow = ({ item, showPlayingIcon = false, isPlaying = false, onPlay, onTitleClick, onViewArtist, activeTab = "", hideInnerArtist = false, hideDuration = false, isDualColumn = false }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isHoverCover, setIsHoverCover] = useState(false);

    const [duration, setDuration] = useState(null);

    const menuRef = useRef(null);

    const activeTabChose = activeTab || "";


    const DEFAULT_SONG_IMAGE = "https://cdn.pixabay.com/photo/2019/08/11/18/27/icon-4399630_1280.png";

    // Format duration
    const formatDuration = (duration) => {
        if (!duration) return "";

        // Nếu đã đúng format MM:SS (2 phần, không có dấu chấm)
        const parts = duration.split(':');
        if (parts.length === 2 && !duration.includes('.')) {
            return duration; // "03:46"
        }

        // Nếu là format đầy đủ "HH:MM:SS.milliseconds" hoặc "HH:MM:SS"
        if (parts.length >= 2) {
            const minutes = parts[1]; // phút
            const secondsPart = parts[2] || '00'; // giây (có thể có phần thập phân)
            const seconds = secondsPart.split('.')[0]; // bỏ phần milliseconds
            return `${minutes}:${seconds}`;
        }

        return duration; // fallback
    };

    const handleRowStyle = () => {
        if (isDualColumn) return "sr-dual-column";
        return activeTab === "Bài hát" ? "sr-song-tab" : "sr-row";
    };

    const handleMetaStyle = () => {
        return activeTab === "Bài hát" ? "sr-meta-tab" : "sr-meta";
    };

    const handleTitleStyle = () => {
        return activeTab === "Bài hát" ? "sr-title-tab" : "sr-title";
    };

    useEffect(() => {
        if (activeTabChose !== "Bài hát") {
            setDuration(null);
            return;
        }

        if (item.duration) {
            setDuration(item.duration);
        } else {
            setDuration("00:00");
        }

        
    }, [activeTabChose, item]);

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

    return (

        <div
            className={styles[handleRowStyle(activeTab)]}
            {...(activeTab === "Bài hát" && {
                onClick: () => onPlay?.(item),
                onMouseEnter: () => setIsHoverCover(true),
                onMouseLeave: () => setIsHoverCover(false)
            })}
        >
            {/* COVER + TITLE + ARTIST */}
            {activeTab === "Bài hát" ? (
                <>
                    {/* Cột 1: avatar + tên bài hát */}
                    <div className={styles["sr-col-cover-title"]}>
                        <div className={styles["sr-avatar-wrapper"]}>
                            <img
                                className={styles["sr-cover"]}
                                src={item.imageUrl}
                                alt=""
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            />

                            {/* Active song status */}
                            {showPlayingIcon && !isHoverCover && (
                                <div className={styles["sr-cover-playing"]}>
                                    {isPlaying ? (
                                        <div className={styles["sr-eq"]}>
                                            <span />
                                            <span />
                                            <span />
                                        </div>
                                    ) : (
                                        <div className={styles["sr-eq"]} style={{alignItems: "flex-end", height: "14px"}}>
                                            <span style={{ height: "4px", animation: "none" }} />
                                            <span style={{ height: "4px", animation: "none" }} />
                                            <span style={{ height: "4px", animation: "none" }} />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Hover Actions */}
                            {isHoverCover && (
                                <div className={styles["sr-play-overlay"]}>
                                    <button
                                        type="button"
                                        className={styles["sr-play-button"]}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onPlay?.(item);
                                        }}
                                    >
                                        {showPlayingIcon && isPlaying ? (
                                            <Pause className={styles["sr-play-icon"]} fill="currentColor" />
                                        ) : (
                                            <Play className={styles["sr-play-icon"]} fill="currentColor" />
                                        )}
                                    </button>
                                </div>
                            )}

                        </div>

                        <button
                            className={styles["sr-title-songtab"]}
                            onClick={(e) => {
                                e.stopPropagation();
                                onTitleClick?.(item);
                            }}
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onViewArtist?.(a.id)
                                            }
                                            }
                                        // onClick={() => onViewArtist?.(a.id)}
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

                        {/* Active song status */}
                        {showPlayingIcon && !isHoverCover && (
                            <div className={styles["sr-cover-playing"]}>
                                {isPlaying ? (
                                    <div className={styles["sr-eq"]}>
                                        <span />
                                        <span />
                                        <span />
                                    </div>
                                ) : (
                                    <div className={styles["sr-eq"]} style={{alignItems: "flex-end", height: "14px"}}>
                                        <span style={{ height: "4px", animation: "none" }} />
                                        <span style={{ height: "4px", animation: "none" }} />
                                        <span style={{ height: "4px", animation: "none" }} />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Hover Actions */}
                        {isHoverCover && (
                            <div className={styles["sr-play-overlay"]}>
                                <button
                                    type="button"
                                    className={styles["sr-play-button"]}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPlay?.(item);
                                    }}
                                >
                                    {showPlayingIcon && isPlaying ? (
                                        <Pause className={styles["sr-play-icon"]} fill="currentColor" />
                                    ) : (
                                        <Play className={styles["sr-play-icon"]} fill="currentColor" />
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* META */}
                    <div className={styles[handleMetaStyle(activeTab)]}>
                        <button
                            className={styles[handleTitleStyle(activeTab)]}
                            onClick={(e) => {
                                e.stopPropagation();
                                onTitleClick?.(item);
                            }}
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
            {activeTab === "Bài hát" && item.duration && !hideDuration && (
                <span className={styles["sr-duration"]}>
                    {formatDuration(item.duration)}
                </span>
            )}

        </div>
    );
};


export default SongRow;