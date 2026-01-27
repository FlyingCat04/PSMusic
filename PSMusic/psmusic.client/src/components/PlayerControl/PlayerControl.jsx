import React, { useState, useEffect } from "react";
import { Heart, Shuffle, Repeat, Repeat1 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RatingModal from "../Modal/RatingModal";
import styles from "./PlayerControl.module.css";
import { usePlayer } from "../../contexts/PlayerContext";
import { useAuth } from "../../hooks/useAuth";
import { useDataCache } from "../../contexts/DataCacheContext";
import axiosInstance from "../../services/axiosInstance";

export default function PlayerControl() {
  const navigate = useNavigate();
  const {
    currentSong,
    playerData,
    setPlayerData,
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    volume,
    setVolume,
    audioRef,
    playNextSong,
    playPrevSong,
    shuffle,
    repeat,
    toggleShuffle,
    toggleRepeat,
    setIsPlaying,
  } = usePlayer();
  const { user } = useAuth();

  const { updateSongFavoriteStatus, lastFavoriteUpdate, clearCache } = useDataCache();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [lastVolume, setLastVolume] = useState(0.5);
  const [updatingFavorite, setUpdatingFavorite] = useState(false);

  const songToDisplay = playerData || currentSong;
  const isFavorited = !!playerData?.isFavorited;
  const isRated = !!playerData?.isReviewed;

  useEffect(() => {
    if (!playerData?.audioUrl || !audioRef.current) return;

    if (audioRef.current.src !== playerData.audioUrl) {
      audioRef.current.src = playerData.audioUrl;
    }
  }, [playerData?.audioUrl]);

  // Sync favorite status from global event bus
  useEffect(() => {
    if (lastFavoriteUpdate && currentSong && lastFavoriteUpdate.songId === currentSong.id) {
        setPlayerData(prev => 
            prev ? { ...prev, isFavorited: lastFavoriteUpdate.isFavorited } : prev
        );
    }
  }, [lastFavoriteUpdate, currentSong]);

  const formatTime = (sec) => {
    if (!sec || isNaN(sec) || sec < 0) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !playerData?.audioUrl) return;
    togglePlay();
  };

  const toggleFavorite = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!user) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
      navigate("/auth");
      return;
    }
    if (!currentSong?.id || updatingFavorite) return;

    try {
      setUpdatingFavorite(true);

      const res = await axiosInstance.post(`/song/${currentSong.id}/favorite-toggle`);
      const newStatus = res.data.isFavorited;

      updateSongFavoriteStatus(currentSong.id, newStatus);

      setPlayerData((prev) => 
        prev ? { ...prev, isFavorited: newStatus } : prev
      );
      
      // Clear favorites cache to force refresh on next visit
      clearCache('favorites');
    } catch (err) {
      //console.error("Lỗi toggle favorite:", err);
    } finally {
      setUpdatingFavorite(false);
    }
  };

  const handleFavoriteSync = (songId, isFavorited) => {
       // Call global sync
       updateSongFavoriteStatus(songId, isFavorited);
  };

  const toggleRating = () => {
    if (!user) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
      navigate("/auth");
      return;
    }
    setIsModalOpen(true);
  };

  const handleReviewSubmitted = (reviewData) => {
    //console.log("✅ Đánh giá đã được gửi:", reviewData);
    setPlayerData((prev) =>
      prev ? { ...prev, isReviewed: true } : prev
    );
  };

  const handleDownload = () => {
    if (!songToDisplay?.audioUrl) {
      //console.error("Không có URL để tải bài hát");
      return;
    }

    try {
      const downloadLink = document.createElement("a");
      downloadLink.href = songToDisplay.audioUrl;
      downloadLink.download = `${songToDisplay.title}.mp3`.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );
      downloadLink.style.display = "none";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      //console.error("Lỗi khi tải bài hát:", error);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      const restoreVolume = lastVolume > 0 ? lastVolume : 0.5;
      setVolume(restoreVolume);
      audioRef.current.volume = restoreVolume;
      setIsMuted(false);
    } else {
      setLastVolume(volume);
      setVolume(0);
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;

    if (newVolume > 0) setIsMuted(false);
    if (newVolume > 0) setLastVolume(newVolume);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const formatArtists = (artists) => {
    if (Array.isArray(artists)) return artists.join(", ");
    return artists || "";
  };

  const formatSongTitle = (title, maxLength = 25) => {
    if (!title) return "";
    if (title.length > maxLength) {
      return title.slice(0, maxLength) + "...";
    }
    return title;
  };

  if (!songToDisplay) {
    return (
      <div
        className={styles["player-controls-new"]}
        style={{ padding: "20px", textAlign: "center", color: "gray" }}
      >
        Đang chờ tải dữ liệu bài hát...
      </div>
    );
  }

  const artistToDisplay = formatArtists(
    songToDisplay.artistNames || [songToDisplay.artist]
  );

  return (
    <>
      <div className={styles["player-controls-new"]}>
        <div className={styles["player-main-row"]}>
          <div className={styles["player-info-left"]}>
            <img
              src={songToDisplay.singerUrl}
              alt={artistToDisplay}
              className={styles["singer-avatar"]}
            />

            <div className={styles["song-title-artist"]}>
              <span
                onClick={() => navigate(`/song/${songToDisplay.id}`)}
                className={styles["song-title"]}
              >
                {formatSongTitle(songToDisplay.title)}
              </span>
              <span className={styles["song-artist"]}>{artistToDisplay}</span>
            </div>
          </div>

          <div className={styles["control-buttons"]}>
            <div
              className={`${styles["icon-button"]} ${updatingFavorite ? styles["disabled"] : ""}`}
              onClick={toggleFavorite}
              data-tooltip={isFavorited ? "Bỏ yêu thích" : "Yêu thích"}
              style={{
                cursor: updatingFavorite ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Heart
                size={20}
                color="white"
                fill={isFavorited ? "white" : "transparent"}
              />
              {updatingFavorite && (
                <div className={styles["loading-spinner"]}></div>
              )}
            </div>
            <button
              className={`${styles["control-btn"]} ${styles["shuffle-btn"]} ${
                shuffle ? styles["active"] : ""
              }`}
              onClick={toggleShuffle}
              data-tooltip={shuffle ? "Tắt trộn bài" : "Bật trộn bài"}
            >
              <Shuffle
                size={24}
                color={shuffle ? "#1DB954" : "currentColor"}
                fill={shuffle ? "#1DB954" : "none"}
              />
            </button>

            <button className={styles["control-btn"]} onClick={playPrevSong} data-tooltip="Bài trước">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="19 20 9 12 19 4 19 20"></polygon>
                <line x1="5" y1="19" x2="5" y2="5"></line>
              </svg>
            </button>

            <button
              className={styles["play-pause-btn"]}
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              )}
            </button>

            <button className={styles["control-btn"]} onClick={playNextSong} data-tooltip="Bài tiếp theo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 4 15 12 5 20 5 4"></polygon>
                <line x1="19" y1="5" x2="19" y2="19"></line>
              </svg>
            </button>

            <button
              className={`${styles["control-btn"]} ${styles["repeat-btn"]} ${
                repeat > 0 ? styles["active"] : ""
              }`}
              onClick={toggleRepeat}
              data-tooltip={
                repeat === 1
                  ? "Lặp lại tất cả"
                  : repeat === 2
                    ? "Lặp lại 1 bài"
                    : "Tắt lặp lại"
              }
            >
              {repeat === 2 ? (
                <Repeat1 size={24} color="#1DB954" fill="#1DB954" />
              ) : (
                <Repeat
                  size={24}
                  color={repeat > 0 ? "#1DB954" : "currentColor"}
                  fill={repeat > 0 ? "#1DB954" : "none"}
                />
              )}
            </button>
          </div>

          <div className={styles["player-controls-right"]}>
            <div className={styles["right-controls-group"]}>
              <button
                className={`${styles["control-btn"]} ${styles["rating-btn"]} ${
                  isRated ? styles["rated"] : ""
                }`}
                onClick={toggleRating}
                data-tooltip="Đánh giá bài hát"
                disabled={!currentSong}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={isRated ? "#fff" : "none"}
                  stroke={isRated ? "#fff" : "currentColor"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </button>

              <button
                className={styles["control-btn"]}
                onClick={handleDownload}
                data-tooltip="Tải bài hát"
                disabled={!songToDisplay?.audioUrl}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            </div>

            <div className={styles["volume-control-container"]}>
              <button
                className={styles["control-btn"]}
                onClick={toggleMute}
                data-tooltip={isMuted || volume === 0 ? "Bật âm thanh" : "Tắt âm thanh"}
              >
                {isMuted || volume === 0 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    {volume > 0.5 ? (
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    ) : null}
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className={styles["volume-range-input"]}
                style={{
                  background: `linear-gradient(to right, #fff ${volume * 100}%, #4d4d4d ${
                    volume * 100
                  }%)`,
                }}
              />
            </div>
          </div>
        </div>

        <div className={styles["seek-bar-container"]}>
          <span className={styles["current-time-display"]}>
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className={styles["seek-range-input"]}
            style={{
                background: `linear-gradient(to right, var(--primary-purple) ${
                (currentTime / (duration || 1)) * 100
              }%, #4d4d4d ${(currentTime / (duration || 1)) * 100}%)`,
            }}
          />
          <span className={styles["duration-display"]}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {isModalOpen && (
        <RatingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onReviewSubmitted={handleReviewSubmitted}
          songId={currentSong.id}
          songTitle={songToDisplay.title}
          isReviewed={isRated}
        />
      )}
    </>
  );
}
