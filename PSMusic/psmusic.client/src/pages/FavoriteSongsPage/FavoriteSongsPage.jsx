import React, { useMemo, useState, useEffect } from "react";
import { Download } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axiosInstance from "../../services/axiosInstance";
import "../SongViewPage/SongViewPage.css";
import { usePlayer } from "../../contexts/PlayerContext";
import PlayerControl from "../../components/PlayerControl/PlayerControl";

export default function FavoritePlaylistPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const { playSong, currentSong, playPlaylist } = usePlayer();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);

        const resFavorited = await axiosInstance.get("/song/favorites", {
          params: { userId: 1 },
        });

        const fetchedSongs = resFavorited.data || [];

        const formatTime = (sec) => {
          if (!sec) return "00:00";
          const m = Math.floor(sec / 60);
          const s = Math.floor(sec % 60);
          return `${m.toString().padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`;
        };

        const songsWithDuration = await Promise.all(
          fetchedSongs.map(async (song) => {
            if (!song.audioUrl) return { ...song, duration: "00:00" };

            return new Promise((resolve) => {
              const audio = new Audio(song.audioUrl);
              audio.addEventListener("loadedmetadata", () => {
                resolve({
                  ...song,
                  duration: formatTime(audio.duration),
                });
              });
              audio.addEventListener("error", () => {
                resolve({ ...song, duration: "00:00" });
              });
            });
          })
        );

        setSongs(songsWithDuration);
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
        
        const downloadLink = document.createElement('a');
        downloadLink.href = song.audioUrl;
        downloadLink.download = `${song.title}.mp3`.replace(/[^a-zA-Z0-9._-]/g, '_');
        downloadLink.style.display = 'none';
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        if (i < songs.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
    } catch (error) {
      console.error('Lỗi khi tải playlist:', error);
      alert('Có lỗi xảy ra khi tải playlist');
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
  };

  if (loading) return <p>Đang tải playlist...</p>;
  if (!songs.length) return <p>Không có bài hát yêu thích nào.</p>;

  return (
    <div className="song-view-container">
      <div className="song-header">
        <img
          src={currentSongCover.imageUrl}
          alt={currentSongCover.title}
          className="song-cover"
        />

        <div className="song-info">
          <h1 className="song-title">Playlist yêu thích</h1>
          <p className="song-artist">
            Nghệ sĩ nổi bật: <strong>{popularArtists}</strong>
          </p>

          <div className="play-buttons">
            <button className="btn-play" onClick={handlePlayAll}>
              Phát tất cả
            </button>
            <button 
              className="btn-download" 
              onClick={handleDownloadPlaylist}
              disabled={downloading}
            >
              <Download /> 
              {downloading ? "Đang tải..." : "Tải playlist"}
            </button>
          </div>
        </div>
      </div>

      <div className="other-songs-section">
        <h2>Kéo thả để sắp xếp thứ tự phát</h2>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="playlist">
            {(provided) => (
              <div
                className="song-list"
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
                        className={`song-row ${
                          snapshot.isDragging ? "dragging" : ""
                        }`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div
                          className="song-content"
                          onClick={() => handlePlaySong(song, index)}
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <div className="song-left">
                            <img
                              src={song.imageUrl}
                              className="song-thumbnail"
                              alt=""
                            />
                            <div className="song-mid">
                              <span className="song-title-text">
                                {song.title}
                              </span>
                              <span className="song-artist-text">
                                {song.artist}
                              </span>
                            </div>
                          </div>

                          <div className="song-right">
                            <span className="song-duration">
                              {song.duration}
                            </span>
                          </div>
                        </div>
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

      {currentSong && <PlayerControl />}
    </div>
  );
} 