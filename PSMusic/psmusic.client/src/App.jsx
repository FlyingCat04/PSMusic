import React from 'react';
import ClientLayout from './layouts/ClientLayout/ClientLayout';
import HomePage from './pages/HomePage/HomePage';
import SearchResultPage from './pages/SearchResult/SearchResultPage';
import './App.css';

const App = () => {
  return (
    <ClientLayout>
      
      <SearchResultPage />
    </ClientLayout>
  );
};

export default App;
