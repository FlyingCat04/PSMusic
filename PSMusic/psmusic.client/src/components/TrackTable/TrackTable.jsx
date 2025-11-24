// src/components/TrackTable/TrackTable.jsx
import React from "react";
import { Clock3 } from "lucide-react"; // đã dùng lucide-react ở SettingsDropdown
import SongRow from "../SongRow/SongRow";
import styles from "./TrackTable.module.css";

const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return "";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
};

const TrackTable = ({
    songs,
    playingSongId,
    onPlay,
    onTitleClick,
    onAddToPlaylist,
    onViewArtist,
}) => {
    return (
        <div className={styles.tracklist}>
            {/* HEADER */}
            <div className={styles.header}>
                <div className={styles.colIndex}>#</div>
                <div className={styles.colTitle}>Title</div>
                <div className={styles.colArtist}>Artist</div>
                <div className={styles.colTime}>
                    <Clock3 size={16} />
                </div>
            </div>

            {/* BODY */}
            <div className={styles.body}>
                {songs.map((song, index) => (
                    <div key={song.id} className={styles.row}>
                        <div className={styles.colIndex}>{index + 1}</div>

                        {/* cột Title: render SongRow NGUYÊN VẸN */}
                        <div className={styles.colTitle}>
                            <SongRow
                                item={song}
                                showPlayingIcon={song.id === playingSongId}
                                onPlay={() => onPlay?.(song)}
                                onTitleClick={onTitleClick}
                                onAddToPlaylist={onAddToPlaylist}
                                onViewArtist={onViewArtist}
                            />
                        </div>

                        {/* cột Artist (thẳng hàng với header) */}
                        <div className={styles.colArtist}>
                            {song.artist}
                        </div>

                        {/* cột Time: thời lượng hoặc icon */}
                        <div className={styles.colTime}>
                            {song.duration
                                ? formatDuration(song.duration)
                                : <Clock3 size={16} />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrackTable;
