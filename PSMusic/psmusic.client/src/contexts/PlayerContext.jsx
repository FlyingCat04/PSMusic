
//PlayerContext.jsx
import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import PlayerControlService from '../services/PlayerControlService'

const PlayerContext = createContext();
export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
    const audioRef = useRef(null);

    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isPlayerVisible, setIsPlayerVisible] = useState(false); // quản lý hiển thị player
    const [queue, setQueue] = useState([]);        // danh sách bài sẽ phát
    const [queueIndex, setQueueIndex] = useState(0); // bài hiện tại trong queue


    const mockNextBatch = [
        {
            "id": 888,
            "title": "Quá Là Trôi",
            "lyricUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/LRC/Qu%C3%A1%20L%C3%A0%20Tr%C3%B4i%20-%20ATVNCG%20-%20Binz%20-%20Rhymastic%20-%20B%C3%B9i%20C%C3%B4ng%20Nam%20-%20%C4%90%E1%BB%97%20Ho%C3%A0ng%20Hi%E1%BB%87p%20-%20Thi%C3%AAn%20Minh%20-%20H%C3%A0%20L%C3%AA.lrc",
            "audioUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/MP3/Qu%C3%A1%20L%C3%A0%20Tr%C3%B4i%20-%20ATVNCG%20-%20Binz%20-%20Rhymastic%20-%20B%C3%B9i%20C%C3%B4ng%20Nam%20-%20%C4%90%E1%BB%97%20Ho%C3%A0ng%20Hi%E1%BB%87p%20-%20Thi%C3%AAn%20Minh%20-%20H%C3%A0%20L%C3%AA.mp3",
            "coverUrl": "https://picsum.photos/seed/cover1/400",
            "artist": ["Hoàng Dũng", "Hoàng Dũng"],
            singerUrl: "https://picsum.photos/seed/singer1/50",
            likes: 33871,
            "categoryNames": []
        },
        {
            "id": 632,
            "title": "Agora Hills",
            "lyricUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/LRC/Agora%20Hills.lrc",
            "audioUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/MP3/Agora%20Hills.mp3",
            "coverUrl": "https://image-cdn.nct.vn/song/2023/09/19/a/5/e/6/1695087730094_300.jpg",
            "artist": ["Hoàng Dũng", "Hoàng Dũng", "Hoàng Dũng"],
            singerUrl: "https://picsum.photos/seed/singer1/50",
            likes: 33871,
            "categoryNames": []
        },
        {
            "id": 407,
            "title": "skinny dipping",
            "lyricUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/LRC/skinny%20dipping%20-%20Sabrina%20Carpenter.lrc",
            "audioUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/MP3/skinny%20dipping%20-%20Sabrina%20Carpenter.mp3",
            "coverUrl": "https://picsum.photos/seed/cover1/400",
            "artist": ["Hoàng Dũng", "Hoàng Dũng"],
            singerUrl: "https://picsum.photos/seed/singer1/50",
            likes: 33871,
            "categoryNames": []
        },
        {
            "id": 258,
            "title": "Valentine",
            "lyricUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/LRC/Valentine%20-%205%20Seconds%20of%20Summer.lrc",
            "audioUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/MP3/Valentine%20-%205%20Seconds%20of%20Summer.mp3",
            "coverUrl": "https://picsum.photos/seed/cover1/400",
            "artist": ["Hoàng Dũng", "Hoàng Dũng"],
            singerUrl: "https://picsum.photos/seed/singer1/50",
            likes: 33871,

            "categoryNames": []
        },
        {
            "id": 269,
            "title": "Amnesia",
            "lyricUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/LRC/Amnesia%20-%205%20Seconds%20of%20Summer.lrc",
            "audioUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/MP3/Amnesia%20-%205%20Seconds%20of%20Summer.mp3",
            "coverUrl": "https://picsum.photos/seed/cover1/400",
            "artist": ["Hoàng Dũng", "Hoàng Dũng"],
            singerUrl: "https://picsum.photos/seed/singer1/50",
            likes: 33871,
            "categoryNames": []
        },
        {
            "id": 845,
            "title": "Có Bao Lần",
            "lyricUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/LRC/C%C3%B3%20Bao%20L%E1%BA%A7n%20-%20Orange%20-%20H%C3%A0%20Tr%E1%BA%A7n.lrc",
            "audioUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/MP3/C%C3%B3%20Bao%20L%E1%BA%A7n%20-%20Orange%20-%20H%C3%A0%20Tr%E1%BA%A7n.mp3",
            "coverUrl": "https://picsum.photos/seed/cover1/400",
            "artist": ["Hoàng Dũng", "Hoàng Dũng"],
            singerUrl: "https://picsum.photos/seed/singer1/50",
            likes: 33871,
            "categoryNames": []
        },
        {
            "id": 148,
            "title": "DANCING IN THE DARK",
            "lyricUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/.lrc/DANCING%20IN%20THE%20DARK%20-%20SOOBIN.lrc",
            "audioUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/MP3/DANCING%20IN%20THE%20DARK%20-%20SOOBIN.mp3",
            "coverUrl": "https://picsum.photos/seed/cover1/400",
            "artist": ["Hoàng Dũng", "Hoàng Dũng"],
            singerUrl: "https://picsum.photos/seed/singer1/50",
            likes: 33871,
            "categoryNames": []
        },
        {
            "id": 539,
            "title": "Die For You (Remix)",
            "lyricUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/LRC/Die%20For%20You%20%28Remix%29.lrc",
            "audioUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/MP3/Die%20For%20You%20%28Remix%29.mp3",
            "coverUrl": "https://image-cdn.nct.vn/song/2023/02/24/6/a/c/2/1677251269017_300.jpg",
            "artist": ["Hoàng Dũng", "Hoàng Dũng"],
            singerUrl: "https://picsum.photos/seed/singer1/50",
            likes: 33871,

            "categoryNames": []
        },
        {
            "id": 243,
            "title": "Red Line",
            "lyricUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/LRC/Red%20Line%20-%205%20Seconds%20of%20Summer.lrc",
            "audioUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/MP3/Red%20Line%20-%205%20Seconds%20of%20Summer.mp3",
            "coverUrl": "https://picsum.photos/seed/cover1/400",
            "artist": ["Hoàng Dũng", "Hoàng Dũng"],
            singerUrl: "https://picsum.photos/seed/singer1/50",
            likes: 33871,
            "categoryNames": []
        },
        {
            "id": 870,
            "title": "Ngày Tuyệt Vời Nhất",
            "lyricUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/LRC/Ng%C3%A0y%20Tuy%E1%BB%87t%20V%E1%BB%9Di%20Nh%E1%BA%A5t%20-%20Rhymastic.lrc",
            "audioUrl": "https://psmusic.s3.ap-southeast-2.amazonaws.com/songs/MP3/Ng%C3%A0y%20Tuy%E1%BB%87t%20V%E1%BB%9Di%20Nh%E1%BA%A5t%20-%20Rhymastic.mp3",
            "coverUrl": "https://picsum.photos/seed/cover1/400",
            "artist": ["Hoàng Dũng", "Hoàng Dũng"],
            singerUrl: "https://picsum.photos/seed/singer1/50",
            likes: 33871,
            "categoryNames": []
        }
    ]



    // phát 1 bài hát mới
    const playSong = async (song) => {
        //const tmp = await PlayerControlService.getNextBatch();
        //console.log(tmp.data);
        //nếu chưa có bài sẵn trong queue
        if (queueIndex >= queue.length - 1) {
            const res = await PlayerControlService.getNextBatch();
            console.log(res.data)
            if (res.data.length > 0) {
                setQueue(res.data);
                setQueueIndex(0);
            }
        }
        setCurrentSong(song);
        setIsPlayerVisible(true); // bật player khi lần đầu play
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.src = song.audioUrl;
                audioRef.current.play();
                setIsPlaying(true);
            }
        }, 50);
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
        setIsPlayerVisible(true); // bật player nếu lần đầu nhấn play

        if (queue.length == 0) {
            loadInitialQueue();
        }
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoaded = () => {
        setDuration(audioRef.current.duration);
    };

    const loadInitialQueue = async () => {
        const res = await PlayerControlService.getNextBatch();
        setQueue(res.data);
        setQueueIndex(0);
    };

    const playNextSong = async () => {
        // còn bài trong queue
        if (queueIndex < queue.length - 1) {
            playSong(queue[queueIndex]);
            const nextIndex = queueIndex + 1;
            setQueueIndex(nextIndex);

            // Nếu còn 2 bài nữa thì fetch batch tiếp
            if (queue.length - nextIndex <= 2) {
                const res = await PlayerControlService.getNextBatch();
                setQueue(prev => [...prev, ...res.data]);
            }

            return;
        }

        // đã hết queue thì phải fetch batch mới
        const res = PlayerControlService.getNextBatch();
        if (res.data.length > 0) {
            setQueue(res.data);
            setQueueIndex(0);
            playSong(res.data[0]);
        }
    };

    //quay lại bài trước
    const playPrevSong = () => {
        if (queueIndex > 0) {
            const prevIndex = queueIndex - 1;
            setQueueIndex(prevIndex);
            playSong(queue[prevIndex]);
        }
    };


    useEffect(() => {
        if (!audioRef.current) return;

        const audio = audioRef.current;

        const handleEnded = () => {
            playNextSong();
        };

        audio.addEventListener("ended", handleEnded);

        return () => audio.removeEventListener("ended", handleEnded);
    }, [queue, queueIndex]);

    useEffect(() => {
        if (!audioRef.current) return;

        const audio = audioRef.current;
        audio.volume = volume;

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoaded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoaded);
        };
    }, []);

    const value = {
        audioRef,
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isPlayerVisible, // expose state hiển thị player

        playSong,
        togglePlay,
        setVolume,
        setIsPlayerVisible, // có thể bật/tắt player thủ công
        playNextSong,
        playPrevSong,
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
            <audio ref={audioRef} />
        </PlayerContext.Provider>
    );
}
