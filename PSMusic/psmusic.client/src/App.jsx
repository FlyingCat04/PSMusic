import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientLayout from './layouts/ClientLayout/ClientLayout';
import HomePage from './pages/HomePage/HomePage';
import AuthPage from './pages/Auth/AuthPage';
import './App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={<ClientLayout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/discover" element={<HomePage />} />
                        <Route path="/genres" element={<div>Chủ Đề & Thể Loại</div>} />
                        <Route path="/charts" element={<div>Bảng Xếp Hạng</div>} />
                        <Route path="/for-you" element={<div>Dành cho bạn</div>} />
                        <Route path="/favorites" element={<div>Bài Hát Yêu Thích</div>} />
                        <Route path="/recent" element={<div>Nghe Gần Đây</div>} />
                    </Routes>
                </ClientLayout>}
                />
            </Routes>

        </Router>
    );
};

export default App;
