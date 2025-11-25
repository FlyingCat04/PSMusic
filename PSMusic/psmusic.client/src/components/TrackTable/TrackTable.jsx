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
    page = 1,
    pageSize = 10,
}) => {
    const startIndex = (page - 1) * pageSize;
    return (
        <div className={styles.tracklist}>
            {/* HEADER */}
            <div className={styles.header}>
                <div className={styles.colIndex}>#</div>

                <div className={styles.headerMain}>
                    <div className={styles.colTitle}>Tên bài hát</div>
                    <div className={styles.colArtist}>Nghệ sĩ</div>
                    <div className={styles.colTime}>
                        <Clock3 size={16} />
                    </div>
                </div>
            </div>

            {/* BODY */}
            <div className={styles.body}>
                {songs.map((song, index) => {
                    const displayIndex = startIndex + index + 1; // số thứ tự thực
                    return (
                        <div key={song.id} className={styles.row}>
                            <div className={styles.colIndex}>{displayIndex}</div>
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
                    );
                })}
            </div>
        </div>
    );
};

export default TrackTable;
