import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import { Play, Pause, Heart } from 'lucide-react';
import styles from './ItemCardColumn.module.css';
import { usePlayer } from '../../contexts/PlayerContext';

const PLACEHOLDER_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='100%' height='100%' fill='#374151'/></svg>`;
const PLACEHOLDER_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(PLACEHOLDER_SVG)}`;

const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = PLACEHOLDER_DATA_URL;
    e.currentTarget.classList.add(styles['image-placeholder']);
};

const ItemCardColumn = ({ item, type = 'song', onPlay, onFavorite }) => {
    const { t } = useTranslation();
    const [isHovered, setIsHovered] = useState(false);
    const { playSong, currentSong, isPlaying, togglePlay } = usePlayer();

    // If no item data, show skeleton
    if (!item) {
        return (
            <div className={styles['item-card-column']}>
                <div className={styles['item-card-column-image-skeleton']}></div>
                <div className={styles['item-card-column-title-skeleton']}></div>
                <div className={styles['item-card-column-artist-skeleton']}></div>
            </div>
        );
    }

    const imageUrl = item.imageUrl || item.avatarUrl || PLACEHOLDER_DATA_URL;
    const title = item.title || item.name || t('unknown_title');
    const artists = item.artists || [];

    const isCurrentPlaying = currentSong?.id === item.id;

    const handlePlayClick = (e) => {
        e.stopPropagation();

        if (isCurrentPlaying) {
            togglePlay();
        } else if (item.mp3Url || item.audioUrl) {
            const url = item.mp3Url || item.audioUrl;
            const songData = {
                ...item,
                audioUrl: url,
                mp3Url: url
            };
            playSong(songData);
        }

        if (onPlay) onPlay(item);
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        if (onFavorite) onFavorite(item);
    };

    return (
        <div className={`${styles['item-card-column']} ${isCurrentPlaying && isPlaying ? styles['active'] : ''}`}>
            <div
                className={styles['image-wrapper']}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {type === 'artist' ? (
                    <Link
                        to={`/artist/${item.id}`}
                    >
                        <img
                            src={imageUrl}
                            alt={title}
                            className={styles['item-card-column-image']}
                            onError={handleImgError}
                        />
                    </Link>
                ) : (
                    <img
                        src={imageUrl}
                        alt={title}
                        className={styles['item-card-column-image']}
                        onError={handleImgError}
                    />
                )}

                {type !== 'artist' && (
                    <button
                        className={`${styles['play-button-overlay']} ${isHovered || isCurrentPlaying ? styles['show'] : ''}`}
                        onClick={handlePlayClick}
                        aria-label="Play"
                    >
                        {isCurrentPlaying && isPlaying ? (
                            <Pause className={styles['play-icon']} fill="currentColor" />
                        ) : (
                            <Play className={styles['play-icon']} fill="currentColor" />
                        )}
                    </button>
                )}
            </div>
            {type === 'artist' ? (
                <Link
                    to={`/artist/${item.id}`}
                    className={styles['item-card-column-title']}
                >
                    {title}
                </Link>
            ) : (
                <Link
                    to={`/song/${item.id}`}
                    className={styles['item-card-column-title']}
                >
                    {title}
                </Link>
            )}
            {type !== 'artist' &&
                <p className={styles['item-card-column-artist']}>
                    {artists.length > 0 ? (
                        artists.map((artist, index) => (
                            <React.Fragment key={artist.id || index}>
                                <Link
                                    to={`/artist/${artist.id}`}
                                    className={styles['artist-link']}
                                >
                                    {artist.name}
                                </Link>
                                {index < artists.length - 1 && <span>, </span>}
                            </React.Fragment>
                        ))
                    ) : (
                        t('unknown_artist')
                    )}
                </p>
            }
        </div>
    );
};

export default ItemCardColumn;