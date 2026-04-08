import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Save, User, Ruler, Weight, Activity } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [bmiData, setBmiData] = useState<any>(null);

  const [formData, setFormData] = useState({
    age: "25",
    gender: "male",
    height: "170",
    weight: "70",
    activityLevel: "moderate",
  });

  // Fetch profile from backend on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();

        setFormData({
          age: String(data.age || 25),
          gender: data.gender || "male",
          height: String(data.height || 170),
          weight: String(data.weight || 70),
          activityLevel: data.activityLevel || "moderate",
        });

        // Calculate BMI from backend
        try {
          const metrics = await api.calculateMetrics(
            Number(data.weight),
            Number(data.height),
            Number(data.age),
            data.gender
          );
          setBmiData(metrics);
        } catch { /* skip */ }

        toast.success("Profile loaded");
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, []);

  // Save profile to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.updateProfile(formData);

      // Recalculate BMI after save
      const metrics = await api.calculateMetrics(
        Number(formData.weight),
        Number(formData.height),
        Number(formData.age),
        formData.gender
      );
      setBmiData(metrics);

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">
            Update your health information for personalized recommendations
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Health Information
                </CardTitle>
                <CardDescription>
                  This information helps us calculate your BMI and provide personalized guidance
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) =>
                        setFormData({ ...formData, gender: value })
                      }
                      className="flex gap-4"
                    >
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>

                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>

                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </RadioGroup>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input
                      type="number"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({ ...formData, height: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input
                      type="number"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Activity Level</Label>
                  <Select
                    value={formData.activityLevel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, activityLevel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="very-active">Very Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Profile"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Sidebar — BMI + Body Fat from backend */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Your BMI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {bmiData
                  ? bmiData.bmi.toFixed(1)
                  : (
                      Number(formData.weight) /
                      Math.pow(Number(formData.height) / 100, 2)
                    ).toFixed(1)}
              </div>
              {bmiData && (
                <p className="text-sm text-muted-foreground mt-1">
                  {bmiData.bmi_category}
                </p>
              )}
            </CardContent>
          </Card>

          {bmiData && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Body Fat %</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {bmiData.bodyfat_percentage}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {bmiData.bodyfat_category}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}