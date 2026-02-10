import { Link, useLocation } from "wouter";
import { Zap, LayoutDashboard, PlusCircle, Menu, X, Package, Shield, ShieldOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/hooks/use-admin";
import { Badge } from "@/components/ui/badge";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdmin, toggleAdmin } = useAdmin();

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Procesverbal i Ri", href: "/new", icon: PlusCircle },
    { label: "Katalogu", href: "/admin", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Elektronova</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                  location === item.href ? "text-primary font-bold" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleAdmin}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border",
                isAdmin
                  ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                  : "bg-muted/50 text-muted-foreground border-transparent hover:border-border"
              )}
              data-testid="button-admin-toggle"
            >
              {isAdmin ? <Shield className="h-3.5 w-3.5" /> : <ShieldOff className="h-3.5 w-3.5" />}
              {isAdmin ? "Admin" : "User"}
            </button>

            <button 
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background p-4 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-5">
            {navItems.map((item) => (
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
            ))}
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
    </div>
  );
}
