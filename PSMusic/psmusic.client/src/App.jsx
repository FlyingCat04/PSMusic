import React from 'react';
import ClientLayout from './layouts/ClientLayout/ClientLayout';
import HomePage from './pages/HomePage/HomePage';
import './App.css';

const App = () => {
  return (
    <ClientLayout>
      <HomePage />
    </ClientLayout>
  );
};

export default App;
