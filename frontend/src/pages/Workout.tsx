import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dumbbell,
  Clock,
  Flame,
  Play,
  CheckCircle2,
  Heart,
  Zap,
  Move
} from "lucide-react";
import { api } from "@/services/api";

// Static workout plans (displayed as exercise cards)
const workoutPlans = {
  beginner: [
    {
      name: "Morning Stretch Routine",
      duration: "10 min",
      calories: 50,
      exercises: [
        { name: "Neck Rolls", reps: "10 each side", duration: "1 min" },
        { name: "Shoulder Shrugs", reps: "15 reps", duration: "1 min" },
        { name: "Arm Circles", reps: "20 each direction", duration: "2 min" },
        { name: "Side Bends", reps: "10 each side", duration: "2 min" },
        { name: "Leg Swings", reps: "10 each leg", duration: "2 min" },
        { name: "Deep Breathing", reps: "5 breaths", duration: "2 min" },
      ],
      icon: Move,
    },
    {
      name: "Basic Cardio",
      duration: "15 min",
      calories: 120,
      exercises: [
        { name: "Jumping Jacks", reps: "30 reps", duration: "2 min" },
        { name: "High Knees", reps: "20 each leg", duration: "2 min" },
        { name: "Butt Kicks", reps: "20 each leg", duration: "2 min" },
        { name: "March in Place", reps: "1 min", duration: "1 min" },
        { name: "Side Steps", reps: "20 each side", duration: "2 min" },
        { name: "Cool Down Walk", reps: "Slow pace", duration: "3 min" },
      ],
      icon: Heart,
    },
    {
      name: "Strength Foundation",
      duration: "20 min",
      calories: 150,
      exercises: [
        { name: "Wall Push-ups", reps: "10 reps x 3 sets", duration: "4 min" },
        { name: "Chair Squats", reps: "12 reps x 3 sets", duration: "4 min" },
        { name: "Standing Calf Raises", reps: "15 reps x 3 sets", duration: "3 min" },
        { name: "Modified Plank", reps: "20 sec x 3 sets", duration: "3 min" },
        { name: "Bird Dog", reps: "8 each side x 2 sets", duration: "4 min" },
        { name: "Stretching", reps: "Full body", duration: "2 min" },
      ],
      icon: Dumbbell,
    },
  ],
};

const weeklySchedule = [
  { day: "Monday", workout: "Strength Foundation", completed: true },
  { day: "Tuesday", workout: "Basic Cardio", completed: true },
  { day: "Wednesday", workout: "Rest Day", completed: true },
  { day: "Thursday", workout: "Morning Stretch Routine", completed: false },
  { day: "Friday", workout: "Basic Cardio", completed: false },
  { day: "Saturday", workout: "Strength Foundation", completed: false },
  { day: "Sunday", workout: "Rest Day", completed: false },
];

export default function Workout() {
  const [recommendation, setRecommendation] = useState<any>(null);

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const data = await api.getWorkout();
        setRecommendation(data);
      } catch (err) {
        console.error("Workout load error:", err);
      }
    };

    loadWorkout();
  }, []);

  const completedDays = weeklySchedule.filter(d => d.completed).length;
  const totalWorkoutDays = weeklySchedule.filter(d => d.workout !== "Rest Day").length;
  const completedWorkouts = weeklySchedule.filter(d => d.completed && d.workout !== "Rest Day").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Workout Routines</h1>
        <p className="text-muted-foreground">
          Beginner-friendly exercise plans for your fitness journey
        </p>
      </div>

      {/* Backend Recommendation */}
      {recommendation && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg">🎯 Your Personalized Recommendation</CardTitle>
            <CardDescription>Based on your BMI and fitness profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Focus</p>
                <p className="font-semibold">{recommendation.focus}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Intensity</p>
                <p className="font-semibold">{recommendation.intensity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold">{recommendation.duration_min} min</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">Recommended Exercises</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {recommendation.exercises?.map((ex: string, i: number) => (
                  <Badge key={i} variant="secondary">{ex}</Badge>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">Sets: {recommendation.sets} · Reps: {recommendation.reps}</p>
              <p className="text-xs text-orange-600 mt-1">⚠️ {recommendation.safety_note}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">This Week's Progress</CardTitle>
          <CardDescription>
            {completedWorkouts} of {totalWorkoutDays} workouts completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={(completedDays / 7) * 100} className="h-2 mb-4" />

          <div className="grid grid-cols-7 gap-2">
            {weeklySchedule.map((day, index) => (
              <div key={index} className="text-center">
                <div className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center mb-1 ${
                  day.completed
                    ? "bg-green-500 text-white"
                    : day.workout === "Rest Day"
                    ? "bg-gray-300 text-gray-500"
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {day.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="text-xs font-medium">{day.day.slice(0, 1)}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{day.day.slice(0, 3)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workout Plans */}
      <Tabs defaultValue="beginner">
        <TabsList>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
        </TabsList>

        <TabsContent value="beginner" className="mt-4 space-y-4">
          {workoutPlans.beginner.map((workout, index) => {
            const Icon = workout.icon;

            return (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gray-200 flex items-center justify-center">
                        <Icon className="h-6 w-6" />
                      </div>

                      <div>
                        <CardTitle className="text-lg">{workout.name}</CardTitle>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {workout.duration}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-orange-500">
                            <Flame className="h-4 w-4" />
                            {workout.calories} kcal
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button>
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="divide-y">
                    {workout.exercises.map((exercise, exIndex) => (
                      <div key={exIndex} className="flex items-center justify-between p-4 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                            {exIndex + 1}
                          </span>
                          <div>
                            <p className="font-medium">{exercise.name}</p>
                            <p className="text-sm text-muted-foreground">{exercise.reps}</p>
                          </div>
                        </div>
                        <Badge>{exercise.duration}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}