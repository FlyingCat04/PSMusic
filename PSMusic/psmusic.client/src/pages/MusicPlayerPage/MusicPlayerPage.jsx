import React, { useState, useRef, useEffect } from "react";
import PlayerControl from "../../components/PlayerControl/PlayerControl";
import "./MusicPlayerPage.css";
import { usePlayer } from "../../contexts/PlayerContext";
import { useParams } from "react-router-dom";

export default function MusicPlayerPage() {
    //const { id } = useParams();
    const id = 1;
    const { currentSong, playSong, isPlaying, currentTime } = usePlayer();


    //const mockSongs = [
    //    {
    //        id: "1",
    //        title: "Chúng ta của hiện tại ",
    //        artist: "Hoàng Dũng",
    //        coverUrl: "https://picsum.photos/seed/cover1/400",
    //        singerUrl: "https://picsum.photos/seed/singer1/50",
    //        likes: 33871,
    //        audioUrl:
    //            "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/MP3/Ch%E1%BB%9D%20Anh%20Nh%C3%A9%20-%20Ho%C3%A0ng%20D%C5%A9ng.mp3",
    //        lyricUrl:
    //            "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/LRC/Ch%E1%BB%9D%20Anh%20Nh%C3%A9%20-%20Ho%C3%A0ng%20D%C5%A9ng.lrc",
    //    },
    //];

    const song = currentSong || {
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
    };

    const [lyrics, setLyrics] = useState([]);
    const [duration, setDuration] = useState(0);
    //const [playerCurrentTime, setPlayerCurrentTime] = useState(0);
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const lyricsRef = useRef(null);
    const scrollTimeoutRef = useRef(null);
    //const [currentTime, setCurrentTime] = useState(0);
    //const [isPlaying, setIsPlaying] = useState(false);


    const handleUserScroll = () => {
        setIsUserScrolling(true);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setIsUserScrolling(false);
        }, 3000);
    };

    //useEffect(() => {
    //    if (!currentSong) {
    //        playSong(song); // 🔥 gọi playSong khi chưa có bài hát
    //    }
    //});

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
        if (!song || !lyrics.length || !lyricsRef.current || !isPlaying || isUserScrolling)
            return;

        const activeLyricIndex = lyrics.findIndex(
            (line, index) =>
                line.time > currentTime &&
                (index === 0 || lyrics[index - 1].time <= currentTime)
        );

        if (activeLyricIndex === -1 && currentTime < duration) return;

        const targetIndex = activeLyricIndex === -1 ? lyrics.length - 1 : activeLyricIndex;
        const activeLineElement = lyricsRef.current.children[targetIndex];

        if (activeLineElement) {
            activeLineElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [currentTime, duration, lyrics, song, isPlaying, isUserScrolling]);

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
                                    (index === lyrics.length - 1 || lyrics[index + 1].time > currentTime);

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

            {/* PlayerControl hiện tại chỉ quản lý audio và các nút */}
            <PlayerControl />
        </div>
    );
}
