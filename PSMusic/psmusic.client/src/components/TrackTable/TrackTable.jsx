import React from "react";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
    // const { startNewSession, currentSong, isPlaying } = usePlayer();
    const { playSong, currentSong, isPlaying, togglePlay, startNewSession } = usePlayer();
    
    const handlePlaySong = (song) => {
        const songData = {
            ...song,
            audioUrl: song.mp3Url,
            coverUrl: song.imageUrl,
            artist: song.artists?.map(a => a.name) || [],
        };
        
        // Check if this song is currently playing
        if (currentSong?.id === song.id) {
            // If it's the current song, toggle play/pause
            togglePlay();
        } else {
            // If it's a different song, play it
            playSong(songData);
        }
    };

    return (
        <div className={styles.tracklist}>
            {/* HEADER */}
            <div className={styles.header}>
                <div className={styles.colIndex}>#</div>

                {!hideDuration ?
                    <div className={styles.headerMain}>
                        <div className={styles.colTitle}>{t('song_title')}</div>
                        <div className={styles.colArtist}>{t('artist_col')}</div>
                        <div className={styles.colTime}>
                            <Clock3 size={16} />
                        </div>
                    </div>
                    :
                    <div className={styles.headerMainDual}>
                        <div className={styles.colTitle}>{t('song_title')}</div>
                        <div className={styles.colArtist}>{t('artist_col')}</div>
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
                                // showPlayingIcon={currentSong?.id === song.id && isPlaying}
                                // onPlay={() => startNewSession({
                                //     ...song,
                                //     audioUrl: song.mp3Url,
                                //     coverUrl: song.imageUrl,
                                //     artist: song.artists?.map(a => a.name) || [],
                                // })}
                                showPlayingIcon={currentSong?.id === song.id}
                                isPlaying={isPlaying}
                                onPlay={() => handlePlaySong(song)}
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
