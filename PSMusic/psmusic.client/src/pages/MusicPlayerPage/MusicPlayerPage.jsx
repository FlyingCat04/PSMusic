import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import "./MusicPlayerPage.css";
import RatingModal from "../../components/Modal/RatingModal";

const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) return "00:00";
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

export default function MusicPlayerPage() {
  const { id } = useParams();

  const mockSongs = [
    {
      id: "1",
      title: "Chúng ta của hiện tại ",
      artist: "Hoàng Dũng",
      coverUrl: "https://picsum.photos/seed/cover1/400",
      singerUrl: "https://picsum.photos/seed/singer1/50",
      likes: 33871,
      audioUrl:
        "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/MP3/Ch%E1%BB%9D%20Anh%20Nh%C3%A9%20-%20Ho%C3%A0ng%20D%C5%A9ng.mp3",
      lyricUrl:
        "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/LRC/Ch%E1%BB%9D%20Anh%20Nh%C3%A9%20-%20Ho%C3%A0ng%20D%C5%A9ng.lrc",
    },
  ];

  const song = mockSongs.find((s) => s.id === id);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lyrics, setLyrics] = useState([]);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [lastVolume, setLastVolume] = useState(0.5);
  const [isRated, setIsRated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likes, setLikes] = useState(song?.likes || 0);

  const lyricsRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const handleUserScroll = () => {
    setIsUserScrolling(true);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setIsUserScrolling(false);
      }
    }, 3000);
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    setLikes((prev) => (isFavorited ? prev - 1 : prev + 1));
  };

  const toggleRating = () => {
    setIsRated((prev) => !prev);
    setIsModalOpen(true);
  };

  const handleRateSubmit = ({ rating, comment }) => {
    console.log(`Đánh giá mới: ${rating} sao, Bình luận: ${comment}`);
    setIsRated(true);
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }

    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }

    if (newVolume > 0) {
      setLastVolume(newVolume);
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

  const handleDownload = () => {
    console.log("Đang thực hiện tải xuống bài hát: ", song.title);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  useEffect(() => {
    if (!song) return;
    const fetchLyrics = async () => {
      try {
        const res = await fetch(song.lyricUrl);
        const text = await res.text();
        const parsed = text
          .split("\n")
          .map((line) => {
            const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
            if (!match) return null;
            const minutes = parseInt(match[1], 10);
            const seconds = parseFloat(match[2]);
            return { time: minutes * 60 + seconds, text: match[3].trim() };
          })
          .filter(Boolean);
        setLyrics(parsed);
      } catch (err) {
        console.error("Failed to load lyrics", err);
      }
    };
    fetchLyrics();
  }, [song]);

  useEffect(() => {
    if (
      !song ||
      !lyrics.length ||
      !lyricsRef.current ||
      !isPlaying ||
      isUserScrolling
    )
      return;

    const activeLyricIndex = lyrics.findIndex(
      (line, index) =>
        line.time > currentTime &&
        (index === 0 || lyrics[index - 1].time <= currentTime)
    );

    if (activeLyricIndex === -1 && currentTime < duration) {
      return;
    }

    const targetIndex =
      activeLyricIndex === -1 ? lyrics.length - 1 : activeLyricIndex;

    const activeLineElement = lyricsRef.current.children[targetIndex];

    if (activeLineElement) {
      activeLineElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentTime, duration, lyrics, song, isPlaying, isUserScrolling]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);
    const handlePlayPause = () => setIsPlaying(!audio.paused);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setAudioDuration);
    audio.addEventListener("play", handlePlayPause);
    audio.addEventListener("pause", handlePlayPause);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
      audio.removeEventListener("play", handlePlayPause);
      audio.removeEventListener("pause", handlePlayPause);
    };
  }, [song]);

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  if (!song) return <p>Bài hát không tồn tại</p>;

  return (
    <div className="music-player-container">
      <div className="main-view-new-layout">
        <div className="cover-container">
          <img src={song.coverUrl} alt={song.title} className="cover-image" />
        </div>

        <div className="lyrics-display-area">
          <div
            className="lyrics-content-scroller"
            ref={lyricsRef}
            onScroll={handleUserScroll}
          >
            {lyrics.length > 0 ? (
              lyrics.map((line, index) => {
                const isCurrent =
                  line.time <= currentTime + 0.1 &&
                  (index === lyrics.length - 1 ||
                    lyrics[index + 1].time > currentTime);

                return (
                  <p
                    key={index}
                    className={`lyric-line ${isCurrent ? "active-lyric" : ""}`}
                  >
                    {line.text || "\u00A0"}
                  </p>
                );
              })
            ) : (
              <p className="no-lyrics">Đang tải lời bài hát...</p>
            )}
          </div>
        </div>
      </div>

      <div className="player-controls-new">
        <div className="player-main-row">
          <div className="player-info-left">
            <img
              src={song.singerUrl}
              alt={song.artist}
              className="singer-avatar"
            />
            <div className="song-title-artist">
              <span className="song-title">{song.title}</span>
              <span className="song-artist">{song.artist}</span>
            </div>
            <div
              className="icon-button"
              onClick={toggleFavorite}
              style={{
                cursor: "pointer",
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
            </div>
          </div>
          <div className="control-buttons">
            <button className="control-btn shuffle-btn">
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
                <polyline points="16 3 21 3 21 8"></polyline>
                <line x1="4" y1="20" x2="21" y2="3"></line>
                <polyline points="21 16 21 21 16 21"></polyline>
                <line x1="15" y1="15" x2="21" y2="21"></line>
                <line x1="4" y1="4" x2="9" y2="9"></line>
              </svg>
            </button>

            <button className="control-btn prev-btn">
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

            <button className="play-pause-btn" onClick={togglePlay}>
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

            <button className="control-btn next-btn">
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

            <button className="control-btn repeat-btn">
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
                <polyline points="17 1 21 5 17 9"></polyline>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                <polyline points="7 23 3 19 7 15"></polyline>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
              </svg>
            </button>
          </div>

          <div className="player-controls-right">
            <button className="control-btn rating-btn" onClick={toggleRating}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isRated ? "white" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </button>

            <button
              className="control-btn download-btn"
              onClick={handleDownload}
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

            <div className="volume-control-container">
              <button className="control-btn volume-btn" onClick={toggleMute}>
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
                className="volume-range-input"
              />
            </div>
          </div>
        </div>

        <div className="seek-bar-container">
          <span className="current-time-display">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="seek-range-input"
          />
          <span className="duration-display">{formatTime(duration)}</span>
        </div>
      </div>

      <audio ref={audioRef} src={song.audioUrl} />
      <RatingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRate={handleRateSubmit}
      />
    </div>
  );
}
