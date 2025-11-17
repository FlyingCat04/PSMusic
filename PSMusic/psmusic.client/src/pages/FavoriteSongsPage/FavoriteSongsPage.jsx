import React, { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "../SongViewPage/SongViewPage.css";

const INITIAL_SONGS = [
  { id: "1", title: "Chăm Hoa", artist: "HIEUTHUHAI", imageUrl: "https://picsum.photos/seed/song1/100", duration: "03:31" },
  { id: "2", title: "Waiting For You", artist: "MONO", imageUrl: "https://picsum.photos/seed/song2/100", duration: "04:25" },
  { id: "3", title: "Em Xinh", artist: "MONO", imageUrl: "https://picsum.photos/seed/song3/100", duration: "03:03" },
  { id: "4", title: "Em Là", artist: "tlinh", imageUrl: "https://picsum.photos/seed/song4/100", duration: "03:17" },
];

export default function FavoritePlaylistPage() {
  const [songs, setSongs] = useState(INITIAL_SONGS);

  const popularArtists = useMemo(() => {
    const countMap = {};
    songs.forEach((s) => (countMap[s.artist] = (countMap[s.artist] || 0) + 1));
    const sorted = Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .map((x) => x[0]);
    return sorted.length > 3
      ? `${sorted[0]}, ${sorted[1]}, ${sorted[2]} và nhiều hơn`
      : sorted.join(", ");
  }, [songs]);

  const currentSong = songs[0];

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newOrder = Array.from(songs);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);

    setSongs(newOrder);
  };

  return (
    <div className="song-view-container">
      <div className="song-header">
        <img
          src={currentSong.imageUrl}
          alt={currentSong.title}
          className="song-cover"
        />

        <div className="song-info">
          <h1 className="song-title">Playlist yêu thích</h1>
          <p className="song-artist">
            Nghệ sĩ nổi bật: <strong>{popularArtists}</strong>
          </p>

          <div className="play-buttons">
            <button className="btn-play">Phát tất cả</button>
            <button className="btn-download">
              <Download /> Tải playlist
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
                  <Draggable key={song.id} draggableId={song.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        className={`song-row ${snapshot.isDragging ? "dragging" : ""}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="song-left">
                          <img src={song.imageUrl} className="song-thumbnail" alt="" />
                          <div className="song-mid">
                            <span className="song-title-text">{song.title}</span>
                            <span className="song-artist-text">{song.artist}</span>
                          </div>
                        </div>

                        <div className="song-right">
                          <span className="song-duration">{song.duration}</span>
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
    </div>
  );
}
