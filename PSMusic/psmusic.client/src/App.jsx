import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ClientLayout from './layouts/ClientLayout/ClientLayout';
import HomePage from './pages/HomePage/HomePage';
import SongViewPage from './pages/SongViewPage/SongViewPage';
import FavoriteSongsPage from './pages/FavoriteSongsPage/FavoriteSongsPage';
import AuthPage from './pages/Auth/AuthPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import SearchResultPage from './pages/SearchResult/SearchResultPage';
import ArtistPage from './pages/ArtistPage/ArtistPage';
import TopChartsPage from './pages/TopChartsPage/TopChartsPage';
import ExploreCategoriesPage from './pages/ExploreCategoriesPage/ExploreCategoriesPage';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import './App.css';

// Map locale key (tên thư mục) → BCP 47 lang code chuẩn cho thẻ <html lang>
const LOCALE_TO_LANG = {
    vi: 'vi',
    en: 'en',
    ger: 'de',
    jp: 'ja',
    ru: 'ru',
};

const App = () => {
    const { i18n } = useTranslation();

    // Cập nhật thuộc tính lang của <html> mỗi khi đổi ngôn ngữ
    useEffect(() => {
        const langCode = LOCALE_TO_LANG[i18n.language] ?? i18n.language;
        document.documentElement.lang = langCode;
    }, [i18n.language]);

    return (
        <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route
                path="/"
                element={
                    <ClientLayout />
                }
            >
                <Route index element={<HomePage />} />
                <Route path="genres" element={<ExploreCategoriesPage />} />
                <Route path="charts" element={<TopChartsPage />} />
                <Route path="/song/:songId" element={<SongViewPage />} />
                <Route path="/artist/:id" element={<ArtistPage />} />
                <Route path="/category/:id" element={<CategoryPage />} />
                <Route path="/search" element={<SearchResultPage />} />
            </Route>
            <Route element={
                <PrivateRoute>
                    <ClientLayout />
                </PrivateRoute>
            }>
                <Route path="favorites" element={<FavoriteSongsPage />} />
                <Route path="recent" element={<div>Nghe Gần Đây</div>} />
            </Route>
        </Routes>
    );
};

export default App;