import React from 'react';
import ClientLayout from './layouts/ClientLayout/ClientLayout';
import { Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
import SearchResultPage from './pages/SearchResult/SearchResultPage';
import './App.css';

const App = () => {
    return (
    <ClientLayout>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultPage />} />
            {/*<Route path="/artist/:name" element={<ArtistPage />} />*/}
        </Routes>
    </ClientLayout >
  );
};

export default App;
