import React, { useState, useEffect } from "react";
import { Heart, Star, Download } from "lucide-react";
import "./SongViewPage.css";
import { Link } from "react-router-dom";

const MOCK_SONG = {
  id: 1,
  title: "Em Thua Cô Ta (ACV Remix #2)",
  artist: "Huyền Trang, tlinh",
  imageUrl: "https://picsum.photos/seed/songdetail/400/400",
  favorite: 33871,
  reviews: 1124,
  isFavorited: true,
  isReviewed: false,
  lyricUrl:
    "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/LRC/Ch%E1%BB%9D%20Anh%20Nh%C3%A9%20-%20Ho%C3%A0ng%20D%C5%A9ng.lrc",
};

const ARTISTS = [
  {
    name: "tlinh",
    avatarURL: "https://picsum.photos/seed/tlinh/200",
  },
  {
    name: "HIEUTHUHAI",
    avatarURL: "https://picsum.photos/seed/hieu/200",
  },
];

const OTHER_SONGS_BY_ARTIST = [
  {
    id: 1,
    title: "Chăm Hoa",
    imageUrl: "https://picsum.photos/seed/song1/100",
    duration: "03:31",
  },
  {
    id: 2,
    title: "Waiting For You",
    imageUrl: "https://picsum.photos/seed/song2/100",
    duration: "04:25",
  },
  {
    id: 3,
    title: "Em Xinh",
    imageUrl: "https://picsum.photos/seed/song3/100",
    duration: "03:03",
  },
  {
    id: 4,
    title: "Em Là",
    imageUrl: "https://picsum.photos/seed/song4/100",
    duration: "03:17",
  },
];

export default function SongViewPage() {
  const [showFull, setShowFull] = useState(false);

  const [isFavorited, setIsFavorited] = useState(MOCK_SONG.isFavorited);
  const [isReviewed, setIsReviewed] = useState(MOCK_SONG.isReviewed);

  const [lyrics, setLyrics] = useState("");
  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        const res = await fetch(MOCK_SONG.lyricUrl);
        let text = await res.text();

        const cleaned = text.replace(/\[\d{1,2}:\d{2}(?:\.\d{1,2})?\]/g, "");

        setLyrics(cleaned.trim());
      } catch (err) {
        console.error("Lỗi tải lyric:", err);
        setLyrics("Không thể tải lời bài hát.");
      }
    };

    fetchLyrics();
  }, []);

  const LIMIT = 160;
  const isLong = lyrics.length > LIMIT;
  const text = showFull
    ? lyrics
    : lyrics.slice(0, LIMIT) + (isLong ? "..." : "");

  return (
    <div className="song-view-container">
      <div className="song-header">
        <img src={MOCK_SONG.imageUrl} alt="" className="song-cover" />

        <div className="song-info">
          <h1 className="song-title">{MOCK_SONG.title}</h1>
          <p className="song-artist">{MOCK_SONG.artist}</p>

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
              {MOCK_SONG.favorite} Favorite
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
              {MOCK_SONG.reviews} Review
            </div>
          </div>

          <div className="play-buttons">
            <button className="btn-play"><Link to='/player/1'>Phát</Link></button>
            <button className="btn-download">
              <Download /> Tải về
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

          <div className="lyrics-content">
            {text.split("\n").map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>

          {isLong && (
            <button
              className="lyrics-toggle-btn"
              onClick={() => setShowFull(!showFull)}
            >
              {showFull ? "Ẩn bớt ▲" : "Xem thêm ▼"}
            </button>
          )}
        </div>

        <div className="artist-list">
          <h2>Nghệ sĩ</h2>

          {ARTISTS.map((art, index) => (
            <div key={index} className="artist-row">
              <img src={art.avatarURL} className="artist-avatar" />

              <div className="artist-info">
                <p className="artist-name">{art.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="other-songs-section">
        <h2>Bài hát khác của {ARTISTS[0].name}</h2>

        {OTHER_SONGS_BY_ARTIST.map((song) => (
          <div key={song.id} className="song-row">
            <div className="song-left">
              <img src={song.imageUrl} className="song-thumbnail" />
              <span className="song-title-text">{song.title}</span>
            </div>

            <div className="song-right">
              <span className="song-duration">{song.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
