import { useEffect, useState } from "react";
import { getDashboardData } from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardData();
        setData(res);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="p-6">No data found. Please update your profile first.</div>;
  }

  const { user, stats, profile } = data;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <h1 className="text-2xl font-bold">
        Welcome, {user.name}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-100 rounded">
          <p>BMI</p>
          <h2 className="text-xl font-semibold">
            {stats.bmi ? Number(stats.bmi).toFixed(1) : "—"}
          </h2>
          <p className="text-sm text-gray-500">{stats.bmiCategory || ""}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <p>Body Fat</p>
          <h2 className="text-xl font-semibold">
            {stats.bodyfat ? `${Number(stats.bodyfat).toFixed(1)}%` : "—"}
          </h2>
          <p className="text-sm text-gray-500">{stats.bodyfatCategory || ""}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <p>Calorie Target</p>
          <h2 className="text-xl font-semibold">
            {stats.caloriesGoal} kcal
          </h2>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <p>Hydration Goal</p>
          <h2 className="text-xl font-semibold">
            {stats.hydrationGoal} ml
          </h2>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <p>Weight</p>
          <h2 className="text-xl font-semibold">
            {profile.weight} kg
          </h2>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <p>Height</p>
          <h2 className="text-xl font-semibold">
            {profile.height} cm
          </h2>
        </div>
      </div>

      {/* Daily Tip */}
      <div className="p-4 bg-green-50 border border-green-200 rounded">
        <h2 className="text-lg font-semibold mb-1">💡 Daily Tip</h2>
        <p className="text-gray-700">{stats.tip}</p>
      </div>
    </div>
  );
}