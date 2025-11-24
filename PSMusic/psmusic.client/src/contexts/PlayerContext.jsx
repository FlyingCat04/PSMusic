
//PlayerContext.jsx
import React, { createContext, useContext, useRef, useState, useEffect } from "react";

const PlayerContext = createContext();
export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
    const audioRef = useRef(null);

    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isPlayerVisible, setIsPlayerVisible] = useState(false); // 🔥 quản lý hiển thị player

    // 🔥 Hàm phát 1 bài hát mới
    const playSong = (song) => {
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
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoaded = () => {
        setDuration(audioRef.current.duration);
    };

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
        isPlayerVisible, // 🔥 expose state hiển thị player

        playSong,
        togglePlay,
        setVolume,
        setIsPlayerVisible, // 🔥 có thể bật/tắt player thủ công
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
            <audio ref={audioRef} />
        </PlayerContext.Provider>
    );
}
