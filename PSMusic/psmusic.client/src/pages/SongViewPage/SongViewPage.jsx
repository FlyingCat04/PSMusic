import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Star, Download } from "lucide-react";
import "./SongViewPage.css";
import PlayerControl from "../../components/PlayerControl/PlayerControl";
import { usePlayer } from "../../contexts/PlayerContext";
import axiosInstance from "../../services/axiosInstance";

export default function SongViewPage() {
  const { songId } = useParams();

  const [songDetail, setSongDetail] = useState(null);
  const [otherSongs, setOtherSongs] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [lyrics, setLyrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullLyrics, setShowFullLyrics] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const lyricsRef = useRef(null);
  const { playSong, currentTime, currentSong } = usePlayer();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongData = async () => {
      try {
        setLoading(true);

        const resDetail = await axiosInstance.get(`/song/${songId}/detail`, {
          params: { userId: 1 },
        });

        const song = resDetail.data;
        setSongDetail(song);
        setIsFavorited(song.isFavorited);
        setIsReviewed(song.isReviewed);

        const resOther = await axiosInstance.get(`/song/${song.id}/related`);
        let related = resOther.data || [];

        const formatTime = (sec) => {
          if (!sec) return "00:00";
          const m = Math.floor(sec / 60);
          const s = Math.floor(sec % 60);
          return `${m.toString().padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`;
        };

        const withDuration = await Promise.all(
          related.map(async (item) => {
            if (!item.mp3Url) return { ...item, duration: "00:00" };

            return new Promise((resolve) => {
              const audio = new Audio(item.mp3Url);
              audio.addEventListener("loadedmetadata", () => {
                resolve({
                  ...item,
                  duration: formatTime(audio.duration),
                });
              });

              audio.addEventListener("error", () =>
                resolve({
                  ...item,
                  duration: "00:00",
                })
              );
            });
          })
        );

        setOtherSongs(withDuration);

        const resArtists = await axiosInstance.get(`/artist/${songId}/artists`);
        setRelatedArtists(resArtists.data || []);

        if (song.lyricUrl) {
          const resLyric = await fetch(song.lyricUrl);
          const text = await resLyric.text();

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
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongData();
  }, [songId]);

  const handleDownloadSong = () => {
    if (!songDetail || !songDetail.audioUrl) return;
    
    try {
      setDownloading(true);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = songDetail.audioUrl;
      downloadLink.download = `${songDetail.title}.mp3`.replace(/[^a-zA-Z0-9._-]/g, '_');
      downloadLink.style.display = 'none';
      
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
    } catch (error) {
      console.error('Lỗi khi tải bài hát:', error);
      alert('Có lỗi xảy ra khi tải bài hát');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (!songDetail) return <p>Không tìm thấy bài hát</p>;

  return (
    <div className="song-view-container">
      <div className="song-header">
        <img src={songDetail.imageUrl} alt="" className="song-cover" />

        <div className="song-info">
          <h1 className="song-title">{songDetail.title}</h1>
          <p className="song-artist">{songDetail.artist}</p>

          <div className="action-buttons">
            <div
              className="icon-button"
              onClick={() => setIsFavorited(!isFavorited)}
            >
              <Heart
                size={20}
                color="white"
                fill={isFavorited ? "white" : "transparent"}
              />
              {songDetail.favorite} Favorite
            </div>

            <div
              className="icon-button"
              onClick={() => setIsReviewed(!isReviewed)}
            >
              <Star
                size={20}
                color="white"
                fill={isReviewed ? "white" : "transparent"}
              />
              {songDetail.reviews} Review
            </div>
          </div>

          <div className="play-buttons">
            <button className="btn-play" onClick={() => playSong(songDetail)}>
              Phát
            </button>

            <button 
              className="btn-download" 
              onClick={handleDownloadSong}
              disabled={downloading}
            >
              <Download /> 
              {downloading ? "Đang tải..." : "Tải về"}
            </button>
          </div>
        </div>
      </div>

      <div className="lyrics-artists-wrapper">
        <div className="lyrics-card">
          <div className="lyrics-header">
            <span>Lyrics</span>
          </div>
          <hr />

          <div
            className={`lyrics-content-scroller ${
              showFullLyrics ? "lyrics-expanded" : "lyrics-collapsed"
            }`}
            ref={lyricsRef}
          >
            {lyrics.length ? (
              lyrics.map((line, index) => {
                const isCurrent =
                  line.time <= currentTime + 0.15 &&
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
              <p>Đang tải lời bài hát...</p>
            )}
          </div>

          {lyrics.length > 0 && (
            <button
              className="btn-toggle-lyrics"
              onClick={() => setShowFullLyrics(!showFullLyrics)}
            >
              {showFullLyrics ? "Thu gọn" : "Hiển thị thêm"}
            </button>
          )}
        </div>

        <div className="artist-list">
          <h2>Nghệ sĩ</h2>

          {relatedArtists.length > 0 ? (
            relatedArtists.map((artist) => (
              <div key={artist.id} className="artist-row">
                <img src={artist.avatarUrl} className="artist-avatar" />
                <div className="artist-info">
                  <p className="artist-name">{artist.name}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Không có nghệ sĩ liên quan</p>
          )}
        </div>
      </div>

      <div className="other-songs-section">
        <h2>Bài hát khác của {songDetail.artist.split(",")[0]}</h2>

        {otherSongs.map((s) => (
          <div
            key={s.id}
            className="song-row"
            onClick={() => navigate(`/song/${s.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="song-left">
              {s.imageUrl && (
                <img src={s.imageUrl} className="song-thumbnail" />
              )}
              <span className="song-title-text">{s.title}</span>
            </div>

            <div className="song-right">
              <span className="song-duration">{s.duration || "00:00"}</span>
            </div>
          </div>
        ))}
      </div>

      {currentSong && <PlayerControl />}
    </div>
  );
}