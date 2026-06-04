# HealthLink Appointment System

Full-stack healthcare appointment and treatment management system built with Next.js, Node.js, Express.js, MongoDB, JWT, and bcrypt.

## Structure

- `backend` - Express API, MongoDB models, JWT auth, role-based routes
- `frontend` - Next.js app router UI with protected dashboards and healthcare workflows

## Run Locally

Backend:

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Set `MONGO_URI` in `backend/.env` when MongoDB is ready.

## MongoDB Setup

1. Install MongoDB Community Server or create a free MongoDB Atlas cluster.
2. Copy `backend/.env.example` to `backend/.env`.
3. Set `MONGO_URI`:

Local MongoDB:

```env
MONGO_URI=mongodb://127.0.0.1:27017/healthlink_app
```

MongoDB Atlas:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/healthlink_app
```

4. Start the backend. Every booking, approval, prescription, treatment, and notification is stored through Mongoose models in MongoDB.
5. Create real users from the registration page. No demo accounts are required for normal use.



Admin:   admin@healthlink.test / Admin@123
Doctor:  doctor1@healthlink.test / Doctor@123
Patient: patient1@healthlink.test / 