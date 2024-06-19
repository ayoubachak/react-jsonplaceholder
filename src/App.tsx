// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserListPage from './components/UserListPage';
import UserProfilePage from './components/UserProfilePage';
import AlbumPage from './components/AlbumPage';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl">JSONPlaceholder App</h1>
          </div>
        </header>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<UserListPage />} />
            <Route path="/user/:id" element={<UserProfilePage />} />
            <Route path="/album/:id" element={<AlbumPage />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white p-4 mt-4">
          <div className="container mx-auto text-center">
            <p>&copy; 2024 JSONPlaceholder App</p>
          </div>
        </footer>
      </Router>
    </div>
  );
};

export default App;
