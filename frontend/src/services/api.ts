// ─── FitFuel API Service ───────────────────────────────
// All calls go to the FastAPI backend via VITE_API_URL

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ─── Helpers ──────────────────────────────────────────

async function request(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

function getUserId(): number {
  const raw = localStorage.getItem("user");
  if (!raw) return 0;
  try {
    return JSON.parse(raw).id || 0;
  } catch {
    return 0;
  }
}

// ─── Auth ─────────────────────────────────────────────

export const loginUser = async (email: string, password: string) => {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // Store user info for later use
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
};

export const signupUser = async (
  name: string,
  email: string,
  password: string,
  extra?: { age?: number; gender?: string; height_cm?: number; weight_kg?: number; activity_level?: string }
) => {
  const data = await request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
      age: extra?.age || 25,
      gender: extra?.gender || "male",
      height_cm: extra?.height_cm || 170,
      weight_kg: extra?.weight_kg || 70,
      activity_level: extra?.activity_level || "moderate",
    }),
  });

  localStorage.setItem("user", JSON.stringify(data.user));
  return data;
};

export const getUserProfile = async () => {
  const userId = getUserId();
  if (!userId) throw new Error("Not logged in");
  return request(`/user/profile/${userId}`);
};

// ─── Dashboard (composite) ───────────────────────────

export const getDashboardData = async () => {
  const userId = getUserId();

  // Fetch profile
  let profile: any = { name: "User", weight: 70, height: 170, age: 25, gender: "male", activityLevel: "moderate" };
  try {
    profile = await request(`/user/profile/${userId}`);
  } catch { /* use defaults */ }

  // Fetch metrics (BMI + body fat)
  let metrics: any = { bmi: 0, bmi_category: "Unknown", bodyfat_percentage: 0, bodyfat_category: "Unknown" };
  try {
    metrics = await request("/metrics/calculate", {
      method: "POST",
      body: JSON.stringify({
        weight: profile.weight,
        height: profile.height,
        age: profile.age,
        gender: profile.gender,
      }),
    });
  } catch { /* use defaults */ }

  // Fetch calorie target
  let caloriesGoal = 2000;
  try {
    const cal = await request("/nutrition/calories", {
      method: "POST",
      body: JSON.stringify({
        weight: profile.weight,
        height: profile.height,
        age: profile.age,
        gender: profile.gender,
        activity: profile.activityLevel || "moderate",
        goal: "maintain",
      }),
    });
    caloriesGoal = cal.calories;
  } catch { /* use defaults */ }

  // Fetch hydration target
  let hydrationGoal = 2500;
  try {
    const hydration = await request("/nutrition/hydration", {
      method: "POST",
      body: JSON.stringify({
        weight: profile.weight,
        activity: profile.activityLevel || "moderate",
      }),
    });
    hydrationGoal = hydration.hydration_ml_per_day;
  } catch { /* use defaults */ }

  // Fetch daily tip
  let tip = "Stay consistent with your wellness goals!";
  try {
    const tipData = await request("/nutrition/tips");
    tip = tipData.tip;
  } catch { /* use default */ }

  return {
    user: { name: profile.name },
    stats: {
      bmi: metrics.bmi,
      bmiCategory: metrics.bmi_category,
      bodyfat: metrics.bodyfat_percentage,
      bodyfatCategory: metrics.bodyfat_category,
      caloriesGoal,
      hydrationGoal,
      tip,
    },
    profile,
  };
};

// ─── Nutrition ────────────────────────────────────────

export const getNutritionData = async () => {
  const userId = getUserId();

  let profile: any = { weight: 70, height: 170, age: 25, gender: "male", activityLevel: "moderate" };
  try {
    profile = await request(`/user/profile/${userId}`);
  } catch { /* use defaults */ }

  // Get calorie target first
  let calories = 2000;
  try {
    const cal = await request("/nutrition/calories", {
      method: "POST",
      body: JSON.stringify({
        weight: profile.weight,
        height: profile.height,
        age: profile.age,
        gender: profile.gender,
        activity: profile.activityLevel || "moderate",
        goal: "maintain",
      }),
    });
    calories = cal.calories;
  } catch { /* use default */ }

  // Get meal plan from backend
  let mealPlan: any = {};
  try {
    const mp = await request("/nutrition/meal-plan", {
      method: "POST",
      body: JSON.stringify({ calories }),
    });
    mealPlan = mp.meal_plan;
  } catch { /* empty plan */ }

  return {
    calorieTarget: calories,
    mealPlan,
    profile,
  };
};

export const searchFood = async (keyword: string) => {
  return request(`/nutrition/food/search?keyword=${encodeURIComponent(keyword)}`);
};

export const getFoodByCategory = async (category: string) => {
  return request(`/nutrition/food/category/${encodeURIComponent(category)}`);
};

// ─── API object (profile, hydration, workout) ─────────

export const api = {
  // ── Profile ──
  getProfile: async () => {
    const userId = getUserId();
    if (!userId) return { age: "25", gender: "male", height: "170", weight: "70", activityLevel: "moderate" };
    return request(`/user/profile/${userId}`);
  },

  updateProfile: async (data: any) => {
    const userId = getUserId();
    if (!userId) throw new Error("Not logged in");
    return request(`/user/profile/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // ── Metrics ──
  calculateMetrics: async (weight: number, height: number, age: number, gender: string) => {
    return request("/metrics/calculate", {
      method: "POST",
      body: JSON.stringify({ weight, height, age, gender }),
    });
  },

  // ── Hydration ──
  getHydration: async (): Promise<{ intake: number; goal: number }> => {
    const userId = getUserId();
    let profile: any = { weight: 70, activityLevel: "moderate" };
    try {
      profile = await request(`/user/profile/${userId}`);
    } catch { /* defaults */ }

    let goal = 2500;
    try {
      const h = await request("/nutrition/hydration", {
        method: "POST",
        body: JSON.stringify({
          weight: profile.weight,
          activity: profile.activityLevel || "moderate",
        }),
      });
      goal = h.hydration_ml_per_day;
    } catch { /* default */ }

    // intake is tracked client-side for now
    const stored = localStorage.getItem("hydration_intake");
    const intake = stored ? parseInt(stored, 10) : 0;

    return { intake, goal };
  },

  updateHydration: async (intake: number) => {
    localStorage.setItem("hydration_intake", intake.toString());
    return { intake };
  },

  // ── Workout ──
  getWorkout: async () => {
    const userId = getUserId();
    let profile: any = { weight: 70, height: 170, age: 25, gender: "male" };
    try {
      profile = await request(`/user/profile/${userId}`);
    } catch { /* defaults */ }

    // Calculate BMI category first
    let bmiCategory = "Normal";
    try {
      const metrics = await request("/metrics/calculate", {
        method: "POST",
        body: JSON.stringify({
          weight: profile.weight,
          height: profile.height,
          age: profile.age,
          gender: profile.gender,
        }),
      });
      bmiCategory = metrics.bmi_category;
    } catch { /* default */ }

    // Get workout recommendation
    return request("/nutrition/workout", {
      method: "POST",
      body: JSON.stringify({
        bmi_category: bmiCategory,
        goal: "general",
        beginner: true,
      }),
    });
  },

  // ── Daily Tip ──
  getDailyTip: async () => {
    return request("/nutrition/tips");
  },
};