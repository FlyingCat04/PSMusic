import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Star, Play, Download } from "lucide-react";
import styles from "./SongViewPage.module.css";
import PlayerControl from "../../components/PlayerControl/PlayerControl";
import { usePlayer } from "../../contexts/PlayerContext";
import axiosInstance from "../../services/axiosInstance";
import TrackTable from "../../components/TrackTable/TrackTable";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import toast from 'react-hot-toast';

const DEFAULT_SONG_IMAGE =
  "https://cdn.pixabay.com/photo/2019/08/11/18/27/icon-4399630_1280.png";

const checkImage = (url, fallback) => {
  if (!url) return fallback;
  return url;
};

export default function SongViewPage() {
  const { t } = useTranslation();
  const { songId } = useParams();

  const [songDetail, setSongDetail] = useState(null);
  const [otherSongs, setOtherSongs] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [lyrics, setLyrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullLyrics, setShowFullLyrics] = useState(false);
  const [showAllOtherSongs, setShowAllOtherSongs] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const lyricsRef = useRef(null);
  const { startNewSession, currentTime, currentSong, isPlaying } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongData = async () => {
      try {
        setLoading(true);

        const resDetail = await axiosInstance.get(`/song/${songId}/detail`);

        const song = resDetail.data;
        setSongDetail(song);

        const resOther = await axiosInstance.get(`/song/${song.id}/related`);
        let related = resOther.data || [];

        const mappedRelated = related.map(item => ({
          id: item.id,
          title: item.title,
          artistText: item.artist,
          artists: item.artists || [],
          imageUrl: checkImage(item.imageUrl, DEFAULT_SONG_IMAGE),
          mp3Url: item.audioUrl || item.mp3Url,
          duration: item.duration
        }));

        setOtherSongs(mappedRelated);

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
        // console.error("Lỗi khi tải dữ liệu:", err);
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
      // console.error("Lỗi khi tải bài hát:", error);
      // console.error("Lỗi khi tải bài hát:", error);
      toast.error(t('download_error'));
    } finally {
      setDownloading(false);
    }
  };

  const handleTitleClick = (song) => {
    navigate(`/song/${song.id}`);
  };

  const handleViewArtist = (artistId) => {
    navigate(`/artist/${artistId}`);
  };

  const handleAddToPlaylist = (song, playlist) => {
    // TODO: Implement add to playlist
    // console.log("Add to playlist", song, playlist);
  };

  if (loading) return <LoadSpinner />;
  if (!songDetail) return <p>{t('song_not_found')}</p>;

  return (
    <div className={styles["song-view-container"]}>
      <div className={styles["song-header"]}>
        <img src={songDetail.imageUrl} alt="" className={styles["song-cover"]} />

        <div className={styles["song-info"]}>
          <div className={styles["song-subtitle"]}>{t('song')}</div>
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
                size={22}
                color="white"
                fill={songDetail.isFavorited ? "white" : "transparent"}
              />
              <span>{songDetail.favorite}</span>
            </div>

            <div className={styles["icon-button"]}>
              <Star
                size={22}
                color="white"
                fill={songDetail.isReviewed ? "white" : "transparent"}
              />
              <span>{songDetail.reviews}</span>
            </div>
          </div>

          <div className={styles["play-buttons"]}>
            <button
              className={styles["btn-play"]}
              onClick={() => startNewSession(songDetail)}
            >
              <Play className={styles["button-icon"]} />{t('play')}
            </button>

            <button
              className={styles["btn-download"]}
              onClick={handleDownloadSong}
              disabled={downloading}
            >
              <Download className={styles["button-icon"]} />
              {downloading ? t('downloading') : t('download')}
            </button>
          </div>
        </div>
      </div>

      <div className={styles["lyrics-artists-wrapper"]}>
        <div className={styles["lyrics-card"]}>
          <div className={styles["lyrics-header"]}>
            <span>{t('lyrics')}</span>
          </div>
          <hr />

          <div
            className={`${styles["lyrics-content-scroller"]} ${showFullLyrics ? styles["lyrics-expanded"] : styles["lyrics-collapsed"]
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
                    className={`${styles["lyric-line"]} ${isCurrent ? styles["active-lyric"] : ""
                      }`}
                  >
                    {line.text || "\u00A0"}
                  </p>
                );
              })
            ) : (
              <p>{t('loading_lyrics')}</p>
            )}
          </div>

          {lyrics.length > 0 && (
            <button
              className={styles["btn-toggle-lyrics"]}
              onClick={() => setShowFullLyrics(!showFullLyrics)}
            >
              {showFullLyrics ? t('show_less') : t('show_more')}
            </button>
          )}
        </div>

        <div className={styles["artist-list"]}>
          <h2>{t('artists')}</h2>

          {relatedArtists.length > 0 && (
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
          )}
        </div>
      </div>

      <div className={styles["other-songs-section"]}>
        <h2>
          {t('other_songs_by')} {
            relatedArtists.length > 0
              ? relatedArtists.map(a => a.name).join(", ")
              : songDetail.artist
          }
        </h2>

        <div
          className={`${styles["song-list-wrapper"]} ${showAllOtherSongs
            ? styles["songs-expanded"]
            : styles["songs-collapsed"]
            }`}
        >
          <TrackTable
            songs={otherSongs}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlay={startNewSession}
            onTitleClick={handleTitleClick}
            onAddToPlaylist={handleAddToPlaylist}
            onViewArtist={handleViewArtist}
            page={1}
            pageSize={otherSongs.length} // Show all in table, let CSS wrapper handle visibility
          />
        </div>

        {otherSongs.length > 4 && (
          <button
            className={styles["btn-toggle-songs"]}
            onClick={() => setShowAllOtherSongs(!showAllOtherSongs)}
          >
            {showAllOtherSongs ? t('show_less') : t('view_more')}
          </button>
        )}
      </div>

      {currentSong && <PlayerControl />}
    </div>
  );
}
