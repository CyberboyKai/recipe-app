import React, { useState } from "react";
import "../pages/RecipeDetail.css";

export default function CommentsSection() {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Alex Miller",
      date: "May 12, 2026",
      body: "Turned out super creamy! Will absolutely be adding this into my weekly rotation.",
      upvotes: 14,
      replies: [
        {
          id: 101,
          author: "John (Author)",
          date: "May 13, 2026",
          body: "Thanks! Glad you enjoyed the creaminess."
        }
      ]
    },
    {
      id: 2,
      author: "Jane Doe",
      date: "February 18, 2026",
      body: "Does anyone know if substituting heavy cream with coconut milk works well for this sauce?",
      upvotes: 2,
      replies: []
    }
  ]);

  const [likedCommentIds, setLikedCommentIds] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const totalCommentsCount = comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);

  const handleUpvoteToggle = (commentId) => {
    const hasAlreadyLiked = likedCommentIds.includes(commentId);
    setComments(
      comments.map((c) => (c.id === commentId ? { ...c, upvotes: hasAlreadyLiked ? c.upvotes - 1 : c.upvotes + 1 } : c))
    );
    setLikedCommentIds(hasAlreadyLiked ? likedCommentIds.filter((id) => id !== commentId) : [...likedCommentIds, commentId]);
  };

  const handleMainCommentSubmit = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const freshComment = {
      id: Date.now(),
      author: "Anonymous Reviewer",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      body: newCommentText,
      upvotes: 0,
      replies: []
    };

    setComments([freshComment, ...comments]);
    setNewCommentText("");
  };

  const handleReplySubmit = (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const freshReply = {
      id: Date.now(),
      author: "Anonymous Replier",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      body: replyText
    };

    setComments(
      comments.map((c) => (c.id === commentId ? { ...c, replies: [...c.replies, freshReply] } : c))
    );
    setReplyText("");
    setActiveReplyCommentId(null);
  };

  const sortedComments = [...comments].sort((a, b) => b.upvotes - a.upvotes);

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
          const isItemLiked = likedCommentIds.includes(comment.id);
          return (
            <div key={comment.id} className="comment-card-block">
              <div className="comment-card-header">
                <div className="user-avatar-placeholder">👩‍🍳</div>
                <div className="user-meta-info">
                  <span className="commenter-name">{comment.author}</span>
                  <span className="comment-date-stamp">{comment.date}</span>
                </div>
              </div>
              <p className="comment-body-text">{comment.body}</p>
              
              <div className="comment-action-bar">
                <button className={`btn-like-action ${isItemLiked ? "user-has-liked" : ""}`} onClick={() => handleUpvoteToggle(comment.id)}>
                  ❤️ {comment.upvotes}
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
                        <span className="commenter-name">{reply.author}</span>
                        <span className="comment-date-stamp">{reply.date}</span>
                      </div>
                    </div>
                    <p className="comment-body-text">{reply.body}</p>
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
