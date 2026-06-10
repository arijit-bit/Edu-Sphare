"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/components/language-provider";
import { StudentShell } from "@/app/student/student-ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Lock,
  Users,
  Bell,
  Globe,
  Palette,
  Shield,
  Download,
  Trash2,
  ChevronRight,
  HelpCircle,
  PhoneCall,
  Bug,
  MessageSquare,
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, options } = useLanguage();

  // Profile data state
  const [profile, setProfile] = useState({
    name: "Aarav S. Malhotra",
    email: "aarav.malhotra@edusphare.edu",
    phone: "+91 98765 43210",
  });
  const [profileInput, setProfileInput] = useState({ ...profile });

  // Security password state
  const [passwordState, setPasswordState] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [is2FaEnabled, setIs2FaEnabled] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  // Data privacy consent state
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  // Modals visibility state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isGuardiansOpen, setIsGuardiansOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Download data state
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Confirm delete text
  const [confirmDelete, setConfirmDelete] = useState("");

  // Toast notifications state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile({ ...profileInput });
    setIsProfileOpen(false);
    triggerToast("Profile information updated successfully!");
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (passwordState.newPass !== passwordState.confirm) {
      triggerToast("New passwords do not match!", "error");
      return;
    }
    setPasswordState({ current: "", newPass: "", confirm: "" });
    setIsPasswordOpen(false);
    triggerToast("Password changed successfully!");
  };

  const handleDownloadData = () => {
    setDownloading(true);
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloading(false);
            triggerToast("Your academic records export is ready for download!");
          }, 500);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    if (confirmDelete.toUpperCase() !== "DELETE") {
      triggerToast("Please type 'DELETE' to confirm.", "error");
      return;
    }
    setIsDeleteOpen(false);
    setConfirmDelete("");
    triggerToast("Account deletion request submitted to administration.", "error");
  };

  return (
    <StudentShell
      title={t("Settings")}
      subtitle={t("Manage your Edu Sphare profile, preferences, notifications, and security.")}
    >
      {/* Toast Alert */}
      {toast.show && (
        <div
          className={cn(
            "fixed top-4 right-4 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-up",
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/90 dark:border-emerald-800 dark:text-emerald-300"
              : "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/90 dark:border-rose-800 dark:text-rose-300"
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" />
          )}
          <p className="text-sm font-semibold">{toast.message}</p>
        </div>
      )}

      {/* Profile Summary Card */}
      <Card className="mb-6">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-20 w-20 border-2 border-primary/20 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-black">
              AM
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">
              Grade 12-A &nbsp;·&nbsp; ID: STU-2024-0921
            </p>
            <p className="text-xs text-muted-foreground/80">{profile.email}</p>
          </div>
          <div className="sm:ml-auto">
            <Button
              onClick={() => {
                setProfileInput({ ...profile });
                setIsProfileOpen(true);
              }}
              variant="outline"
              className="gap-2"
            >
              <User className="h-4 w-4" />
              {t("Edit Profile")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections Grid */}
      <div className="space-y-8 mb-8">
        {/* GROUP 1: Account Settings */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            {t("Account Settings")}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Setting 1: Profile Info */}
            <Card
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => {
                setProfileInput({ ...profile });
                setIsProfileOpen(true);
              }}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground">{t("Profile Information")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("Update your name, email address, and contact number.")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
              </CardContent>
            </Card>

            {/* Setting 2: Security & Password */}
            <Card
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setIsPasswordOpen(true)}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 shrink-0">
                  <Lock className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground">{t("Security & Password")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("Manage your credentials, password reset history, and 2FA.")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
              </CardContent>
            </Card>

            {/* Setting 3: Linked Guardians */}
            <Card
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setIsGuardiansOpen(true)}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground">{t("Linked Guardians")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("View list of verified parent or guardian profiles connected.")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* GROUP 2: Preferences */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            {t("Preferences & Theme")}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Setting 4: Notifications */}
            <Card
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setIsNotificationsOpen(true)}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground">{t("Notifications")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("Configure notifications across SMS, email, and mobile push.")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
              </CardContent>
            </Card>

            {/* Setting 5: Language & Accessibility */}
            <Card
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setIsLanguageOpen(true)}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground">{t("Language")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("Choose system language and text sizing preferences.")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
              </CardContent>
            </Card>

            {/* Setting 6: Theme & Display */}
            <Card
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setIsThemeOpen(true)}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-500 shrink-0">
                  <Palette className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground">{t("Theme & Display")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("Switch between Light, Dark, or System visual mode.")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* GROUP 3: Privacy & Data */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            {t("Security & Data Management")}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Setting 7: Privacy Policy */}
            <Card
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setIsPrivacyOpen(true)}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground">{t("Privacy & Security")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("Manage diagnostic sharing options and privacy consent.")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
              </CardContent>
            </Card>

            {/* Setting 8: Download Data */}
            <Card
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={handleDownloadData}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                  {downloading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Download className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground">{t("Download Data")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {downloading
                      ? t("Generating export... {progress}%", { progress: downloadProgress })
                      : t("Export all your grades, schedule, and attendance data.")}
                  </p>
                  {downloading && (
                    <Progress value={downloadProgress} className="h-1 mt-2 bg-muted" />
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
              </CardContent>
            </Card>

            {/* Setting 9: Delete Account */}
            <Card
              className="cursor-pointer border-destructive/20 hover:bg-destructive/5 hover:border-destructive/40 transition-all duration-200"
              onClick={() => setIsDeleteOpen(true)}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-destructive/10 text-destructive shrink-0">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-destructive">{t("Delete Account")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("Request permanent account deletion and data scrubbing.")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-destructive/60 mt-1 shrink-0" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <Card className="bg-muted/30 border-muted-foreground/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            {t("Support & Resources")}
          </CardTitle>
          <CardDescription className="text-xs">
            {t("Quick links to access help docs or get in touch with the school administrators.")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => triggerToast(t("Help Center"))}
            >
              <HelpCircle className="h-4 w-4" />
              {t("Help Center")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => triggerToast(t("Contact Support"))}
            >
              <PhoneCall className="h-4 w-4" />
              {t("Contact Support")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => triggerToast(t("Report a Bug"))}
            >
              <Bug className="h-4 w-4" />
              {t("Report a Bug")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => triggerToast(t("Give Feedback"))}
            >
              <MessageSquare className="h-4 w-4" />
              {t("Give Feedback")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ═══ INTERACTIVE MODAL DIALOGS ═══ */}

      {/* 1. Edit Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile Information</DialogTitle>
            <DialogDescription>
              Update your primary contact details. Changes are logged for audit purposes.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveProfile} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="prof-name">Full Name</Label>
              <Input
                id="prof-name"
                value={profileInput.name}
                onChange={(e) => setProfileInput({ ...profileInput, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prof-email">Email Address</Label>
              <Input
                id="prof-email"
                type="email"
                value={profileInput.email}
                onChange={(e) => setProfileInput({ ...profileInput, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prof-phone">Phone Number</Label>
              <Input
                id="prof-phone"
                value={profileInput.phone}
                onChange={(e) => setProfileInput({ ...profileInput, phone: e.target.value })}
                required
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsProfileOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="gap-1.5">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Security & Password Dialog */}
      <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Ensure your account uses a long, random password to stay secure.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSavePassword} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="pass-curr">Current Password</Label>
              <Input
                id="pass-curr"
                type="password"
                value={passwordState.current}
                onChange={(e) => setPasswordState({ ...passwordState, current: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pass-new">New Password</Label>
              <Input
                id="pass-new"
                type="password"
                value={passwordState.newPass}
                onChange={(e) => setPasswordState({ ...passwordState, newPass: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pass-conf">Confirm New Password</Label>
              <Input
                id="pass-conf"
                type="password"
                value={passwordState.confirm}
                onChange={(e) => setPasswordState({ ...passwordState, confirm: e.target.value })}
                required
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border">
              <div>
                <Label htmlFor="pass-2fa" className="font-bold block text-sm">
                  Enable Two-Factor (2FA)
                </Label>
                <span className="text-xs text-muted-foreground">
                  Secure logins using verification codes.
                </span>
              </div>
              <Switch
                id="pass-2fa"
                checked={is2FaEnabled}
                onCheckedChange={(checked) => {
                  setIs2FaEnabled(checked);
                  triggerToast(
                    checked
                      ? "2FA enabled! Scan QR code sent to your email."
                      : "2FA disabled."
                  );
                }}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsPasswordOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Password</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. Guardians Dialog */}
      <Dialog open={isGuardiansOpen} onOpenChange={setIsGuardiansOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Linked Guardians</DialogTitle>
            <DialogDescription>
              These parent or guardian profiles have access to your academic records.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {[
              { name: "Rajesh Malhotra", relation: "Father", contact: "+91 98765 43211", active: true },
              { name: "Priya Malhotra", relation: "Mother", contact: "+91 98765 43212", active: true },
            ].map((g, idx) => (
              <div
                key={idx}
                className="p-3 border rounded-xl flex items-center justify-between bg-muted/20"
              >
                <div>
                  <p className="text-sm font-bold text-foreground">{g.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {g.relation} &nbsp;·&nbsp; {g.contact}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <span className="size-1 rounded-full bg-emerald-500" />
                  Linked
                </span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground text-center pt-2">
              Need to add or modify linked guardians? Contact the Registrar Office.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsGuardiansOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Notifications Dialog */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notification Preferences</DialogTitle>
            <DialogDescription>
              Select where and how you want to be notified of announcements, grades, and fee dues.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {[
              {
                id: "notif-email",
                label: "Email Notifications",
                desc: "Send weekly updates, assignment releases, and newsletters.",
                key: "email",
              },
              {
                id: "notif-sms",
                label: "SMS Notifications",
                desc: "Urgent announcements, weather alerts, and attendance alerts.",
                key: "sms",
              },
              {
                id: "notif-push",
                label: "Push Notifications",
                desc: "Instant desktop/mobile browser notifications for new messages.",
                key: "push",
              },
            ].map((n) => (
              <div
                key={n.id}
                className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/10"
              >
                <div className="flex-1 pr-4">
                  <Label htmlFor={n.id} className="font-bold text-sm block cursor-pointer">
                    {n.label}
                  </Label>
                  <span className="text-xs text-muted-foreground">{n.desc}</span>
                </div>
                <Switch
                  id={n.id}
                  checked={notifications[n.key]}
                  onCheckedChange={(checked) => {
                    setNotifications({ ...notifications, [n.key]: checked });
                    triggerToast("Notification settings updated!");
                  }}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsNotificationsOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Language Dialog */}
      <Dialog open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("Language")}</DialogTitle>
            <DialogDescription>
              {t("Choose system language and text sizing preferences.")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>{t("System Language")}</Label>
              <Select
                value={language}
                onValueChange={(val) => {
                  setLanguage(val);
                  const selected = options.find((option) => option.value === val)?.label || val;
                  triggerToast(t("Language switched to {language}", { language: t(selected) }));
                  return;
                  if (val === "hi") {
                    triggerToast("Language switched to Hindi (हिन्दी)");
                    return;
                  }
                  if (val === "bn") {
                    triggerToast("Language switched to Bengali (বাংলা)");
                    return;
                  }
                triggerToast(`Language switched to ${val === "en" ? "English" : val === "hi" ? "Hindi (हिन्दी)" : val === "es" ? "Spanish (Español)" : "French (Français)"}`);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder={t("Select Language")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (US)</SelectItem>
                  <SelectItem value="bn">Bengali (বাংলা)</SelectItem>
                  <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
                  <SelectItem value="es">Spanish (Español)</SelectItem>
                  <SelectItem value="fr">French (Français)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Text Sizing</Label>
              <Select defaultValue="normal">
                <SelectTrigger>
                  <SelectValue placeholder="Select Text Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="normal">Normal (Default)</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsLanguageOpen(false)}>Save & Exit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6. Theme Dialog */}
      <Dialog open={isThemeOpen} onOpenChange={setIsThemeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Theme & Display Mode</DialogTitle>
            <DialogDescription>
              Adjust visual styling. Select Light, Dark, or sync with your operating system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 py-2">
            {[
              { val: "light", label: "Light Mode", icon: Sun, color: "text-amber-500 bg-amber-500/10" },
              { val: "dark", label: "Dark Mode", icon: Moon, color: "text-blue-500 bg-blue-500/10" },
              { val: "system", label: "System Sync", icon: Laptop, color: "text-teal-500 bg-teal-500/10" },
            ].map((t) => {
              const IconComp = t.icon;
              const isActive = theme === t.val;
              return (
                <button
                  key={t.val}
                  onClick={() => {
                    setTheme(t.val);
                    triggerToast(`Theme set to ${t.label}`);
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 border rounded-2xl gap-3 transition-all duration-200 outline-none",
                    isActive
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:bg-muted/40 border-border"
                  )}
                >
                  <div className={cn("p-2.5 rounded-xl", t.color)}>
                    <IconComp className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-foreground">{t.label}</span>
                </button>
              );
            })}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsThemeOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 7. Privacy Dialog */}
      <Dialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Privacy & Security Consent</DialogTitle>
            <DialogDescription>
              Learn how we protect your educational records and manage system diagnostic sharing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-sm leading-relaxed text-muted-foreground">
            <p>
              Your data safety is regulated by educational compliance frameworks. Personal identity
              information is strictly restricted to administrative staff and linked guardians.
            </p>
            <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/20">
              <div>
                <Label htmlFor="priv-diag" className="font-bold text-foreground block text-sm">
                  Share Diagnostic Data
                </Label>
                <span className="text-xs">
                  Help developers improve UI performance and report errors.
                </span>
              </div>
              <Switch
                id="priv-diag"
                checked={analyticsConsent}
                onCheckedChange={(checked) => {
                  setAnalyticsConsent(checked);
                  triggerToast(
                    checked
                      ? "Opted in to sharing diagnostic details."
                      : "Opted out of diagnostics."
                  );
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPrivacyOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 8. Delete Account Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Request Account Deletion
            </DialogTitle>
            <DialogDescription className="text-rose-600 dark:text-rose-400 font-medium">
              Warning: This is an administrative deletion request. Proceeding will lock your portal
              and start the student record deletion workflow.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDeleteAccount} className="space-y-4 py-2">
            <p className="text-xs text-muted-foreground leading-normal">
              To verify this extreme action, please type the word{" "}
              <span className="font-extrabold text-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                DELETE
              </span>{" "}
              in the input field below.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="del-confirm" className="sr-only">
                Confirm deletion
              </Label>
              <Input
                id="del-confirm"
                placeholder="Type 'DELETE' here…"
                value={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.value)}
                className="border-destructive/40 focus-visible:ring-destructive"
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                Confirm Deletion Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </StudentShell>
  );
}
