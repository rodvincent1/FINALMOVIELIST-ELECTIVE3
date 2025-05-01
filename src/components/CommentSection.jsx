// components/CommentSection.jsx
import React, { useState, useEffect } from "react";

const CommentSection = ({ movieId }) => {
  const [comment, setComment] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Load saved comment from localStorage
  useEffect(() => {
    const savedComment = localStorage.getItem(`comment-${movieId}`);
    if (savedComment) setComment(savedComment);
  }, [movieId]);

  // Save comment to localStorage
  const handleSave = () => {
    localStorage.setItem(`comment-${movieId}`, comment);
    setIsEditing(false);
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
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                className="w-full text-sm p-2 rounded-md bg-zinc-800 border border-zinc-600 text-zinc-100 resize-none"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment here..."
              />
              <div className="flex justify-end gap-2">
                <button
                  className="text-xs px-3 py-1 rounded bg-zinc-600 hover:bg-zinc-500 text-zinc-200"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="text-xs px-3 py-1 rounded bg-zinc-600 hover:bg-zinc-500 text-zinc-200"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-zinc-300 whitespace-pre-line">
              {comment ? (
                comment
              ) : (
                <span className="text-zinc-500 italic">No comment yet.</span>
              )}
              <div className="flex justify-end mt-2">
                <button
                  className="text-xs px-3 py-1 rounded bg-zinc-600 hover:bg-zinc-500 text-zinc-200"
                  onClick={() => setIsEditing(true)}
                >
                  {comment ? "Edit Comment" : "Add Comment"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentSection;
