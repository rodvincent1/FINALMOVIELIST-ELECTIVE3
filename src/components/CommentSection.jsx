import React, { useState, useEffect } from "react";

const CommentSection = ({ movieId }) => {
  const [comment, setComment] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Load saved comment from localStorage
  useEffect(() => {
    const savedComment = localStorage.getItem(`comment-${movieId}`);
    if (savedComment) setComment(savedComment);
  }, [movieId]);

  const saveComment = async (newComment) => {
    if (newComment.trim() === "") return;
  
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.username) return console.error("User not logged in");
  
    try {
      const response = await fetch(`http://localhost:5000/api/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: storedUser.username,
          movieId,
          comment: newComment,
        }),
      });
  
      if (response.ok) {
        setComment(newComment);
      } else {
        console.error("Failed to save comment");
      }
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };  

  // Handle textarea key press (Enter to submit)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveComment(comment.trim());
    }
  };

  // Handle clicking Add button
  const handleAddClick = () => {
    saveComment(comment.trim());
  };

  return (
    <div className="bg-zinc-700 text-zinc-200 rounded-xl mt-4 p-3 shadow-inner border border-zinc-600">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-zinc-300">Your Comment</h3>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-xs text-zinc-400 hover:text-red-400 transition"
        >
          {isCollapsed ? "Show" : "Hide"}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <textarea
            className="w-full text-sm p-2 rounded-md bg-zinc-800 border border-zinc-600 text-zinc-100 resize-none"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here... Press Enter or click Add to submit."
            onKeyDown={handleKeyDown}
          />
          <div className="flex justify-end mt-2">
            <button
              className="text-xs px-3 py-1 rounded bg-zinc-600 hover:bg-zinc-500 text-zinc-200"
              onClick={handleAddClick}
            >
              Add
            </button>
          </div>
          <div className="mt-2 text-sm text-zinc-300 whitespace-pre-line">
            {comment ? (
              comment
            ) : (
              <span className="text-zinc-500 italic">No comment yet.</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CommentSection;
