-- =====================================================
-- FitFuel — Supabase SQL Setup
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- =====================================================

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(10) NOT NULL,
    height_cm FLOAT NOT NULL,
    weight_kg FLOAT NOT NULL DEFAULT 70.0,
    activity_level VARCHAR(20) DEFAULT 'moderate',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Body metrics (BMI / body fat history)
CREATE TABLE IF NOT EXISTS body_metrics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    weight_kg FLOAT NOT NULL,
    bmi FLOAT,
    body_fat FLOAT,
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- 3. Foods database
CREATE TABLE IF NOT EXISTS foods (
    id SERIAL PRIMARY KEY,
    food_name VARCHAR UNIQUE,
    category VARCHAR,
    calories_per_100g FLOAT,
    protein_g FLOAT,
    carbs_g FLOAT,
    fat_g FLOAT
);

-- 4. Portion units
CREATE TABLE IF NOT EXISTS portion_units (
    id SERIAL PRIMARY KEY,
    food_id INTEGER REFERENCES foods(id) ON DELETE CASCADE,
    unit_name VARCHAR(50) NOT NULL,
    grams_equivalent FLOAT NOT NULL
);

-- 5. Hydration logs
CREATE TABLE IF NOT EXISTS hydration_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount_ml INTEGER NOT NULL,
    logged_at TIMESTAMP DEFAULT NOW()
);

-- 6. Workout logs
CREATE TABLE IF NOT EXISTS workout_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    workout_type VARCHAR(100),
    duration_min INTEGER,
    intensity VARCHAR(50),
    logged_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 7. Seed sample Indian food data
-- =====================================================
INSERT INTO foods (food_name, category, calories_per_100g, protein_g, carbs_g, fat_g) VALUES
    ('Poha', 'grain', 130, 2.5, 25, 2.5),
    ('Idli', 'grain', 39, 2, 8, 0.1),
    ('Upma', 'grain', 150, 4, 22, 5),
    ('Oats Porridge', 'grain', 68, 2.5, 12, 1.5),
    ('Chapati', 'grain', 120, 3.5, 20, 3),
    ('Rice (cooked)', 'grain', 130, 2.7, 28, 0.3),
    ('Toor Dal', 'dal', 120, 7.5, 18, 1.5),
    ('Moong Dal', 'dal', 105, 7, 18, 0.5),
    ('Chana Dal', 'dal', 150, 8, 25, 2),
    ('Rajma (Kidney Beans)', 'dal', 127, 8.7, 22, 0.5),
    ('Masoor Dal', 'dal', 116, 9, 20, 0.4),
    ('Paneer', 'protein', 265, 18, 1.2, 21),
    ('Chicken Breast', 'protein', 165, 31, 0, 3.6),
    ('Egg (boiled)', 'protein', 155, 13, 1.1, 11),
    ('Tofu', 'protein', 76, 8, 1.9, 4.8),
    ('Fish (Rohu)', 'protein', 97, 17, 0, 2.7),
    ('Curd (Dahi)', 'protein', 60, 3.3, 5, 3.1),
    ('Soybean Chunks', 'protein', 345, 52, 33, 0.5)
ON CONFLICT (food_name) DO NOTHING;

-- =====================================================
-- Enable Row Level Security (optional but recommended)
-- =====================================================
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE body_metrics ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE hydration_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
