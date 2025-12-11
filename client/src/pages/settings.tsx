import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Bell, Moon, Sun, Globe, Shield, User, Palette, Clock, Volume2, VolumeX } from "lucide-react";

interface SettingsFormData {
  wakeTime: string;
  sleepTime: string;
  dailyStudyHours: number;
  dailyStudyMinutes: number;
  notifications: boolean;
  soundEffects: boolean;
  darkMode: boolean;
  language: string;
  timezone: string;
}

export default function SettingsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock settings data - in a real app, this would come from an API
  const [settings, setSettings] = useState({
    wakeTime: "07:00",
    sleepTime: "23:00",
    dailyStudyHours: 6,
    dailyStudyMinutes: 0,
    notifications: true,
    soundEffects: true,
    darkMode: false,
    language: "en",
    timezone: "America/Sao_Paulo"
  });

  const form = useForm<SettingsFormData>({
    resolver: zodResolver({} as any), // Simplified for demo
    defaultValues: settings
  });

  const updateSettings = useMutation({
    mutationFn: async (data: SettingsFormData) => {
      // In a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: (data) => {
      setSettings(data);
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved successfully."
      });
    }
  });

  const onSubmit = (data: SettingsFormData) => {
    updateSettings.mutate(data);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t("nav.settings")}
        </h1>
        <p className="text-muted-foreground">
          Customize your learning experience and preferences
        </p>
      </div>

      <Tabs defaultValue="study" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="study" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Study
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Account
          </TabsTrigger>
        </TabsList>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <TabsContent value="study" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Study Schedule
                </CardTitle>
                <CardDescription>
                  Set your daily study routine and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="wakeTime">Wake Time</Label>
                    <Input
                      id="wakeTime"
                      type="time"
                      {...form.register("wakeTime")}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sleepTime">Sleep Time</Label>
                    <Input
                      id="sleepTime"
                      type="time"
                      {...form.register("sleepTime")}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Daily Study Goal</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="number"
                      placeholder="6"
                      {...form.register("dailyStudyHours", { valueAsNumber: true })}
                      className="w-20"
                    />
                    <span className="flex items-center">hours</span>
                    <Input
                      type="number"
                      placeholder="0"
                      {...form.register("dailyStudyMinutes", { valueAsNumber: true })}
                      className="w-20"
                    />
                    <span className="flex items-center">minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about study reminders and achievements
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) =>
                      form.setValue("notifications", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="soundEffects">Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sounds for achievements and notifications
                    </p>
                  </div>
                  <Switch
                    id="soundEffects"
                    checked={settings.soundEffects}
                    onCheckedChange={(checked) =>
                      form.setValue("soundEffects", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={settings.darkMode}
                    onCheckedChange={(checked) =>
                      form.setValue("darkMode", checked)
                    }
                  />
                </div>

                <Separator />

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => form.setValue("language", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => form.setValue("timezone", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">America/Sao_Paulo</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Security
                </CardTitle>
                <CardDescription>
                  Manage your account security and connected services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Connected Accounts</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">GitHub</p>
                          <p className="text-sm text-muted-foreground">
                            Connected as {user?.email}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Connected</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Account Actions</Label>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Download My Data
                    </Button>
                    <Button variant="destructive" className="w-full justify-start">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={updateSettings.isPending}
              className="min-w-32"
            >
              {updateSettings.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
