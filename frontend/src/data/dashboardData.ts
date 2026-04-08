// src/data/dashboardData.ts

export const dashboardData = {
  user: {
    name: "John",
  },

  stats: {
    bmi: 22.5,
    waterProgress: 60,
    waterIntake: "1.5L",
    caloriesConsumed: 1450,
    caloriesGoal: 2000,
    healthScore: 85,
  },

  goals: {
    water: { current: 1.5, target: 2.5 },
    calories: { current: 1450, target: 2000 },
    protein: { current: 45, target: 60 },
    exercise: { current: 20, target: 30 },
  },

  meals: [
    {
      type: "Breakfast",
      description: "Poha with vegetables",
      calories: 350,
      label: "B",
    },
    {
      type: "Lunch",
      description: "Dal, Rice, Sabzi, Roti",
      calories: 650,
      label: "L",
    },
    {
      type: "Snack",
      description: "Fruit chaat & chai",
      calories: 200,
      label: "S",
    },
  ],
};