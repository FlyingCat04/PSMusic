import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { DataCacheProvider } from './contexts/DataCacheContext.jsx'
import { BrowserRouter } from "react-router-dom";
import { PlayerProvider } from './contexts/PlayerContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DataCacheProvider>
        <AuthProvider>
          <PlayerProvider>
            <App />
          </PlayerProvider>
        </AuthProvider>
      </DataCacheProvider>
    </BrowserRouter>
  </StrictMode>,
)
