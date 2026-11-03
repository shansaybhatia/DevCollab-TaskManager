# DevCollab — Real-Time Agile Task & Workspace Management Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://task-manager-three-chi-70.vercel.app)
[![React 19](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express 5](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **DevCollab** is a modern, collaborative Agile project management platform engineered for distributed development teams. It combines instant **duplex WebSocket synchronization**, a fluid **drag-and-drop Kanban matrix**, fine-grained **role-based team management**, and a clean **Hallmark Light Dusk** frosted glass UI.

---

## 🌐 Live Production Deployment

* **Deployed Web Application:** [https://task-manager-three-chi-70.vercel.app](https://task-manager-three-chi-70.vercel.app)
* **Backend Health Check:** `GET /health` on the deployed server verifies API and database availability.

---

## 🚀 Key Features

* **⚡ Real-Time Duplex WebSocket Sync:**
  * Tasks created, edited, moved, or deleted in any sprint column update instantly across all connected team members' screens without refreshing.
  * Project-isolated WebSocket rooms (`io.to(projectId)`) ensure data updates only broadcast to authorized collaborators.

* **📋 Fluid Drag-and-Drop Kanban Board:**
  * Intuitive task movement across **To Do**, **In Progress**, and **Completed** sprint lanes.
  * Task prioritization badges (`High`, `Medium`, `Low`), assignee avatars, deadline countdowns, and overdue detection.

* **🏢 Collaborative Workspaces & Team Governance:**
  * Create dedicated project boards from scratch or launch with agile sprint templates.
  * Invite colleagues by email with automatic deduplication.
  * **Owner-governed member management**: Project owners can remove members with cascading safety checks, while collaborators enjoy a read-only team roster.

* **📊 Live Telemetry & Sprint Dashboard:**
  * High-performance aggregation pipeline computes real-time sprint progress, task breakdowns, and active workspace counts.

* **🎨 Hallmark Light Dusk UI/UX:**
  * Designed using modern human-interface guidelines: warm alabaster canvas, layered frosted glass panels (`backdrop-blur-2xl`), deep slate typography, and Iris/Indigo focal accents to eliminate eye fatigue.
  * Fully responsive mobile-ready layout with fluid micro-interactions and transitions.

* **🛡️ Production-Grade Security & Authentication:**
  * JSON Web Token (JWT) authentication delivered via secure, cross-site compatible `httpOnly`, `SameSite=None` cookies with Bearer header fallback.
  * Passwords securely hashed with `bcryptjs`.
  * Strict authorization middleware guarding every sensitive REST route.

* **☁️ Cloud Media Integration:**
  * User avatar uploads processed and resized via Multer and stored on **Cloudinary CDN**.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Vercel)                               │
│  React 19 • Vite • Zustand • Tailwind CSS v4 • dnd-kit • Socket.io-client│
└───────────────────▲───────────────────────────────▲────────────────────┘
                    │ REST API (HTTPS)              │ WebSocket Duplex (WSS)
                    │ (Cookies / JSON)              │ (Room Broadcasting)
┌───────────────────▼───────────────────────────────▼────────────────────┐
│                       SERVER (Node.js / Express 5)                     │
│  JWT Auth Guard • CORS Manager • Socket Handler • REST Controllers     │
└───────────────────▲───────────────────────────────▲────────────────────┘
                    │ Mongoose ODM                  │ Upload Streams
┌───────────────────▼───────────────┐   ┌───────────▼────────────────────┐
│       MongoDB Atlas Database      │   │         Cloudinary CDN         │
│  Users • Projects • Indexed Tasks │   │     Optimized User Avatars     │
└───────────────────────────────────┘   └────────────────────────────────┘
```

### Data Topology & Relationships
* **User (`User`):** Identity attributes (`name`, `email`, `password` hash, `avatar`, `bio`).
* **Project (`Project`):** `title`, `description`, `owner` (ref: `User`), and `members` array (`user` ref and `role`).
* **Task (`Task`):** `title`, `description`, `project` (ref: `Project`), `assignedTo` (ref: `User`), `status` (`to-do` | `inprogress` | `completed`), `priority` (`low` | `medium` | `high`), and `duedate`.
* **Database Indexing:** Compound indexes `{ project: 1, status: 1 }` and `{ project: 1, createdAt: -1 }` accelerate high-frequency sprint board queries.

---

## 📡 REST API Reference

### 🔐 Authentication & Session
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new engineering profile | No |
| `POST` | `/api/auth/login` | Authenticate user & issue signed JWT cookie | No |
| `POST` | `/api/auth/logout` | Clear auth cookie & terminate session | Yes |

### 👤 User Profile
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/users/me` | Fetch currently authenticated user data | Yes |
| `PUT` | `/api/users/me` | Update name or bio | Yes |
| `POST` | `/api/users/upload-avatar` | Upload profile image to Cloudinary CDN | Yes |

### 📁 Projects & Teams
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/projects` | List all projects user owns or participates in | Yes |
| `POST` | `/api/projects` | Create a new project workspace | Yes |
| `PUT` | `/api/projects/:id` | Update project title or description (Owner only) | Yes |
| `DELETE` | `/api/projects/:id` | Delete project and cascade-delete its tasks (Owner only) | Yes |
| `POST` | `/api/projects/:id/invite` | Invite team member by email (Owner only) | Yes |
| `DELETE` | `/api/projects/:id/members/:userId` | Remove team member from workspace (Owner only) | Yes |

### 📝 Tasks & Sprint Board
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/tasks/project/:projectId` | Fetch all tasks for an authorized project | Yes |
| `POST` | `/api/tasks` | Create task & emit `taskCreated` event | Yes |
| `PUT` | `/api/tasks/:id` | Update task fields/status & emit `taskUpdated` event | Yes |
| `DELETE` | `/api/tasks/:id` | Delete task & emit `taskDeleted` event | Yes |

### 📊 Dashboard & System
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/dashboard/stats` | Aggregated sprint counts (`todo`, `inprogress`, `done`) | Yes |
| `GET` | `/health` | Server health check endpoint | No |
| `GET` | `/` | API status message | No |

---

## ⚡ WebSocket Events (Socket.io)

| Event Name | Direction | Payload | Description |
| :--- | :---: | :--- | :--- |
| `joinProject` | Client → Server | `projectId` (string) | Subscribes socket client to the target project room |
| `taskCreated` | Server → Client | `Task` object | Real-time broadcast when a new task is added |
| `taskUpdated` | Server → Client | `Task` object | Real-time broadcast on task edit, assignee change, or drag-and-drop lane transition |
| `taskDeleted` | Server → Client | `taskId` (string) | Real-time broadcast when a task is removed |

---

## 🛠️ Tech Stack & Tooling

### Frontend
* **Core:** React 19, Vite 8, React Router v7
* **State Management:** Zustand (decoupled, lightweight stores)
* **Real-time Client:** Socket.io-client v4
* **Styling:** Tailwind CSS v4, Lucide React icons
* **Interactions:** dnd-kit (drag-and-drop primitives)
* **Feedback:** React Hot Toast
* **HTTP:** Axios (with credentials enabled)

### Backend
* **Runtime:** Node.js, Express.js 5
* **Database & ODM:** MongoDB Atlas, Mongoose 9
* **Real-time Server:** Socket.io v4
* **Authentication:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cookie-parser`
* **Media Processing:** Multer, `multer-storage-cloudinary`, Cloudinary SDK v2
* **Networking:** CORS with dynamic origin filtering, custom DNS fallback resolvers

---

## 💻 Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/shansaybhatia/DevCollab-TaskManager.git
cd DevCollab-TaskManager
```

### 2. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd Server
   npm install
   ```

2. Create a `.env` file in `Server/` (refer to `.env.example`):
   ```env
   PORT=3000
   MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/devcollab?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key
   CLIENT_URL=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

3. Start the backend development server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   Backend will start at `http://localhost:3000`.

### 3. Frontend Setup
1. Open a new terminal and navigate to `client/`:
   ```bash
   cd client
   npm install
   ```

2. (Optional for local dev) Create a `.env` file in `client/` if pointing to an external backend:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_SOCKET_URL=http://localhost:3000
   ```
   *(By default in local mode, Vite proxies `/api` and `/` to localhost).*

3. Start Vite dev server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 📦 Deployment Guide

### Frontend on Vercel
1. Link the repository to [Vercel](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Framework Preset: **Vite**.
4. Configure Environment Variables in Vercel:
   * `VITE_API_URL` = `https://your-backend-domain.com/api`
   * `VITE_SOCKET_URL` = `https://your-backend-domain.com`
5. The included `client/vercel.json` automatically handles client-side routing rewrites for React Router.

### Backend on Render / Railway
1. Create a Web Service pointing to the `Server` directory.
2. Build command: `npm install`
3. Start command: `node server.js`
4. Set Environment Variables:
   * `PORT` = `3000` (or provided by host)
   * `MONGO_URL` = Your MongoDB Atlas connection URI
   * `JWT_SECRET` = Strong secret key
   * `CLIENT_URL` = `https://task-manager-three-chi-70.vercel.app`
   * `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
