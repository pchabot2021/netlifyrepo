import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../App';
import '../styles/Home.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [sortBy, searchQuery]);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .is('parent_id', null)
      .order(sortBy, { ascending: false })
      .ilike('title', `%${searchQuery}%`);

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data);
    }
  }

  return (
    <div className="home">
      <div className="home-header">
        <h2>Latest Posts</h2>
        <Link to="/create" className="create-post-link">Create Post</Link>
      </div>
      <div className="home-filters">
        <div className="sort-by">
          <label htmlFor="sort-by">Sort By:</label>
          <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="created_at">Time Created</option>
            <option value="upvotes">Upvotes</option>
          </select>
        </div>
        <div className="search">
          <input
            type="text"
            placeholder="Search by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-item">
            <Link to={`/post/${post.id}`}>
              <h3 className="post-title">{post.title}</h3>
              <p className="post-info">
                Created at: {new Date(post.created_at).toLocaleString()} | Upvotes: {post.upvotes}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;