import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../App';
import '../styles/CreatePost.css';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const { data, error } = await supabase
      .from('posts')
      .insert({ title, content })
      .single();

    if (error) {
      console.error('Error creating post:', error);
    } else {
      navigate(`/post/${data.id}`);
    }
  }

  return (
    <div className="create-post">
      <div className="create-post-header">
        <h2>Create Post</h2>
        <Link to="/" className="home-button">Home</Link>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreatePost;