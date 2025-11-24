// src/components/TrackTable/TrackTable.jsx
import React from "react";
import { Clock3 } from "lucide-react";
import SongRow from "../SongRow/SongRow";
import styles from "./TrackTable.module.css";

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

                <div className={styles.headerMain}>
                    {/* chừa chỗ cho cover */}
                    <div className={styles.colCover} />
                    <div className={styles.colTitle}>Title</div>
                    <div className={styles.colArtist}>Artist</div>
                    <div className={styles.colTime}>
                        <Clock3 size={16} />
                    </div>
                </div>
            </div>

            {/* BODY */}
            <div className={styles.body}>
                {songs.map((song, index) => (
                    <div key={song.id} className={styles.row}>
                        <div className={styles.colIndex}>{index + 1}</div>

                        {/* Toàn bộ nội dung bên phải do SongRow lo */}
                        <SongRow
                            item={song}
                            showPlayingIcon={song.id === playingSongId}
                            onPlay={() => onPlay?.(song)}
                            onTitleClick={onTitleClick}
                            onAddToPlaylist={onAddToPlaylist}
                            onViewArtist={onViewArtist}
                            activeTab="Bài hát"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrackTable;
