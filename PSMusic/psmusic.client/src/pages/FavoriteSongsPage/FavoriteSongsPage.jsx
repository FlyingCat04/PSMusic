import React, { useMemo, useState, useEffect } from "react";
import { Play, Download, Clock3 } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axiosInstance from "../../services/axiosInstance";
import styles from "./FavoriteSongsPage.module.css";
import { usePlayer } from "../../contexts/PlayerContext";
import PlayerControl from "../../components/PlayerControl/PlayerControl";
import SongRow from "../../components/SongRow/SongRow";

export default function FavoritePlaylistPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const { playSong, currentSong, playPlaylist, updateCurrentPlaylist } =
    usePlayer();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);

        const resFavorited = await axiosInstance.get("/song/favorites");
        
        const fetchedSongs = (resFavorited.data || []).map(song => ({
          ...song,
          artists: song.artist 
            ? song.artist.split(',').map(name => ({
                name: name.trim(),
                id: null
              }))
            : [],
          mp3Url: song.audioUrl
        }));

        setSongs(fetchedSongs);
      } catch (err) {
        console.error("Lỗi khi tải playlist yêu thích:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

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
      console.error("Lỗi khi tải playlist:", error);
      alert("Có lỗi xảy ra khi tải playlist");
    } finally {
      setDownloading(false);
    }
  };

  const popularArtists = useMemo(() => {
    const countMap = {};

    songs.forEach((song) => {
      const artists = song.artist
        ? song.artist
            .split(",")
            .map((artist) => artist.trim())
            .filter((artist) => artist !== "")
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

    return `${sorted[0]}, ${sorted[1]}, ${sorted[2]} và ${
      sorted.length - 3
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

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newOrder = Array.from(songs);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);

    setSongs(newOrder);
    updateCurrentPlaylist(newOrder);
  };

  if (loading) return <p>Đang tải playlist...</p>;
  if (!songs.length) return <p>Không có bài hát yêu thích nào.</p>;

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

        <div className={styles["tracklist"]}>
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
                          className={`${styles["row"]} ${
                            snapshot.isDragging ? styles["dragging"] : ""
                          }`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className={styles["colIndex"]}>{index + 1}</div>
                          <SongRow 
                            item={song} 
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
      </div>

      {currentSong && <PlayerControl />}
    </div>
  );
}
