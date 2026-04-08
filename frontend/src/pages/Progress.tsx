import { useEffect, useState } from "react";
import { api } from "../services/api";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Activity,
  Flame,
  Droplets,
  Calendar,
  Trophy
} from "lucide-react";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";

/* ---------- STATIC CHART DATA (historical, unchanged) ---------- */

const weightData = [
  { date: "Week 1", weight: 72 },
  { date: "Week 2", weight: 71.5 },
  { date: "Week 3", weight: 71.2 },
  { date: "Week 4", weight: 70.8 },
  { date: "Week 5", weight: 70.5 },
  { date: "Week 6", weight: 70 },
];

const bmiData = [
  { date: "Week 1", bmi: 24.2 },
  { date: "Week 2", bmi: 24.0 },
  { date: "Week 3", bmi: 23.9 },
  { date: "Week 4", bmi: 23.7 },
  { date: "Week 5", bmi: 23.6 },
  { date: "Week 6", bmi: 23.5 },
];

const achievements = [
  { title: "First Week Complete", description: "Logged data for 7 consecutive days", earned: true },
  { title: "Hydration Hero", description: "Met water goal for 5 days straight", earned: true },
  { title: "Weight Warrior", description: "Lost 2 kg from starting weight", earned: true },
  { title: "Workout Wonder", description: "Completed 10 workouts", earned: false },
];

/* ---------- COMPONENT ---------- */

export default function Progress() {
  const [profile, setProfile] = useState<any>(null);
  const [hydration, setHydration] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const p = await api.getProfile();
        const h = await api.getHydration();
        setProfile(p);
        setHydration(h);

        // Get real BMI from backend
        try {
          const m = await api.calculateMetrics(
            Number(p.weight),
            Number(p.height),
            Number(p.age),
            p.gender
          );
          setMetrics(m);
        } catch { /* use fallback */ }
      } catch (err) {
        console.error("Progress load error:", err);
      }
    };

    loadData();
  }, []);

  if (!profile || !hydration) {
    return <p className="p-4">Loading progress...</p>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Progress & History</h1>
        <p className="text-muted-foreground">
          Track your wellness journey with detailed metrics and insights
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Current Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{profile.weight} kg</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Current BMI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {metrics ? metrics.bmi.toFixed(1) : "—"}
            </p>
            {metrics && (
              <p className="text-xs text-muted-foreground">{metrics.bmi_category}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Body Fat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {metrics ? `${metrics.bodyfat_percentage}%` : "—"}
            </p>
            {metrics && (
              <p className="text-xs text-muted-foreground">{metrics.bodyfat_category}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Hydration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(hydration.intake / 1000).toFixed(1)} L
            </p>
            <p className="text-xs text-muted-foreground">
              Goal: {(hydration.goal / 1000).toFixed(1)} L
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weight Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area dataKey="weight" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>BMI Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bmiData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="bmi" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.map((a, i) => (
              <div key={i} className="flex justify-between">
                <span>{a.title}</span>
                {a.earned && <Badge>Earned</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}