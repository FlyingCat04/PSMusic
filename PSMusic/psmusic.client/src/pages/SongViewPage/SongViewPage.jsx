import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Star, Play, Download } from "lucide-react";
import styles from "./SongViewPage.module.css";
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

        setOtherSongs(related);

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

      const downloadLink = document.createElement("a");
      downloadLink.href = songDetail.audioUrl;
      downloadLink.download = `${songDetail.title}.mp3`.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );
      downloadLink.style.display = "none";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Lỗi khi tải bài hát:", error);
      alert("Có lỗi xảy ra khi tải bài hát");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (!songDetail) return <p>Không tìm thấy bài hát</p>;

  return (
    <div className={styles["song-view-container"]}>
      <div className={styles["song-header"]}>
        <img src={songDetail.imageUrl} alt="" className={styles["song-cover"]} />

        <div className={styles["song-info"]}>
          <div className={styles["song-subtitle"]}>Bài hát</div>
          <h1 className={styles["song-title"]}>{songDetail.title}</h1>
          <p className={styles["song-artist"]}>
            {relatedArtists.length > 0 ? (
              relatedArtists.map((artist, index) => (
                <React.Fragment key={artist.id || index}>
                  <span 
                    className={styles["artist-link"]}
                    onClick={() => navigate(`/artist/${artist.id}`)}
                  >
                    {artist.name}
                  </span>
                  {index < relatedArtists.length - 1 && <span>, </span>}
                </React.Fragment>
              ))
            ) : (
              songDetail.artist
            )}
          </p>

          <div className={styles["action-buttons"]}>
            <div className={styles["icon-button"]}>
              <Heart
                size={20}
                color="white"
                fill={isFavorited ? "white" : "transparent"}
              />
              {songDetail.favorite} {songDetail.favorite > 1 ? "Favorites" : "Favorite"}
            </div>

            <div className={styles["icon-button"]}>
              <Star
                size={20}
                color="white"
                fill={isReviewed ? "white" : "transparent"}
              />
              {songDetail.reviews} {songDetail.reviews > 1 ? "Reviews" : "Review"}
            </div>
          </div>

          <div className={styles["play-buttons"]}>
            <button 
              className={styles["btn-play"]} 
              onClick={() => playSong(songDetail)}
            >
              <Play className={styles["button-icon"]} />Phát
            </button>

            <button
              className={styles["btn-download"]}
              onClick={handleDownloadSong}
              disabled={downloading}
            >
              <Download className={styles["button-icon"]} />
              {downloading ? "Đang tải..." : "Tải về"}
            </button>
          </div>
        </div>
      </div>

      <div className={styles["lyrics-artists-wrapper"]}>
        <div className={styles["lyrics-card"]}>
          <div className={styles["lyrics-header"]}>
            <span>Lyrics</span>
          </div>
          <hr />

          <div
            className={`${styles["lyrics-content-scroller"]} ${
              showFullLyrics ? styles["lyrics-expanded"] : styles["lyrics-collapsed"]
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
                    className={`${styles["lyric-line"]} ${
                      isCurrent ? styles["active-lyric"] : ""
                    }`}
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
              className={styles["btn-toggle-lyrics"]}
              onClick={() => setShowFullLyrics(!showFullLyrics)}
            >
              {showFullLyrics ? "Thu gọn" : "Hiển thị thêm"}
            </button>
          )}
        </div>

        <div className={styles["artist-list"]}>
          <h2>Nghệ sĩ</h2>

          {relatedArtists.length > 0 ? (
            relatedArtists.map((artist) => (
              <div 
                key={artist.id} 
                className={styles["artist-row"]}
                onClick={() => navigate(`/artist/${artist.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <img src={artist.avatarUrl} className={styles["artist-avatar"]} />
                <div className={styles["artist-info"]}>
                  <p className={styles["artist-name"]}>{artist.name}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Không có nghệ sĩ liên quan</p>
          )}
        </div>
      </div>

      <div className={styles["other-songs-section"]}>
        <h2>Bài hát khác của {songDetail.artist.split(",")[0]}</h2>

        {otherSongs.map((s) => (
          <div
            key={s.id}
            className={styles["song-row"]}
            onClick={() => navigate(`/song/${s.id}`)}
          >
            <div className={styles["song-left"]}>
              {s.imageUrl && (
                <img src={s.imageUrl} className={styles["song-thumbnail"]} />
              )}
              <span className={styles["song-title-text"]}>{s.title}</span>
            </div>

            <div className={styles["song-right"]}>
              <span className={styles["song-duration"]}>{s.duration || "00:00"}</span>
            </div>
          </div>
        ))}
      </div>

      {currentSong && <PlayerControl />}
    </div>
  );
}
