<p align="center">
  <h1 align="center">🥗 FitFuel — Diet & Fitness Planner</h1>
  <p align="center">
    A full-stack diet and fitness tracker with Indian food database, calorie tracking, hydration logging, workout monitoring, and progress analytics.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
</p>

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Setup & Installation](#-setup--installation)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Supabase Database Setup](#2-supabase-database-setup)
  - [3. Backend Setup](#3-backend-setup)
  - [4. Frontend Setup](#4-frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

| Module         | Description                                                        |
| -------------- | ------------------------------------------------------------------ |
| **Auth**       | User registration & login with secure password management          |
| **Dashboard**  | At-a-glance view of daily calories, macros, hydration & workouts   |
| **Nutrition**  | Log meals from a curated Indian food database (with portion units) |
| **Hydration**  | Track daily water intake with visual progress indicators           |
| **Workouts**   | Log workout sessions with type, duration & intensity               |
| **Progress**   | Track weight, BMI & body-fat trends over time with charts          |
| **Profile**    | Manage personal info, health metrics & activity level              |
| **Rule Engine**| JSON-driven health rules (BMI, body fat, calorie, hydration tips)  |

---

## 🛠 Tech Stack

### Backend
| Technology       | Purpose                     |
| ---------------- | --------------------------- |
| Python 3.11+     | Runtime                     |
| FastAPI          | REST API framework          |
| SQLAlchemy 2.0   | ORM & database models       |
| Supabase (PostgreSQL) | Cloud database        |
| Uvicorn          | ASGI server                 |

### Frontend
| Technology          | Purpose                      |
| ------------------- | ---------------------------- |
| React 18            | UI library                   |
| TypeScript           | Type safety                  |
| Vite                | Build tool & dev server      |
| TailwindCSS         | Utility-first CSS            |
| shadcn/ui + Radix   | Component library            |
| React Router v6     | Client-side routing          |
| Recharts            | Charting / data visualization|
| React Query         | Server state management      |

---

## 📁 Project Structure

```
FitFuel/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── database.py              # SQLAlchemy engine & session
│   ├── supabase_setup.sql       # SQL script for Supabase tables
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Backend env template
│   ├── models/
│   │   ├── user.py              # User model
│   │   ├── body_metric.py       # BMI / body-fat tracking model
│   │   ├── food.py              # Foods database model
│   │   ├── portion_unit.py      # Portion units model
│   │   ├── hydration_log.py     # Hydration log model
│   │   └── workout_log.py       # Workout log model
│   ├── routes/
│   │   ├── auth.py              # Registration & login endpoints
│   │   ├── user.py              # User profile endpoints
│   │   ├── metrics.py           # Body metrics endpoints
│   │   └── nutrition.py         # Food & nutrition endpoints
│   ├── services/
│   │   ├── calorie_service.py   # Calorie calculations
│   │   ├── nutrition_service.py # Nutrition logic
│   │   ├── hydration_service.py # Hydration logic
│   │   ├── workout_service.py   # Workout logic
│   │   ├── metric_services.py   # BMI / body-fat calculations
│   │   ├── tips_service.py      # Health tips generator
│   │   └── rule_engine.py       # JSON rule engine
│   ├── rules/
│   │   ├── bmi_rules.json       # BMI classification rules
│   │   ├── bodyfat_rules.json   # Body fat classification rules
│   │   ├── calorie_rules.json   # Calorie advice rules
│   │   ├── hydration_rules.json # Hydration advice rules
│   │   └── workout_rules.json   # Workout advice rules
│   └── data/
│       └── indian_food_cleaned.csv  # Indian food dataset
│
├── frontend/
│   ├── index.html               # Entry HTML file
│   ├── package.json             # Node.js dependencies
│   ├── vite.config.ts           # Vite configuration
│   ├── tailwind.config.ts       # TailwindCSS configuration
│   ├── .env.example             # Frontend env template
│   └── src/
│       ├── main.tsx             # React entry point
│       ├── App.tsx              # Root component with routing
│       ├── pages/
│       │   ├── Dashboard.tsx    # Main dashboard
│       │   ├── Login.tsx        # Auth page (login/register)
│       │   ├── Profile.tsx      # User profile management
│       │   ├── Nutrition.tsx    # Meal logging
│       │   ├── Hydration.tsx    # Water intake tracking
│       │   ├── Workout.tsx      # Workout logging
│       │   └── Progress.tsx     # Health progress charts
│       ├── components/          # Reusable UI components
│       ├── services/            # API client services
│       ├── hooks/               # Custom React hooks
│       └── data/                # Static data / constants
│
├── .gitignore
└── README.md
```

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Python 3.11+** → [Download](https://www.python.org/downloads/)
- **Node.js 18+** and **npm** → [Download](https://nodejs.org/)
- **Git** → [Download](https://git-scm.com/)
- **Supabase Account** (free tier) → [Sign Up](https://supabase.com/)

---

## 🚀 Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/zishandeshmukh/Diet-planner.git
cd Diet-planner
```

### 2. Supabase Database Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) and create a **new project**.
2. Navigate to **SQL Editor → New Query**.
3. Copy and paste the contents of `backend/supabase_setup.sql` and click **Run**.
4. Go to **Settings → Database** and copy the **Connection string (URI)** — select the "Transaction pooler" variant.

### 3. Backend Setup

```bash
# Navigate to backend
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create your environment file
cp .env.example .env
# Edit .env and fill in your Supabase credentials (see Environment Variables section)

# Start the backend server
uvicorn main:app --reload --port 8000
```

The API will be available at **http://localhost:8000**. Visit **http://localhost:8000/docs** for the interactive Swagger documentation.

### 4. Frontend Setup

```bash
# Navigate to frontend (from project root)
cd frontend

# Install Node.js dependencies
npm install

# Create your environment file
cp .env.example .env
# Edit .env if you changed the backend port

# Start the development server
npm run dev
```

The frontend will be available at **http://localhost:5173** (or the port shown in the terminal).

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable          | Description                                    | Example                                |
| ----------------- | ---------------------------------------------- | -------------------------------------- |
| `SUPABASE_DB_URL` | PostgreSQL connection string from Supabase      | `postgresql://postgres:password@db...` |
| `SUPABASE_URL`    | Supabase project URL                            | `https://xxxx.supabase.co`             |
| `SUPABASE_KEY`    | Supabase anon/public key                        | `eyJhbGciOiJIUz...`                   |
| `FRONTEND_URL`    | Frontend URL for CORS                           | `http://localhost:8080`                |
| `PORT`            | Backend server port                             | `8000`                                 |

### Frontend (`frontend/.env`)

| Variable       | Description                | Example                  |
| -------------- | -------------------------- | ------------------------ |
| `VITE_API_URL` | Backend API base URL       | `http://localhost:8000`  |

> ⚠️ **Never commit `.env` files.** Use `.env.example` as a template.

---

## 📡 API Endpoints

### Auth (`/auth`)
| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| POST   | `/auth/register`    | Register a new user  |
| POST   | `/auth/login`       | Login & get user ID  |

### User (`/user`)
| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| GET    | `/user/{user_id}`   | Get user profile         |
| PUT    | `/user/{user_id}`   | Update user profile      |

### Metrics (`/metrics`)
| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| POST   | `/metrics/{user_id}`          | Log body metrics         |
| GET    | `/metrics/{user_id}/history`  | Get metrics history      |

### Nutrition (`/nutrition`)
| Method | Endpoint                   | Description              |
| ------ | -------------------------- | ------------------------ |
| GET    | `/nutrition/foods`         | List all foods           |
| GET    | `/nutrition/search`        | Search foods by name     |
| POST   | `/nutrition/log`           | Log a food intake        |
| GET    | `/nutrition/recommendations/{user_id}` | Get meal recommendations |

---

## 🗄 Database Schema

```
┌──────────────┐     ┌────────────────┐     ┌─────────────────┐
│   users      │     │  body_metrics  │     │ hydration_logs  │
├──────────────┤     ├────────────────┤     ├─────────────────┤
│ id (PK)      │◄────│ user_id (FK)   │     │ user_id (FK)    │──► users
│ name         │     │ weight_kg      │     │ amount_ml       │
│ email        │     │ bmi            │     │ logged_at       │
│ password     │     │ body_fat       │     └─────────────────┘
│ age          │     │ recorded_at    │
│ gender       │     └────────────────┘     ┌─────────────────┐
│ height_cm    │                            │  workout_logs   │
│ weight_kg    │     ┌────────────────┐     ├─────────────────┤
│ activity_lvl │     │    foods       │     │ user_id (FK)    │──► users
│ created_at   │     ├────────────────┤     │ workout_type    │
└──────────────┘     │ id (PK)        │     │ duration_min    │
                     │ food_name      │     │ intensity       │
                     │ category       │     │ logged_at       │
                     │ calories/100g  │     └─────────────────┘
                     │ protein_g      │
                     │ carbs_g        │     ┌─────────────────┐
                     │ fat_g          │     │ portion_units   │
                     └────────────────┘◄────├─────────────────┤
                                            │ food_id (FK)    │
                                            │ unit_name       │
                                            │ grams_equiv     │
                                            └─────────────────┘
```

---

## 🖼 Screenshots

> Screenshots coming soon. Run the project locally to see the full UI.

---

## 🤝 Contributing

1. **Fork** this repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a **Pull Request**

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made by <a href="https://github.com/zishandeshmukh">Zishan Deshmukh</a>
</p>
