import { useEffect, useState } from "react";
import { getNutritionData } from "../services/api";
import { nutritionData as fallbackNutrition } from "../data/nutritionData";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Leaf, Drumstick, Clock, Flame } from "lucide-react";

export default function Nutrition() {
  const [backendPlan, setBackendPlan] = useState<any>(null);
  const [calorieTarget, setCalorieTarget] = useState<number>(2000);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "veg" | "non-veg">("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getNutritionData();
        setBackendPlan(res.mealPlan);
        setCalorieTarget(res.calorieTarget);
      } catch (err) {
        console.error("Nutrition fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading nutrition...</div>;
  }

  // Use static suggestions for veg/non-veg meal cards
  const mealSuggestions = fallbackNutrition.mealSuggestions;

  const filterMeals = (meals: any[]) => {
    if (filter === "all") return meals;
    return meals.filter((meal) => meal.type === filter);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nutrition Guidance</h1>

      {/* Backend Meal Plan */}
      {backendPlan && Object.keys(backendPlan).length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <h2 className="text-lg font-semibold">
              🍽️ Your Personalized Meal Plan ({calorieTarget} kcal/day)
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {Object.entries(backendPlan).map(([meal, info]: any) => (
                <div key={meal} className="p-3 bg-green-50 rounded border">
                  <h3 className="font-semibold capitalize">{meal}</h3>
                  {info.error ? (
                    <p className="text-sm text-gray-500">{info.error}</p>
                  ) : (
                    <>
                      <p className="text-sm">{info.food}</p>
                      <p className="text-xs text-gray-500">
                        {info.portion_grams}g · {info.calories_target} kcal
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>

        <Button
          variant={filter === "veg" ? "default" : "outline"}
          onClick={() => setFilter("veg")}
        >
          <Leaf className="h-4 w-4 mr-1" />
          Veg
        </Button>

        <Button
          variant={filter === "non-veg" ? "default" : "outline"}
          onClick={() => setFilter("non-veg")}
        >
          <Drumstick className="h-4 w-4 mr-1" />
          Non-Veg
        </Button>
      </div>

      {/* Static Meal Suggestions by Tab */}
      <Tabs defaultValue="breakfast">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
          <TabsTrigger value="lunch">Lunch</TabsTrigger>
          <TabsTrigger value="dinner">Dinner</TabsTrigger>
          <TabsTrigger value="snacks">Snacks</TabsTrigger>
        </TabsList>

        {Object.entries(mealSuggestions).map(([meal, items]: any) => (
          <TabsContent key={meal} value={meal} className="space-y-3 mt-4">
            {filterMeals(items).map((item: any, index: number) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{item.name}</h3>

                        <Badge
                          variant={item.type === "veg" ? "secondary" : "default"}
                        >
                          {item.type === "veg" ? (
                            <Leaf className="h-3 w-3 mr-1" />
                          ) : (
                            <Drumstick className="h-3 w-3 mr-1" />
                          )}
                          {item.type}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Portion: {item.portion}
                      </p>

                      <div className="flex gap-4 text-sm mt-2">
                        <span className="flex items-center gap-1">
                          <Flame className="h-4 w-4" />
                          {item.calories} kcal
                        </span>

                        <span>Protein: {item.protein}</span>

                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {item.time}
                        </span>
                      </div>
                    </div>

                    <Button size="sm">Add</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}