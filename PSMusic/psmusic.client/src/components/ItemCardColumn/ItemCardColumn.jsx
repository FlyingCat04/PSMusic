import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import { Play, Heart } from 'lucide-react';
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
    // const { audioRef, togglePlay } = usePlayer();
    const { startNewSession } = usePlayer();

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

    const handlePlayClick = (e) => {
        e.stopPropagation();

        // Set audio source and play immediately
        // if (audioRef.current && item.mp3Url) {
        //     audioRef.current.src = item.mp3Url;
        //     audioRef.current.play();
        //     togglePlay();      
        if (item.mp3Url) {
            const songData = {
                ...item,
                audioUrl: item.mp3Url
            };
            startNewSession(songData);
        }

        if (onPlay) onPlay(item);
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        if (onFavorite) onFavorite(item);
    };

    return (
        <div className={styles['item-card-column']}>
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

                {/* Favorite Button - Top Right Corner - Only for songs */}
                {/*{type !== 'artist' && (*/}
                {/*    <button */}
                {/*        className={`${styles['favorite-button']} ${isHovered ? styles['show'] : ''}`}*/}
                {/*        onClick={handleFavoriteClick}*/}
                {/*        aria-label="Add to favorites"*/}
                {/*    >*/}
                {/*        <Heart size={20} />*/}
                {/*    </button>*/}
                {/*)}*/}

                {/* Play Button - Center - Only for songs */}
                {type !== 'artist' && (
                    <button
                        className={`${styles['play-button-overlay']} ${isHovered ? styles['show'] : ''}`}
                        onClick={handlePlayClick}
                        aria-label="Play"
                    >
                        <Play className={styles['play-icon']} fill="currentColor" />
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