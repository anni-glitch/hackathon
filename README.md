# 🏛️ NyaySetu — AI-Powered Court Case Scheduling System

> **"Bridging the gap between citizens and justice."**

NyaySetu is an AI-powered web application that tackles India's massive court backlog (50 million+ pending cases) by automatically prioritizing and scheduling hearings based on urgency, case age, and social vulnerability — ensuring the most critical cases are heard first.

---

## 🎯 The Problem

India's courts have over **5 crore (50 million) pending cases**. A person filing a case today may wait **5–10 years** for a hearing. There is no smart system to decide which case is most urgent. Judges and registrars rely on manual processes and spreadsheets.

**NyaySetu solves this with AI.**

---

## ✨ Key Features

- 🤖 **AI Priority Scoring** — Every case gets a score (0–100) based on age, urgency, adjournments, and social factors (senior citizens, minors, health emergencies)
- 📅 **One-Click Auto-Scheduling** — Registrar clicks a button; AI schedules the top 50 urgent cases into time slots automatically
- 🔮 **Resolution Prediction** — ML-based prediction of how many days a case will take to resolve
- ⚖️ **ADR Matchmaker** — Identifies cases eligible for Mediation, Arbitration, or Lok Adalat (saving months of court time)
- 🔗 **Blockchain Audit Trail** — Every action is cryptographically logged for transparency
- 👥 **5 Role-Based Dashboards** — Admin, Registrar, Judge, Lawyer, Litigant each get their own view
- 🔐 **Secure Auth** — JWT authentication, bcrypt password hashing, rate limiting, admin approval workflow

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS v4, Vite, Recharts |
| Backend | Node.js, Express.js |
| Database | PostgreSQL + Sequelize ORM |
| Authentication | JWT + bcrypt |
| AI/ML | Custom rule-based scoring engine (JavaScript) |
| Blockchain | ethers.js (hash generation + mock mode) |
| Real-time | Socket.io (infrastructure ready) |
| Security | Helmet.js, CORS, express-rate-limit |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- Git

### 1. Clone the Repository
git clone https://github.com/your-username/ai-court-scheduling-system.git
cd ai-court-scheduling-system


### 2. Backend Setup
cd backend
npm install

### Create your environment file from the template
cp .env.example .env
### Edit .env with your PostgreSQL credentials and a strong JWT_SECRET


### 3. Database Setup
Make sure PostgreSQL is running, then create the database:
CREATE DATABASE nyaysetu_db;
CREATE USER nyay_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nyaysetu_db TO nyay_user;


Then seed demo data:

npm run seed


### 4. Frontend Setup

cd ../frontend
npm install

### Create your environment file from the template
cp .env.example .env
### Edit .env if your backend runs on a different port


### 5. Run the Application

**Terminal 1 — Backend:**

cd backend
node server.js
### Server runs on http://localhost:5000


**Terminal 2 — Frontend:**

cd frontend
npm run dev
### App runs on http://localhost:5173


### 6. Docker (Alternative)

docker-compose up --build


---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Registrar** | registrar@nyaysetu.com | password123 |
| **Judge** | judge@nyaysetu.com | password123 |
| **Lawyer** | lawyer@nyaysetu.com | password123 |
| **Litigant** | litigant@nyaysetu.com | password123 |

> **Admin**: Register a new account with any email — the first user or a seeded admin account can approve others.

---

## � Demo Script (For Judges / Evaluators)

1. **Login as Registrar** → See live stats (Total Cases, ADR Eligible, Critical Backlog)
2. **Click "Run Auto-Schedule"** → Watch AI schedule top urgent cases in seconds
3. **Login as Judge** → View Critical Matters Queue, click "Open Case" for AI insights
4. **Login as Lawyer** → See case portfolio, click "Insights" for AI analysis
5. **Login as Litigant** → Click "View My Case Status" → See AI resolution prediction + ADR recommendation

---

## 📂 Project Structure


ai-court-scheduling-system/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/       # Auth & validation middleware
│   ├── models/          # Sequelize models (User, Case, Hearing)
│   ├── routes/          # API routes (auth, cases, schedule, dashboard)
│   ├── seeders/         # Demo data seeder
│   ├── services/        # AI services (priority, prediction, ADR, blockchain)
│   ├── .env.example     # Environment variable template
│   └── server.js        # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React context (Auth)
│   │   ├── pages/       # Dashboard pages per role
│   │   └── utils/       # API client, helpers
│   ├── .env.example     # Environment variable template
│   └── index.html
├── docker-compose.yml
├── demo-data.sql
├── HACKATHON_PRESENTATION.md   # Full project breakdown for evaluators
└── README.md


---

## 🤖 How the AI Priority Score Works


Score = Age Points + Urgency Points + Adjournment Points + Social Bonus

Age Points      → 4 pts/year, max 40 pts (capped at 10 years)
Urgency Points  → urgency_score (1–10) × 3, max 30 pts
Adjournment Pts → 3 pts per postponement, max 30 pts
Social Bonus    → +10 (senior citizen), +5 (minor), +15 (health emergency)

CRITICAL ≥ 75 | HIGH ≥ 50 | NORMAL < 50


---

## ⚖️ ADR Time Savings (Example)

| Case Type | Court Timeline | ADR Timeline | Time Saved |
|---|---|---|---|
| Property Dispute | 1095 days | 90 days (Arbitration) | **92% faster** |
| Family Matter | 545 days | 60 days (Mediation) | **89% faster** |
| Motor Accident | 455 days | 30 days (Lok Adalat) | **93% faster** |

---

## 🗺️ Future Enhancements

- [ ] Fix litigant dashboard to show user's own cases (not first case in DB)
- [ ] Add auth guard to admin routes
- [ ] Replace hardcoded stats (backlog reduction %, avg case age) with real calculations
- [ ] SMS/Email notifications for hearing reminders (Twilio / MSG91)
- [ ] Train real ML model on eCourts public dataset
- [ ] eCourts API integration
- [ ] Multi-language support (Hindi, Tamil, Telugu, Bengali)
- [ ] Mobile app (React Native)
- [ ] Deploy smart contract on Polygon testnet for real blockchain audit logs

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

*Built for the Hackathon. NyaySetu — AI for a more just India. 🇮🇳*
