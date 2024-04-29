import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import Post from './components/Post';
import './styles/App.css';

const supabase = createClient('https://jukzlxkcdxdhhugmbjth.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a3pseGtjZHhkaGh1Z21ianRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQzNDc5MzksImV4cCI6MjAyOTkyMzkzOX0.7qcadLKISAFVPKwP9zFFfPrHQLm_FGVITjJTlGPfks4');

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Wine Blog</h1>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>&copy; 2023 Wine Blog. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
export { supabase };