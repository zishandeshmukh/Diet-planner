import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Droplets,
  Plus,
  Minus,
  Target,
  Lightbulb,
  Sun,
  Moon,
  Coffee,
  GlassWater
} from "lucide-react";
import { toast } from "sonner";

const wellnessTips = [
  {
    title: "Start Your Day Right",
    description:
      "Drink a glass of warm water with lemon first thing in the morning to kickstart your metabolism.",
    icon: Sun,
  },
  {
    title: "Pre-Meal Hydration",
    description:
      "Drink water 30 minutes before meals to aid digestion and prevent overeating.",
    icon: GlassWater,
  },
  {
    title: "Limit Caffeine",
    description:
      "Too much tea or coffee can dehydrate you. Balance with extra water for every caffeinated drink.",
    icon: Coffee,
  },
  {
    title: "Evening Moderation",
    description:
      "Reduce water intake 2 hours before bed to ensure quality sleep without interruptions.",
    icon: Moon,
  },
];

export default function Hydration() {
  const [currentIntake, setCurrentIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2500);

  const progress = (currentIntake / dailyGoal) * 100;

  useEffect(() => {
    const loadHydration = async () => {
      try {
        const data = await api.getHydration();
        setCurrentIntake(data.intake);
        setDailyGoal(data.goal);
      } catch (err) {
        console.error("Hydration load error:", err);
      }
    };

    loadHydration();
  }, []);

  const addWater = async (amount: number) => {
    const newIntake = Math.min(currentIntake + amount, dailyGoal + 500);
    setCurrentIntake(newIntake);

    await api.updateHydration(newIntake);
    toast.success(`Added ${amount}ml of water!`);
  };

  const removeWater = async (amount: number) => {
    const newIntake = Math.max(currentIntake - amount, 0);
    setCurrentIntake(newIntake);

    await api.updateHydration(newIntake);
    toast.info(`Removed ${amount}ml`);
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5" />
            Hydration Tracker
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>{currentIntake} ml</span>
            <span>{dailyGoal} ml goal</span>
          </div>

          <Progress value={progress} />

          <div className="flex gap-3">
            <Button onClick={() => addWater(250)}>
              <Plus className="w-4 h-4 mr-1" /> Add 250ml
            </Button>

            <Button variant="outline" onClick={() => removeWater(250)}>
              <Minus className="w-4 h-4 mr-1" /> Remove 250ml
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Wellness Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Hydration Tips
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {wellnessTips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div key={index} className="flex gap-3">
                <Icon className="w-5 h-5 mt-1" />
                <div>
                  <h3 className="font-semibold">{tip.title}</h3>
                  <p className="text-sm text-gray-500">
                    {tip.description}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

    </div>
  );
}