# 🎬 MovieList Web App

A full-stack movie list app where users can:

- Register / Login
- Browse movies
- Add movies to favorites
- Comment on movies
- Rate movies

---

## 🚀 Tech Stack

**Frontend**: React, TailwindCSS  
**Backend**: Node.js, Express  
**Database**: MongoDB (Mongoose)

---

## 🛠️ Getting Started

### ✅ Prerequisites

- Node.js
- MongoDB (local or Atlas)
- npm or yarn

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/movielist-app.git
cd movielist-app

### 1. Clone the repository

#Backend
cd backend
npm install

#Frontend
cd ../frontend
npm install

## ⚙️ Configuration
MongoDB
Ensure MongoDB is running locally on the default port 27017.
The backend connects using:
mongodb://127.0.0.1:27017/movielist

## ▶️ Running the App

#Start Backend
cd backend
node server.js

#Start Frontend
cd frontend
npm start


🧪 Features
🔐 Authentication
Users can register and log in

Login info stored in localStorage

❤️ Favorites
Logged-in users can favorite/unfavorite movies

Favorite movies saved to MongoDB

💬 Comments
Logged-in users can post comments on movies

Comments stored and retrieved from MongoDB

⭐ Ratings
Logged-in users can rate movies (1–5)

Ratings saved per user

API Endpoints (Backend)
Method	Endpoint	Description
POST	/api/users	Register a new user
POST	/api/login	Login with credentials
POST	/api/comments	Add a comment
GET	/api/comments/:movieId	Get comments for a movie
POST	/api/favorites	Add movie to favorites
DELETE	/api/favorites/:username/:movieId	Remove from favorites
POST	/api/rating	Save a rating
GET	/api/user/:username	Get user info

🧠 Known Issues
Ensure MongoDB is running before starting the backend

Avoid CORS errors by running frontend on port 3000 and backend on 5000

