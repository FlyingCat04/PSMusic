import React from "react";
import { Clock3 } from "lucide-react";
import SongRow from "../SongRow/SongRow";
import { usePlayer } from "../../contexts/PlayerContext";
import styles from "./TrackTable.module.css";

const TrackTable = ({
    songs,
    onTitleClick,
    onAddToPlaylist,
    onViewArtist,
    onFavorite,
    page = 1,
    pageSize = 10,
    showRank = false,
    hideDuration = false,
    isDualColumn = false,
}) => {
    const startIndex = (page - 1) * pageSize;
    const { playSong, currentSong, isPlaying } = usePlayer();
    return (
        <div className={styles.tracklist}>
            {/* HEADER */}
            <div className={styles.header}>
                <div className={styles.colIndex}>#</div>

                {!hideDuration ? 
                    <div className={styles.headerMain}>
                        <div className={styles.colTitle}>Tên bài hát</div>
                        <div className={styles.colArtist}>Nghệ sĩ</div>
                        <div className={styles.colTime}>
                            <Clock3 size={16} />
                        </div>
                    </div>
                :
                    <div className={styles.headerMainDual}>
                        <div className={styles.colTitle}>Tên bài hát</div>
                        <div className={styles.colArtist}>Nghệ sĩ</div>
                    </div>
                }

                                    {/* <div className={styles.headerMain}>
                        <div className={styles.colTitle}>Tên bài hát</div>
                        <div className={styles.colArtist}>Nghệ sĩ</div>
                        {!hideDuration && (
                            <div className={styles.colTime}>
                                <Clock3 size={16} />
                            </div>
                        )}
                    </div> */}

            </div>

            {/* BODY */}
            <div className={styles.body}>
                {songs.map((song, index) => {
                    const displayIndex = startIndex + index + 1; // số thứ tự thực
                    return (
                        <div key={song.id} className={styles.row}>
                            <div className={`${styles.colIndex} ${showRank ? styles.rankColumn : ''} ${showRank && index < 3 ? styles[`rank-${index + 1}`] : ''}`}>
                                {showRank ? index + 1 : displayIndex}
                            </div>
                            <SongRow
                                item={song}
                                isDualColumn={isDualColumn}
                                showPlayingIcon={currentSong?.id === song.id && isPlaying}
                                onPlay={() => playSong({
                                    ...song,
                                    audioUrl: song.mp3Url,
                                    coverUrl: song.imageUrl,
                                    artist: song.artists?.map(a => a.name) || [],
                                })}
                                onTitleClick={onTitleClick}
                                onAddToPlaylist={onAddToPlaylist}
                                onViewArtist={onViewArtist}
                                onFavorite={onFavorite}
                                activeTab="Bài hát"
                                hideDuration={hideDuration}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TrackTable;
