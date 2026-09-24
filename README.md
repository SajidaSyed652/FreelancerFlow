# FreelancerFlow 🚀
> **Milestone-Driven Freelancing Marketplace with Escrow Protection & Real-Time Collaboration**

FreelancerFlow is a full-stack freelancing platform built to eliminate payment uncertainty and project scope creep. It enforces structured, milestone-based deliverables backed by a simulated digital escrow wallet, integrated dispute resolution, and real-time messaging.

---

## ✨ Key Features

- 🛡️ **Escrow Wallet & Milestone Protection**: Funds are locked safely in escrow upon milestone creation and released automatically upon client approval.
- 🔄 **Structured Milestone Lifecycle**: `Created` ➔ `In-Progress` ➔ `Submitted` ➔ `Approved / Paid` (with Revision and Dispute channels).
- 💬 **Real-Time Collaboration**: Instant Socket.io-powered messaging, file attachments, and live typing indicators between clients and freelancers.
- ⚖️ **Dispute Management & Admin Arbitration**: Formal dispute escalation with evidence submission and administrator resolution capabilities.
- ⭐ **Two-Way Ratings & Reviews**: Transparent rating system with detailed review metrics.
- 🎨 **Modern Futuristic UI**: Glassmorphic dark aesthetic styled with Tailwind CSS, Lucide icons, and responsive layouts.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS & Vanilla CSS Design System
- **Icons & Effects**: Lucide React, Canvas Confetti
- **State & Networking**: Axios, Context API, Socket.io Client

### **Backend**
- **Runtime**: Node.js & Express.js (ES Modules)
- **Database**: MongoDB with Mongoose ODM
- **Real-Time Engine**: Socket.io
- **Auth & Security**: JSON Web Tokens (JWT), Bcrypt password hashing, CORS

---

## 📂 Project Structure

```
FreelancerFlow/
├── client/                     # Vite + React Frontend
│   ├── public/                 # Static public assets
│   ├── src/
│   │   ├── api/                # Axios instance & interceptors
│   │   ├── components/         # Reusable UI, Modals, Timeline, Chat
│   │   ├── context/            # AuthContext & SocketContext
│   │   ├── pages/              # Landing, Dashboards, Projects, Wallet
│   │   ├── utils/              # Formatters & helper utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── config/                 # DB & environment config
│   ├── controllers/            # Route business logic
│   ├── middleware/             # Auth & error middlewares
│   ├── models/                 # Mongoose schemas (User, Project, Milestone, etc.)
│   ├── routes/                 # REST API endpoints
│   ├── socket/                 # Socket.io connection handlers
│   ├── uploads/                # Local attachment storage
│   ├── seed.js                 # Database seeder with sample data
│   ├── server.js               # Entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
```
Configure your `.env` variables:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```
Optionally seed initial sample data (projects, users, milestones):
```bash
npm run seed
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Deployment Guide

### Deploy Backend (e.g. Render / Railway / Heroku)
1. Set Root Directory to `server`
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. Set Environment Variables in host dashboard:
   - `NODE_ENV` = `production`
   - `PORT` = `5000` (or host assigned)
   - `MONGODB_URI` = `<Your MongoDB Atlas URI>`
   - `JWT_SECRET` = `<Your Secret>`
   - `CLIENT_URL` = `https://your-frontend-domain.vercel.app`

### Deploy Frontend (e.g. Vercel / Netlify)
1. Set Root Directory to `client`
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. Set Environment Variables:
   - `VITE_API_URL` = `https://your-backend-domain.onrender.com/api`
   - `VITE_SOCKET_URL` = `https://your-backend-domain.onrender.com`

---

## 🔒 Security Best Practices
- Never commit live credentials or `.env` files to source control.
- Ensure CORS origins in production match only your deployed client URL.
- Use secure HTTPS/WSS endpoints in production environments.

---

## 📄 License
MIT License. Free for personal, commercial, and educational use.
