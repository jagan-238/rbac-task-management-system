# ✦ TaskFlow — Role-Based Task Management System

A production-style Full Stack Task Management System built with the **MERN Stack** featuring JWT Authentication and Role-Based Access Control (RBAC).

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---

## 📸 Screenshots

> Admin Dashboard — Analytics Overview

![Admin Dashboard]
<img width="898" height="417" alt="image" src="https://github.com/user-attachments/assets/3a153602-b14a-4268-ae50-4d012877659a" />
<img width="875" height="419" alt="image" src="https://github.com/user-attachments/assets/7693779b-b9d5-4675-b9df-fd4812452cb4" />



> User Dashboard — My Tasks

![User Dashboard]
<img width="884" height="425" alt="image" src="https://github.com/user-attachments/assets/d0638e53-f211-4a7c-81d4-f3d125b066cb" />


---

## 🚀 Features

### 👤 User
- Register and Login with JWT Authentication
- Create, View, Update, Delete own tasks
- Set task priority (Low / Medium / High)
- Track task status (Pending / Completed)
- Cannot access or modify other users' tasks

### 🛡️ Admin
- View and manage all users
- Activate / Deactivate user accounts
- View and delete any task
- Monitor real-time activity logs
- View analytics (total users, tasks, completed, pending)

### 🔒 Security
- JWT Authentication on every protected route
- Passwords hashed with bcrypt (never stored plain text)
- Role-based middleware on all admin APIs
- Ownership verification before update or delete
- Inactive users blocked from logging in

---

## 🗂️ Project Structure

```
taskflow/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, GetMe
│   │   ├── taskController.js      # Task CRUD
│   │   └── adminController.js     # Admin operations
│   ├── middleware/
│   │   └── authMiddleware.js      # protect + adminOnly
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── Task.js                # Task schema
│   │   └── ActivityLog.js         # Log schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   └── .env.example
│
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.jsx    # Global auth state
        ├── routes/
        │   └── ProtectedRoutes.jsx
        ├── services/
        │   └── api.js             # All Axios API calls
        ├── components/
        │   ├── Layout.jsx
        │   ├── Sidebar.jsx
        │   ├── StatCard.jsx
        │   └── TaskModal.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   ├── AdminDashboard.jsx
        │   ├── AdminUsers.jsx
        │   ├── AdminTasks.jsx
        │   ├── AdminLogs.jsx
        │   └── AdminAnalytics.jsx
        ├── App.jsx
        └── App.css
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Context API, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT (jsonwebtoken), bcryptjs |
| Styling | Pure CSS with CSS Variables |

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/jagan-238/rbac-task-management-system.git
cd rbac-task-management-system
```

### 2. Setup Backend

```bash
cd backend
npm install

```

Edit the `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```


### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```
---

## 🔑 API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/auth/me`

### Tasks
- `GET    /api/tasks`
- `POST   /api/tasks`
- `PUT    /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Admin
- `GET    /api/admin/users`
- `PUT    /api/admin/users/:id/status`
- `DELETE /api/admin/users/:id`
- `GET    /api/admin/tasks`
- `DELETE /api/admin/tasks/:id`
- `GET    /api/admin/logs`
- `GET    /api/admin/analytics`

---

## 👥 User Roles

### Admin
- Full access to all users and tasks
- View activity logs and analytics
- Cannot delete or deactivate themselves

### User
- Can only manage their own tasks
- Cannot access admin pages or APIs
- Blocked from login if account is inactive

---

## 📋 Activity Logs

The system automatically tracks:

| Action | Trigger |
|--------|---------|
| `LOGIN` | Every successful login |
| `TASK_CREATED` | When a task is created |
| `TASK_UPDATED` | When a task is updated |
| `TASK_DELETED` | When a task is deleted |

---

## 🚀 Deployment

| Service | Platform |
|---------|----------|
| Frontend | [Vercel](https://rbac-task-management-system.vercel.app/login) |
| Backend | [Render](https://rbac-task-management-system-1.onrender.com/) |



## 👨‍💻 Author

**Jagan**
