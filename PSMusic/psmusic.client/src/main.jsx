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
      <AuthProvider>
        <PlayerProvider>
          <DataCacheProvider>
              <App />
          </DataCacheProvider>
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
