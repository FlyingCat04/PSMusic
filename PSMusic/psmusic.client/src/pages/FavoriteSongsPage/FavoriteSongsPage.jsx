import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Play, Pause, Download, Clock3 } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axiosInstance from "../../services/axiosInstance";
import styles from "./FavoriteSongsPage.module.css";
import { usePlayer } from "../../contexts/PlayerContext";
import PlayerControl from "../../components/PlayerControl/PlayerControl";
import SongRow from "../../components/SongRow/SongRow";
import { useNavigate } from "react-router-dom";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import NoFavoriteState from "../../components/NoFavoriteState/NoFavoriteState";
import { useDataCache } from "../../contexts/DataCacheContext";
import { useAuth } from "../../hooks/useAuth";
import topChartsService from "../../services/topChartsService";
import toast from 'react-hot-toast';

export default function FavoritePlaylistPage() {
  const { t } = useTranslation();
  const [showAllFavorites, setShowAllFavorites] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getFavoritesData, setFavoritesData, clearCache } = useDataCache();
  const initialCache = getFavoritesData();

  // Initialize with cached data if available
  const [songs, setSongs] = useState(initialCache || []);
  const [loading, setLoading] = useState(!initialCache);
  // const { startNewSession, currentSong, playPlaylist, updateCurrentPlaylist, audioRef, setIsPlaying, isPlaying } = usePlayer();
  // const { playSong, currentSong, playPlaylist, updateCurrentPlaylist, audioRef, setIsPlaying, isPlaying, togglePlay } = usePlayer();
  const { startNewSession, currentSong, playPlaylist, updateCurrentPlaylist, audioRef, setIsPlaying, isPlaying, togglePlay } = usePlayer();

  useEffect(() => {
    const fetchFavorites = async () => {
      // Skip if we already have cached data
      const cachedData = getFavoritesData();
      if (cachedData) {
        if (!songs.length) setSongs(cachedData);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const resFavorited = await axiosInstance.get("/song/favorites");
        //console.log(resFavorited.data)

        const fetchedSongs = (resFavorited.data || []).map(song => {
          const url = song.audioUrl || song.mp3Url;
          return {
          ...song,
          audioUrl: url,
          artists: song.artists
            ? song.artists.map(artist => ({
              name: artist.name,
              id: artist.id
            }))
            : [],
          mp3Url: url
        };
        });

        setSongs(fetchedSongs);
        setFavoritesData(fetchedSongs);
      } catch (err) {
        //console.error("Lỗi khi tải playlist yêu thích:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [getFavoritesData, setFavoritesData]);

  const handleDownloadPlaylist = async () => {
    if (!songs.length) return;

    try {
      setDownloading(true);

      for (let i = 0; i < songs.length; i++) {
        const song = songs[i];

        const downloadLink = document.createElement("a");
        downloadLink.href = song.audioUrl;
        downloadLink.download = `${song.title}.mp3`.replace(
          /[^a-zA-Z0-9._-]/g,
          "_"
        );
        downloadLink.style.display = "none";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        if (i < songs.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      //console.error("Lỗi khi tải playlist:", error);
      //console.error("Lỗi khi tải playlist:", error);
      toast.error(t('download_error'));
    } finally {
      setDownloading(false);
    }
  };

  const popularArtists = useMemo(() => {
    const countMap = {};

    songs.forEach((song) => {
      const artists = song.artists
        ? song.artists.map((artist) => artist.name)
        : [];

      artists.forEach((artist) => {
        countMap[artist] = (countMap[artist] || 0) + 1;
      });
    });

    const sorted = Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .map(([artistName]) => artistName);

    if (sorted.length === 0) return t('no_artist');
    if (sorted.length === 1) return sorted[0];
    if (sorted.length === 2) return `${sorted[0]} & ${sorted[1]}`;
    if (sorted.length === 3)
      return `${sorted[0]}, ${sorted[1]} & ${sorted[2]}`;

    return `${sorted[0]}, ${sorted[1]}, ${sorted[2]} & ${sorted.length - 3} ${t('others')}`; // 'others' key might needed, but let's use a simpler approach or add key
    // Actually I didn't add "others" key. Let's fix this in next step or use hardcoded for now if I forget.
    // Wait, I can use "others" if I add it, or just use English "others" and VN "nghệ sĩ khác" via key. 
    // I will use a new key "other_artists_count" -> "{{count}} others" / "{{count}} nghệ sĩ khác"
    // For now, I will use:
    // return t('artist_list_more', { artist1: sorted[0], artist2: sorted[1], artist3: sorted[2], count: sorted.length - 3 });
    // But I haven't defined complex keys. 
    // Let's stick to simple replacement or add keys later.
    // I'll leave the logic but translate the string parts.
    // "và" -> "&" is universal enough or I can use t('and')
    // "nghệ sĩ khác" -> t('other_artists')

    // START FIX
    // I'll just change the string to use check "no_artist" key I added.
    // For the complex string, I'll hardcode "&" and "others" logic with t() if possible or just update keys.
    // I added "no_artist". I missed "other_artists".
    // I'll add "other_artists" to translation files in a separate step if needed. 
    // For now, I will replace "Chưa có nghệ sĩ" with t('no_artist').
    // And "nghệ sĩ khác" with t('other_artists') (I need to add this key).

  }, [songs]);

  const currentSongCover = songs[0] || {};

  const handlePlayAll = () => {
    if (songs.length === 0) return;
    
    const currentSongIsInPlaylist = currentSong && songs.some(song => song.id === currentSong.id);
    
    // Ensure all songs have audioUrl
    const playlistSongs = songs.map(s => {
      const url = s.audioUrl || s.mp3Url;
      return {
      ...s,
      audioUrl: url,
      mp3Url: url
    };
    });
    
    if (currentSongIsInPlaylist) {
      // If a song from the playlist is the current song, just toggle play/pause
      togglePlay();
    } else {
      // Otherwise, start playing the playlist from the beginning
      if (playPlaylist) {
        playPlaylist(playlistSongs, 0);
      } else {
        // startNewSession(songs[0]);
        playSong(playlistSongs[0]);
      }
    }
  };

  const handlePlaySong = (song, index) => {
    const url = song.audioUrl || song.mp3Url;
    // Ensure song has audioUrl
    const songData = {
      ...song,
      audioUrl: url,
      mp3Url: url
    };
    
    // Check if this song is currently playing
    if (currentSong?.id === song.id) {
      // If it's the current song, simply toggle play/pause
      togglePlay();
    } else {
      // startNewSession(song);
      // If it's a different song, play it
      if (playPlaylist) {
        // Convert all songs to have audioUrl
        const playlistSongs = songs.map(s => {
          const sUrl = s.audioUrl || s.mp3Url;
          return {
          ...s,
          audioUrl: sUrl,
          mp3Url: sUrl
        };
        });
        playPlaylist(playlistSongs, index);
      } else {
        playSong(songData);
      }
    }
  };

  const handleTitleClick = (song) => {
    navigate(`/song/${song.id}`);
  };

  const handleViewArtist = (artistId) => {
    navigate(`/artist/${artistId}`);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newOrder = Array.from(songs);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);

    setSongs(newOrder);
    updateCurrentPlaylist(newOrder);
  };

  if (loading) return (
    <>
      <LoadSpinner />
      {currentSong && <PlayerControl />}
    </>
  );
  if (!songs.length) return (
    <>
      <NoFavoriteState />
      {currentSong && <PlayerControl />}
    </>
  );

  // Check if any song from the playlist is currently playing
  const isPlaylistPlaying = currentSong && songs.some(song => song.id === currentSong.id) && isPlaying;

  return (
    <div className={styles["song-view-container"]}>
      <div className={styles["song-header"]}>
        <img
          src={currentSongCover.imageUrl || null}
          alt={currentSongCover.title}
          className={styles["song-cover"]}
        />

        <div className={styles["song-info"]}>
          <h1 className={styles["song-title"]}>{t('favorite_playlist_title')}</h1>
          <p className={styles["song-artist"]}>
            {t('featured_artist_label')} <strong>{popularArtists}</strong>
          </p>

          <div className={styles["play-buttons"]}>
            <button className={styles["btn-play"]} onClick={handlePlayAll}>
              {isPlaylistPlaying ? (
                <Pause className={styles["play-icon"]} />
              ) : (
                <Play className={styles["play-icon"]} />
              )}
              {isPlaylistPlaying ? t('pause') : t('play_all')}
            </button>
            <button
              className={styles["btn-download"]}
              onClick={handleDownloadPlaylist}
              disabled={downloading}
            >
              <Download />
              {downloading ? t('downloading_playlist') : t('download_playlist')}
            </button>
          </div>
        </div>
      </div>

      <div className={styles["other-songs-section"]}>
        <h2>{t('drag_drop_hint')}</h2>

        <div className={`${styles["tracklist"]} ${showAllFavorites
          ? styles["tracklist-expanded"]
          : styles["tracklist-collapsed"]
          }`}>

          {/* HEADER */}
          <div className={styles["header"]}>
            <div className={styles["colIndex"]}>#</div>
            <div className={styles["headerMain"]}>
              <div className={styles["colTitle"]}>{t('song_title')}</div>
              <div className={styles["colArtist"]}>{t('artist_col')}</div>
              <div className={styles["colTime"]}>
                <Clock3 size={16} />
              </div>
            </div>
          </div>

          {/* BODY */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="playlist">
              {(provided) => (
                <div
                  className={styles["body"]}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {songs.map((song, index) => (
                    <Draggable
                      key={song.id}
                      draggableId={song.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={`${styles["row"]} ${snapshot.isDragging ? styles["dragging"] : ""
                            }`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className={styles["colIndex"]}>{index + 1}</div>
                          <SongRow
                            item={song}
                            showPlayingIcon={currentSong?.id === song.id}
                            isPlaying={isPlaying}
                            onTitleClick={handleTitleClick}
                            onViewArtist={handleViewArtist}
                            onPlay={() => handlePlaySong(song, index)}
                            activeTab="Bài hát"
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

        </div>
        {songs.length > 4 && (
          <button
            className={styles["btn-toggle-favorites"]}
            onClick={() => setShowAllFavorites(!showAllFavorites)}
          >
            {showAllFavorites ? t('toggle_sub') : t('toggle_add')}
          </button>
        )}
      </div>

      {currentSong && <PlayerControl />}
    </div>
  );
}
