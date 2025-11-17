import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientLayout from './layouts/ClientLayout/ClientLayout';
import HomePage from './pages/HomePage/HomePage';
import SongViewPage from './pages/SongViewPage/SongViewPage';
import FavoriteSongsPage from './pages/FavoriteSongsPage/FavoriteSongsPage';
import MusicPlayerPage from './pages/MusicPlayerPage/MusicPlayerPage';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <ClientLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/song/:id" element={<SongViewPage />} />
          <Route path="/favorites" element={<FavoriteSongsPage />} />
          <Route path="/player/:id" element={<MusicPlayerPage />} />
        </Routes>
      </ClientLayout>
    </BrowserRouter>
  );
};

export default App;
