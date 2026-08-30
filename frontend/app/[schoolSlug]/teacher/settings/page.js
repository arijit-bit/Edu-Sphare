"use client";

import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/components/language-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Lock,
  BookOpen,
  Bell,
  Globe,
  Palette,
  Shield,
  Download,
  LogOut,
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
  // We'll safely use language if it exists, otherwise fallback
  let languageProvider = { language: 'en', setLanguage: () => {}, t: (str) => str, options: [] };
  try {
    const lang = useLanguage();
    if (lang) languageProvider = lang;
  } catch(e) {}
  
  const { language, setLanguage, t, options } = languageProvider;

  // Profile data state
  const [profile, setProfile] = useState({
    name: "Rahul Iyer",
    email: "rahul.iyer@edusphare.com",
    phone: "+91 98765 43210",
    bio: "Head of Mathematics Department with over 15 years of teaching experience."
  });
  const [profileInput, setProfileInput] = useState({ ...profile });

  // Security password state
  const [passwordState, setPasswordState] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [is2FaEnabled, setIs2FaEnabled] = useState(true);

  // Notification state
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  // Modals visibility state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isProfessionalOpen, setIsProfessionalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

  // Download data state
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

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
            triggerToast("Your teaching records export is ready for download!");
          }, 500);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const handleDeactivateRequest = (e) => {
    e.preventDefault();
    setIsDeactivateOpen(false);
    triggerToast("Deactivation request submitted to the administration.", "error");
  };

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 max-w-[1600px] mx-auto w-full space-y-8 overflow-y-auto">
      {/* Header Section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          {t("Settings")}
        </h2>
        <p className="text-muted-foreground mt-1">
          {t("Manage your teacher profile, preferences, notifications, and security.")}
        </p>
      </div>

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
      <Card className="border-border/50 shadow-md bg-card/60 backdrop-blur-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-cyan-600 to-blue-600 w-full relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
        <CardContent className="p-6 pt-0 flex flex-col sm:flex-row items-center gap-6 relative">
          <Avatar className="h-24 w-24 border-4 border-background shadow-xl -mt-12 shrink-0 bg-background">
            <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=RI" />
            <AvatarFallback className="bg-cyan-100 text-cyan-700 text-3xl font-bold">
              RI
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left space-y-1 mt-4 sm:mt-0">
            <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
            <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
              Head of Mathematics Department &nbsp;·&nbsp; ID: EMP-2015-042
            </p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
          <div className="sm:ml-auto mt-4 sm:mt-0">
            <Button
              onClick={() => {
                setProfileInput({ ...profile });
                setIsProfileOpen(true);
              }}
              variant="outline"
              className="gap-2 bg-background shadow-sm hover:bg-muted/50 transition-colors"
            >
              <User className="h-4 w-4" />
              {t("Edit Profile")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections Grid */}
      <div className="space-y-8">
        {/* GROUP 1: Account Settings */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 pl-1">
            {t("Account Settings")}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Setting 1: Profile Info */}
            <Card
              className="cursor-pointer border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/80 hover:shadow-md transition-all duration-300 group"
              onClick={() => {
                setProfileInput({ ...profile });
                setIsProfileOpen(true);
              }}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground">{t("Profile Information")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("Update your name, email, contact number, and bio.")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0 group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>

            {/* Setting 2: Security & Password */}
            <Card
              className="cursor-pointer border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/80 hover:shadow-md transition-all duration-300 group"
              onClick={() => setIsPasswordOpen(true)}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0 group-hover:scale-110 group-hover:bg-rose-500/20 transition-all">
                  <Lock className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground">{t("Security & Password")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("Manage your login credentials and two-factor authentication.")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0 group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>

            {/* Setting 3: Professional Details */}
            <Card
              className="cursor-pointer border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/80 hover:shadow-md transition-all duration-300 group"
              onClick={() => setIsProfessionalOpen(true)}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground">{t("Professional Details")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("View assigned classes, subjects, and qualifications.")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0 group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* GROUP 2: Preferences */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 pl-1">
            {t("Preferences & Theme")}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Setting 4: Notifications */}
            <Card
              className="cursor-pointer border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/80 hover:shadow-md transition-all duration-300 group"
              onClick={() => setIsNotificationsOpen(true)}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground">{t("Notifications")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("Configure alerts for messages, leave requests, and meetings.")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0 group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>

            {/* Setting 5: Language */}
            <Card
              className="cursor-pointer border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/80 hover:shadow-md transition-all duration-300 group"
              onClick={() => setIsLanguageOpen(true)}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground">{t("Language")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("Choose system language and regional preferences.")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0 group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>

            {/* Setting 6: Theme & Display */}
            <Card
              className="cursor-pointer border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/80 hover:shadow-md transition-all duration-300 group"
              onClick={() => setIsThemeOpen(true)}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                  <Palette className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground">{t("Theme & Display")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("Switch between Light, Dark, or System visual mode.")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0 group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* GROUP 3: Privacy & Data */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 pl-1">
            {t("Privacy & Data")}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Setting 7: Privacy Policy */}
            <Card
              className="cursor-pointer border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/80 hover:shadow-md transition-all duration-300 group"
              onClick={() => setIsPrivacyOpen(true)}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground">{t("Privacy & Security")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("Manage data sharing options and view privacy policies.")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0 group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>

            {/* Setting 8: Download Data */}
            <Card
              className="cursor-pointer border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/80 hover:shadow-md transition-all duration-300 group"
              onClick={handleDownloadData}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0 group-hover:scale-110 group-hover:bg-teal-500/20 transition-all">
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
                    <Progress value={downloadProgress} className="h-1 mt-2 bg-teal-500/50" />
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0 group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>

            {/* Setting 9: Deactivate Account */}
            <Card
              className="cursor-pointer border-destructive/20 bg-destructive/5 backdrop-blur-sm hover:bg-destructive/10 hover:border-destructive/40 transition-all duration-300 group"
              onClick={() => setIsDeactivateOpen(true)}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-destructive/10 text-destructive shrink-0 group-hover:scale-110 group-hover:bg-destructive/20 transition-all">
                  <LogOut className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-destructive">{t("Deactivate Account")}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("Submit a request to deactivate your teacher portal access.")}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-destructive/60 mt-1 shrink-0 group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <Card className="bg-card/40 backdrop-blur-sm border-border/50 mt-8 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
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
              className="gap-1.5 bg-background shadow-sm hover:bg-muted/50"
              onClick={() => triggerToast(t("Help Center"))}
            >
              <HelpCircle className="h-4 w-4" />
              {t("Help Center")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 bg-background shadow-sm hover:bg-muted/50"
              onClick={() => triggerToast(t("Contact Admin"))}
            >
              <PhoneCall className="h-4 w-4" />
              {t("Contact Admin")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 bg-background shadow-sm hover:bg-muted/50"
              onClick={() => triggerToast(t("Report a Bug"))}
            >
              <Bug className="h-4 w-4" />
              {t("Report a Bug")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 bg-background shadow-sm hover:bg-muted/50"
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
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/50">
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
                className="bg-background/50"
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
                className="bg-background/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prof-phone">Phone Number</Label>
              <Input
                id="prof-phone"
                value={profileInput.phone}
                onChange={(e) => setProfileInput({ ...profileInput, phone: e.target.value })}
                required
                className="bg-background/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prof-bio">Bio</Label>
              <textarea 
                id="prof-bio" 
                value={profileInput.bio}
                onChange={(e) => setProfileInput({ ...profileInput, bio: e.target.value })}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsProfileOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="gap-1.5 bg-cyan-600 hover:bg-cyan-700">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Security & Password Dialog */}
      <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/50">
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
                className="bg-background/50"
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
                className="bg-background/50"
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
                className="bg-background/50"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
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
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">Update Password</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. Professional Details Dialog */}
      <Dialog open={isProfessionalOpen} onOpenChange={setIsProfessionalOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle>Professional Details</DialogTitle>
            <DialogDescription>
              Your assigned classes and qualifications based on school records.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {[
              { label: "Designation", value: "Head of Department (Mathematics)" },
              { label: "Qualifications", value: "M.Sc. Mathematics, B.Ed." },
              { label: "Primary Subject", value: "Mathematics" },
              { label: "Assigned Classes", value: "10th A, 10th B, 11th Sci, 12th Comm" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 border border-border/50 rounded-xl bg-background/50 flex flex-col gap-1"
              >
                <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">{item.label}</span>
                <span className="text-sm font-medium text-foreground">{item.value}</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground text-center pt-2">
              Need to update these records? Please contact the Administration Office.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsProfessionalOpen(false)} className="bg-cyan-600 hover:bg-cyan-700">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Notifications Dialog */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle>Notification Preferences</DialogTitle>
            <DialogDescription>
              Select where and how you want to be notified of messages, leave approvals, and meetings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {[
              {
                id: "notif-email",
                label: "Email Notifications",
                desc: "Send daily digests and critical alerts via email.",
                key: "email",
              },
              {
                id: "notif-sms",
                label: "SMS Notifications",
                desc: "Urgent announcements and leave approval alerts.",
                key: "sms",
              },
              {
                id: "notif-push",
                label: "Push Notifications",
                desc: "Instant desktop/mobile browser notifications for messages.",
                key: "push",
              },
            ].map((n) => (
              <div
                key={n.id}
                className="flex items-center justify-between p-3 border border-border/50 rounded-xl hover:bg-muted/30 transition-colors bg-background/50"
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
            <Button onClick={() => setIsNotificationsOpen(false)} className="bg-cyan-600 hover:bg-cyan-700">Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Language Dialog */}
      <Dialog open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/50">
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
                  triggerToast(t("Language preference updated."));
                }}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder={t("Select Language")} />
                </SelectTrigger>
                <SelectContent>
                  {(options && options.length > 0) ? options.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  )) : (
                    <>
                      <SelectItem value="en">English (US)</SelectItem>
                      <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Text Sizing</Label>
              <Select defaultValue="normal">
                <SelectTrigger className="bg-background/50">
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
            <Button onClick={() => setIsLanguageOpen(false)} className="bg-cyan-600 hover:bg-cyan-700">Save & Exit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6. Theme Dialog */}
      <Dialog open={isThemeOpen} onOpenChange={setIsThemeOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle>Theme & Display Mode</DialogTitle>
            <DialogDescription>
              Adjust visual styling. Select Light, Dark, or sync with your operating system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 py-2">
            {[
              { val: "light", label: "Light", icon: Sun, color: "text-amber-500 bg-amber-500/10" },
              { val: "dark", label: "Dark", icon: Moon, color: "text-cyan-500 bg-cyan-500/10" },
              { val: "system", label: "System", icon: Laptop, color: "text-teal-500 bg-teal-500/10" },
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
                    "flex flex-col items-center justify-center p-4 border border-border/50 rounded-2xl gap-3 transition-all duration-300 outline-none hover:shadow-md hover:bg-muted/50",
                    isActive
                      ? "border-cyan-500 bg-cyan-500/5 ring-1 ring-cyan-500 shadow-sm"
                      : "bg-background/50"
                  )}
                >
                  <div className={cn("p-2.5 rounded-full transition-colors", t.color)}>
                    <IconComp className="h-6 w-6" />
                  </div>
                  <span className={cn("text-xs font-bold", isActive ? "text-cyan-600 dark:text-cyan-400" : "text-foreground")}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* 7. Privacy Dialog */}
      <Dialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle>Privacy & Security</DialogTitle>
            <DialogDescription>
              Manage data sharing options and view privacy policies.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between p-3 border border-border/50 rounded-xl bg-background/50">
              <div className="flex-1 pr-4">
                <Label htmlFor="analytics" className="font-bold text-sm block cursor-pointer">
                  Share Usage Analytics
                </Label>
                <span className="text-xs text-muted-foreground">Help us improve by sharing anonymous usage data.</span>
              </div>
              <Switch id="analytics" defaultChecked />
            </div>
            <div className="p-4 bg-muted/40 rounded-xl border border-border/50 space-y-2">
              <p className="text-sm font-semibold">Privacy Policy</p>
              <p className="text-xs text-muted-foreground">
                We collect your data solely for educational administration. We never sell your data to third parties.
                Read our full privacy policy on the school website.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPrivacyOpen(false)} className="bg-cyan-600 hover:bg-cyan-700">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 8. Deactivate Dialog */}
      <Dialog open={isDeactivateOpen} onOpenChange={setIsDeactivateOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/50 border-destructive/20">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Deactivate Account
            </DialogTitle>
            <DialogDescription>
              This action will submit a request to the school administration to suspend your portal access.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-foreground">
              Are you sure you want to proceed? You will lose access to all your classes, grades, and schedules once approved.
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeactivateOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeactivateRequest}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
