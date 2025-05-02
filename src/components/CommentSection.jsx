import React, { useState, useEffect } from "react";

const CommentSection = ({ movieId }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [user, setUser] = useState(null);

  // Load logged-in user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.username) {
      setUser(storedUser.username);
    }
  }, []);

  // Fetch comments from server
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/comments/${movieId}`);
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };

    fetchComments();
  }, [movieId]);

  const handleCommentSubmit = async () => {
    if (!user) {
      alert("You must be logged in to comment.");
      return;
    }

    const trimmed = commentText.trim();
    if (trimmed === "") return;

    try {
      const response = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user,
          movieId,
          comment: trimmed,
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments((prev) => [newComment, ...prev]);
        setCommentText("");
      } else {
        console.error("Failed to submit comment");
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  return (
    <div className="bg-zinc-700 text-zinc-200 rounded-xl mt-4 p-3 shadow-inner border border-zinc-600">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-zinc-300">Comments</h3>
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
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={
              user
                ? "Write your comment here... Press Enter to submit."
                : "Log in to write a comment"
            }
            onKeyDown={handleKeyDown}
            disabled={!user}
          />
          <div className="flex justify-end mt-2">
            <button
              className="text-xs px-3 py-1 rounded bg-zinc-600 hover:bg-zinc-500 text-zinc-200"
              onClick={handleCommentSubmit}
              disabled={!user || commentText.trim() === ""}
            >
              Add
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {comments.length > 0 ? (
              comments.map((c) => (
                <div
                  key={c._id}
                  className="bg-zinc-800 p-2 rounded border border-zinc-700"
                >
                  <p className="text-sm text-zinc-100">{c.comment}</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    — {c.username}, {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 italic text-sm">No comments yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CommentSection;
