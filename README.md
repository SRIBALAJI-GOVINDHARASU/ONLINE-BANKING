# Online Banking System (MERN)

A minimal **MERN stack** online banking system implementing **OOSE design patterns**, role-based access control, and a basic UI.

## ✅ Features

- Customer / Staff / Admin login (role-based dashboards)
- Registration with automatic account creation
- Accounts store bank account number, ATM card, PIN, passbook ID
- Transactions: deposit, withdrawal, transfer, bill payments
- Notifications stored in database
- Audit logging for all API requests
- Maintenance mode (last day of month)

## 🧩 Project Structure

- `server/` — Express API + MongoDB (Mongoose)
- `client/` — React frontend (Vite)

## 🚀 Setup

### 1) Start MongoDB (local)

Make sure MongoDB Community Server is running locally (default `mongodb://127.0.0.1:27017`).

### 2) Start backend

```powershell
cd "d:\BANK ONLINE\server"
npm install
npm run dev
```

### 3) Start frontend

```powershell
cd "d:\BANK ONLINE\client"
npm install
npm run dev
```

### 4) Open UI

Go to: `http://localhost:3000`

### 5) Run both server + client together (recommended)

From the repo root:

```powershell
cd "d:\BANK ONLINE"
npm install
npm run dev
```

This will run both backend and frontend together.

## 🔐 Default environment variables

File: `.env`

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/online_banking
JWT_SECRET=supersecretjwtkey
```

## 🗂️ API Endpoints

### Special behavior

- Customers must enter their **ATM PIN** in the UI to unlock balance and transaction views.
- Admins have a built-in **DB Viewer** (list collections + view documents) under the Admin dashboard.


Authentication
- `POST /api/register`
- `POST /api/login`

Account
- `GET /api/account`
- `PUT /api/account/update`
- `PUT /api/account/change-password`
- `GET /api/balance`
- `GET /api/passbook`

Transactions
- `POST /api/deposit`
- `POST /api/withdraw`
- `POST /api/transfer`
- `GET /api/transactions`

Bill Payments
- `POST /api/pay-bill`

Notifications
- `GET /api/notifications`

Admin (requires `admin` role)
- `GET /api/admin/users`
- `GET /api/admin/transactions`
- `GET /api/admin/logs`
- `POST /api/admin/user-status`

---

If you want enhancements (real-time updates, bank staff workflows, PDF statements), just ask!
