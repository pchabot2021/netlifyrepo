import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../App';
import '../styles/Post.css';

function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, []);

  async function fetchPost() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
    } else {
      setPost(data);
      setEditedTitle(data.title);
      setEditedContent(data.content);
    }
  }

  async function fetchComments() {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(data);
    }
  }

  async function handleUpvote() {
    const { data, error } = await supabase
      .from('posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error upvoting post:', error);
    } else {
      setPost(data);
    }
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    setIsCommentSubmitting(true);

    if (commentContent.trim() === '') {
      setIsCommentSubmitting(false);
      return;
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: id, content: commentContent }])
      .single();

    setIsCommentSubmitting(false);

    if (error) {
      console.error('Error creating comment:', error);
    } else {
      setComments([...comments, data]);
      setCommentContent('');
      fetchComments();
    }
  }

  async function handleEdit() {
    const { data, error } = await supabase
      .from('posts')
      .update({ title: editedTitle, content: editedContent })
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error updating post:', error);
    } else {
      setPost(data);
      setEditMode(false);
      fetchComments(); // Fetch comments again after successful edit
    }
  }

  async function handleDelete() {
    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
    }
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="post">
      <div className="post-header">
        <Link to="/" className="home-button">Home</Link>
      </div>
      {editMode ? (
        <div className="edit-post">
          <h2>Edit Post</h2>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <button onClick={handleEdit}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div className="post-details">
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p className="post-info">
            Created at: {new Date(post.created_at).toLocaleString()} | Upvotes: {post.upvotes}
          </p>
          <div className="post-actions">
            <button onClick={handleUpvote}>Upvote</button>
            <button onClick={() => setEditMode(true)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        </div>
      )}
      <div className="comments">
        <h3>Comments</h3>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            required
          />
          <button type="submit" disabled={isCommentSubmitting}>
            {isCommentSubmitting ? 'Adding Comment...' : 'Add Comment'}
          </button>
        </form>
        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <p>{comment.content}</p>
              <p className="comment-info">
                Created at: {new Date(comment.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Post;