# 🚀 Advanced URL Shortener

A production-ready URL Shortener built using the **MERN Stack**, featuring **JWT Authentication**, **Redis Caching**, **BullMQ Background Jobs**, **Custom Aliases**, and **Click Analytics**.

---

## 🌐 Live Demo

### Frontend
https://advanced-url-shortener-olive.vercel.app

### Backend API
https://advanced-url-shortener-baq0.onrender.com

---

## ✨ Features

- 🔐 JWT Authentication
- 👤 User Registration & Login
- 🔗 URL Shortening
- ✏️ Custom Alias Support
- 📊 Click Analytics
- ⚡ Redis Caching
- 📦 BullMQ Background Queue
- 🗂 User Dashboard (My Links)
- 🗑 Delete URLs
- 📱 Responsive UI
- ☁️ Deployed on Vercel & Render

---

## 🛠 Tech Stack

### Frontend

- React
- Vite
- Axios
- CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas

### Cache

- Redis

### Queue

- BullMQ

### Authentication

- JWT
- HTTP-only Cookies

### Deployment

- Vercel
- Render

- ---

## 🏗️ System Architecture

```text
                React + Vite
                      │
                      │ HTTP Requests
                      ▼
            Express.js REST API
                      │
      ┌───────────────┼────────────────┐
      │               │                │
      ▼               ▼                ▼
 MongoDB Atlas      Redis         BullMQ Queue
      │               │                │
      └───────────────┴────────────────┘
                      │
                 URL Analytics
```

---

## 📂 Project Structure

```text
advanced-url-shortener/

├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── worker.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```
