import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { BrowserRouter } from "react-router-dom";
import { PlayerProvider } from './contexts/PlayerContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <AuthProvider>
            <PlayerProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </PlayerProvider>
        </AuthProvider>
    </StrictMode>,
)
