import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientLayout from './layouts/ClientLayout/ClientLayout';
import HomePage from './pages/HomePage/HomePage';
import SongViewPage from './pages/SongViewPage/SongViewPage';
import FavoriteSongsPage from './pages/FavoriteSongsPage/FavoriteSongsPage';
import MusicPlayerPage from './pages/MusicPlayerPage/MusicPlayerPage';
import AuthPage from './pages/Auth/AuthPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import SearchResultPage from './pages/SearchResult/SearchResultPage';
import ArtistPage from './pages/ArtistPage/ArtistPage';
import './App.css';

const App = () => {
    return (
        <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <ClientLayout />
                    </PrivateRoute>
                }
            >
                <Route index element={<HomePage />} />
                <Route path="discover" element={<HomePage />} />
                <Route path="genres" element={<div>Chủ Đề & Thể Loại</div>} />
                <Route path="charts" element={<div>Bảng Xếp Hạng</div>} />
                <Route path="for-you" element={<div>Dành cho bạn</div>} />
                <Route path="favorites" element={<div>Bài Hát Yêu Thích</div>} />
                <Route path="recent" element={<div>Nghe Gần Đây</div>} />
                <Route path="/song/:id" element={<SongViewPage />} />
                <Route path="artist/:id" element={<ArtistPage />} />
                <Route path="/favorites" element={<FavoriteSongsPage />} />
                <Route path="/player/:id" element={<MusicPlayerPage />} />
                <Route path="/search" element={<SearchResultPage />} />
            </Route>
        </Routes>
    );
};

export default App;