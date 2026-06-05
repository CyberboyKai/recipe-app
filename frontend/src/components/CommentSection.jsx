import React, { useState, useEffect } from "react";
import "../pages/RecipeDetail.css";

export default function CommentsSection({ recipeId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/recipes/${recipeId}/comments`);
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchComments();
  }, [recipeId]);

  const totalCommentsCount = comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);

  const handleMainCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    try {
      await fetch(`/api/recipes/${recipeId}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: currentUser.uid,
            displayName: currentUser.displayName,
            content: newCommentText
          })
        }
      );

      const res = await fetch(`/api/recipes/${recipeId}/comments`);
      const comments = await res.json();
      setComments(comments);
      setNewCommentText("");

    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvoteToggle = async (commentId) => {
    try {
      await fetch(`/api/recipes/${recipeId}/comments/${commentId}/like`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: currentUser.uid
          })
        }
      );

      const res = await fetch(`/api/recipes/${recipeId}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      await fetch(`/api/recipes/${recipeId}/comments/${commentId}/replies`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: currentUser.uid,
            displayName: currentUser.displayName,
            content: replyText
          })
        }
      );

      const res = await fetch(`/api/recipes/${recipeId}/comments`);
      const data = await res.json();
      setComments(data);
      setReplyText("");
      setActiveReplyCommentId(null);

    } catch (err) {
      console.error(err);
    }
  };

  const sortedComments = [...comments].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));

  return (
    <div className="comments-section-container">
    
      <h3 className="comments-main-heading" style={{ marginTop: "40px" }}>Leave a Comment</h3>
      
      <form className="comment-input-wrapper" onSubmit={handleMainCommentSubmit}>
        <div className="input-avatar-placeholder">👤</div>
        <div className="input-fields-box">
          <textarea 
            placeholder="Write your review body here..." 
            className="comment-form-text" 
            rows="3" 
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
          />
          <button type="submit" className="btn-submit-comment">Post Comment</button>
        </div>
      </form>

      <div className="comments-count-header">{totalCommentsCount} Comments</div>

      <div className="comments-list-thread">
        {sortedComments.map((comment) => {
          const isItemLiked = comment.likes?.includes(currentUser.uid);
          return (
            <div key={comment.id} className="comment-card-block">
              <div className="comment-card-header">
                <div className="user-avatar-placeholder">👩‍🍳</div>
                <div className="user-meta-info">
                  <span className="commenter-name">{comment.displayName}</span>
                  <span className="comment-date-stamp">{comment.date}</span>
                </div>
              </div>
              <p className="comment-body-text">{comment.content}</p>
              
              <div className="comment-action-bar">
                <button className={`btn-like-action ${isItemLiked ? "user-has-liked" : ""}`} onClick={() => handleUpvoteToggle(comment.id)}>
                  ❤️ {comment.likes?.length || 0}
                </button>
                <button className="btn-reply-action" onClick={() => setActiveReplyCommentId(activeReplyCommentId === comment.id ? null : comment.id)}>
                  {activeReplyCommentId === comment.id ? "Cancel Reply" : "Reply"}
                </button>
              </div>

              {comment.replies.map((reply) => (
                <div key={reply.id} className="replies-nested-indent-group">
                  <div className="reply-card-block">
                    <div className="comment-card-header">
                      <div className="user-avatar-placeholder">👨‍🍳</div>
                      <div className="user-meta-info">
                        <span className="commenter-name">{reply.displayName}</span>
                        <span className="comment-date-stamp">{reply.date}</span>
                      </div>
                    </div>
                    <p className="comment-body-text">{reply.content}</p>
                  </div>
                </div>
              ))}

              {activeReplyCommentId === comment.id && (
                <div className="replies-nested-indent-group">
                  <form className="comment-input-wrapper reply-input-form" onSubmit={(e) => handleReplySubmit(e, comment.id)}>
                    <textarea 
                      placeholder="Write a reply..." 
                      className="comment-form-text" 
                      rows="2" 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button type="submit" className="btn-submit-comment btn-small">Reply</button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
