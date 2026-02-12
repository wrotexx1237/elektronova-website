import { Link, useLocation } from "wouter";
import { Zap, LayoutDashboard, PlusCircle, Menu, X, Package, Users, Warehouse, BarChart3, Bell, LogOut, User, Sun, Moon, Settings, CalendarDays, Truck, Receipt, Camera, ShieldAlert, Phone as PhoneIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Notification, JobCategory } from "@shared/schema";

const NAV_CATEGORY_CARDS: { key: JobCategory; label: string; icon: typeof Zap; color: string }[] = [
  { key: "electric", label: "Rrymë / Elektrike", icon: Zap, color: "text-blue-500" },
  { key: "camera", label: "Kamera", icon: Camera, color: "text-emerald-500" },
  { key: "alarm", label: "Alarm", icon: ShieldAlert, color: "text-red-500" },
  { key: "intercom", label: "Interfon", icon: PhoneIcon, color: "text-purple-500" },
];

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <Button size="icon" variant="ghost" onClick={() => setDark(!dark)} data-testid="button-theme-toggle" title={dark ? "Modalitet i ndritshëm" : "Modalitet i errët"}>
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const { user, isAdmin } = useAuth();

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Procesverbal i Ri", href: "/new", icon: PlusCircle },
    { label: "Klientët", href: "/clients", icon: Users },
    { label: "Stoku", href: "/inventory", icon: Warehouse },
    { label: "Kalendari", href: "/calendar", icon: CalendarDays },
    { label: "Shpenzimet", href: "/expenses", icon: Receipt },
    { label: "Furnitorët", href: "/suppliers", icon: Truck },
    { label: "Katalogu", href: "/admin", icon: Package },
    ...(isAdmin ? [{ label: "Analiza", href: "/analytics", icon: BarChart3 }] : []),
  ];

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout"),
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.clear();
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:inline">Elektronova</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-4">
            {navItems.map((item) => (
              item.href === "/new" ? (
                <button
                  key={item.href}
                  onClick={() => setShowCategoryPicker(true)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5 cursor-pointer",
                    location.startsWith("/new") ? "text-primary font-bold" : "text-muted-foreground"
                  )}
                  data-testid="nav-new-job"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5",
                    location === item.href ? "text-primary font-bold" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationBell />

            {isAdmin && (
              <Badge variant="outline" className="border-amber-500/30 text-amber-600 hidden sm:inline-flex">
                Admin
              </Badge>
            )}

            <Link href="/profile" className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-profile">
              <User className="h-3.5 w-3.5" />
              <span>{user?.fullName || user?.username}</span>
            </Link>

            <Button size="icon" variant="ghost" onClick={() => logoutMutation.mutate()}
              data-testid="button-logout" title="Dil">
              <LogOut className="h-4 w-4" />
            </Button>

            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-background p-4 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-5">
            {navItems.map((item) => (
              item.href === "/new" ? (
                <button
                  key={item.href}
                  onClick={() => { setMobileMenuOpen(false); setShowCategoryPicker(true); }}
                  className={cn(
                    "text-base font-medium transition-colors flex items-center gap-3 p-2 rounded-md hover:bg-muted text-left",
                    location.startsWith("/new") ? "text-primary bg-primary/5" : "text-muted-foreground"
                  )}
                  data-testid="nav-new-job-mobile"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-base font-medium transition-colors flex items-center gap-3 p-2 rounded-md hover:bg-muted",
                    location === item.href ? "text-primary bg-primary/5" : "text-muted-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            ))}
            <div className="border-t pt-3 flex flex-col gap-2">
              <Link
                href="/profile"
                className="text-base font-medium transition-colors flex items-center gap-3 p-2 rounded-md hover:bg-muted text-muted-foreground"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-profile-mobile"
              >
                <Settings className="h-5 w-5" />
                Profili Im
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{user?.fullName}</span>
                <Button variant="ghost" size="sm" onClick={() => logoutMutation.mutate()}>
                  <LogOut className="h-4 w-4 mr-1" /> Dil
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t py-6 bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Elektronova. Të gjitha të drejtat e rezervuara.</p>
        </div>
      </footer>

      <Dialog open={showCategoryPicker} onOpenChange={setShowCategoryPicker}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Zgjidhni Kategorinë</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 pt-2">
            {NAV_CATEGORY_CARDS.map(cat => (
              <Link key={cat.key} href={`/new?category=${cat.key}`}>
                <Card className="hover-elevate cursor-pointer group" data-testid={`nav-category-${cat.key}`} onClick={() => setShowCategoryPicker(false)}>
                  <CardContent className="flex flex-col items-center justify-center py-5 gap-2">
                    <div className={`p-3 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors ${cat.color}`}>
                      <cat.icon className="h-7 w-7" />
                    </div>
                    <span className="text-sm font-bold text-center">{cat.label}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NotificationBell() {
  const [open, setOpen] = useState(false);

  const { data: countData } = useQuery<{ count: number }>({
    queryKey: ["/api/notifications/unread-count"],
    refetchInterval: 60000,
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    enabled: open,
  });

  const checkStaleMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/notifications/check-stale"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => apiRequest("PUT", `/api/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => apiRequest("PUT", "/api/notifications/read-all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  const unreadCount = countData?.count || 0;

  const typeLabels: Record<string, string> = {
    stale_offer: "Ofertë e vjetër",
    upcoming_work: "Punë e afërt",
    low_stock: "Stok i ulët",
    price_change: "Ndryshim çmimi",
    job_completed: "Punë e përfunduar",
    warranty_expiring: "Garanci në skadim",
  };

  const typeColors: Record<string, string> = {
    stale_offer: "text-amber-500",
    upcoming_work: "text-blue-500",
    low_stock: "text-red-500",
    price_change: "text-purple-500",
    job_completed: "text-green-500",
    warranty_expiring: "text-orange-500",
  };

  return (
    <Popover open={open} onOpenChange={(o) => {
      setOpen(o);
      if (o) checkStaleMutation.mutate();
    }}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="relative" data-testid="button-notifications">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center"
              data-testid="text-unread-count">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 z-[100]" align="end" sideOffset={8}>
        <div className="flex items-center justify-between gap-2 p-3 border-b bg-popover rounded-t-md">
          <h3 className="font-semibold text-sm">Njoftimet</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={() => markAllReadMutation.mutate()}
              data-testid="button-mark-all-read">
              Lexo të gjitha
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto bg-popover rounded-b-md">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Asnjë njoftim</p>
          ) : (
            notifications.slice(0, 20).map(notif => (
              <div
                key={notif.id}
                className={cn(
                  "p-3 border-b last:border-0 cursor-pointer transition-colors",
                  notif.isRead === 0 ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-muted/50"
                )}
                onClick={() => notif.isRead === 0 && markReadMutation.mutate(notif.id)}
                data-testid={`notification-${notif.id}`}
              >
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="text-xs no-default-active-elevate">
                    <span className={cn(typeColors[notif.type] || "")}>
                      {typeLabels[notif.type] || notif.type}
                    </span>
                  </Badge>
                </div>
                <p className="text-sm mt-1.5 text-foreground">{notif.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {notif.createdAt ? new Date(notif.createdAt).toLocaleString('sq') : ''}
                </p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
