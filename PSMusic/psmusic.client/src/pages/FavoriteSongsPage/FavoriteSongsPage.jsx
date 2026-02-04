import React, { useMemo, useState, useEffect } from "react";
import { Play, Download, Clock3 } from "lucide-react";
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
  const [showAllFavorites, setShowAllFavorites] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getFavoritesData, setFavoritesData, clearCache } = useDataCache();
  const initialCache = getFavoritesData();
  
  // Initialize with cached data if available
  const [songs, setSongs] = useState(initialCache || []);
  const [loading, setLoading] = useState(!initialCache);
  const { playSong, currentSong, playPlaylist, updateCurrentPlaylist, audioRef, setIsPlaying, isPlaying } =
    usePlayer();

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

        const fetchedSongs = (resFavorited.data || []).map(song => ({
          ...song,
          artists: song.artists
            ? song.artists.map(artist => ({
              name: artist.name,
              id: artist.id
            }))
            : [],
          mp3Url: song.audioUrl
        }));

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
      toast.error("Có lỗi xảy ra khi tải playlist");
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

    if (sorted.length === 0) return "Chưa có nghệ sĩ";
    if (sorted.length === 1) return sorted[0];
    if (sorted.length === 2) return `${sorted[0]} và ${sorted[1]}`;
    if (sorted.length === 3)
      return `${sorted[0]}, ${sorted[1]} và ${sorted[2]}`;

    return `${sorted[0]}, ${sorted[1]}, ${sorted[2]} và ${sorted.length - 3
      } nghệ sĩ khác`;
  }, [songs]);

  const currentSongCover = songs[0] || {};

  const handlePlayAll = () => {
    if (songs.length > 0) {
      if (playPlaylist) {
        playPlaylist(songs, 0);
      } else {
        playSong(songs[0]);
      }
    }
  };

  const handlePlaySong = (song, index) => {
    if (playPlaylist) {
      playPlaylist(songs, index);
    } else {
      playSong(song);
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

  if (loading) return <LoadSpinner />;
  if (!songs.length) return <NoFavoriteState />;

  return (
    <div className={styles["song-view-container"]}>
      <div className={styles["song-header"]}>
        <img
          src={currentSongCover.imageUrl || null}
          alt={currentSongCover.title}
          className={styles["song-cover"]}
        />

        <div className={styles["song-info"]}>
          <h1 className={styles["song-title"]}>Playlist yêu thích</h1>
          <p className={styles["song-artist"]}>
            Nghệ sĩ nổi bật: <strong>{popularArtists}</strong>
          </p>

          <div className={styles["play-buttons"]}>
            <button className={styles["btn-play"]} onClick={handlePlayAll}>
              <Play className={styles["play-icon"]} />
              Phát tất cả
            </button>
            <button
              className={styles["btn-download"]}
              onClick={handleDownloadPlaylist}
              disabled={downloading}
            >
              <Download />
              {downloading ? "Đang tải..." : "Tải playlist"}
            </button>
          </div>
        </div>
      </div>

      <div className={styles["other-songs-section"]}>
        <h2>Kéo thả để sắp xếp thứ tự phát</h2>

        <div className={`${styles["tracklist"]} ${showAllFavorites
          ? styles["tracklist-expanded"]
          : styles["tracklist-collapsed"]
          }`}>

          {/* HEADER */}
          <div className={styles["header"]}>
            <div className={styles["colIndex"]}>#</div>
            <div className={styles["headerMain"]}>
              <div className={styles["colTitle"]}>Tên bài hát</div>
              <div className={styles["colArtist"]}>Nghệ sĩ</div>
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
                            showPlayingIcon={currentSong?.id === song.id && isPlaying}
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
            {showAllFavorites ? "Thu gọn" : "Xem thêm"}
          </button>
        )}
      </div>

      {currentSong && <PlayerControl />}
    </div>
  );
}
