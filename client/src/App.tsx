import React from "react";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { AuthContext, useAuthState, useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import Dashboard from "@/pages/dashboard";
import CreateJob from "@/pages/create-job";
import EditJob from "@/pages/edit-job";
import AdminPage from "@/pages/admin";
import Login from "@/pages/login";

import ClientsPage from "@/pages/clients";
import WorkersPage from "@/pages/workers";
import InventoryPage from "@/pages/inventory";
import AnalyticsPage from "@/pages/analytics";
import ProfilePage from "@/pages/profile";
import CalendarPage from "@/pages/calendar";
import ExpensesPage from "@/pages/expenses";
import SuppliersPage from "@/pages/suppliers";
import NotFound from "@/pages/not-found";
import PublicRatePage from "@/pages/public-rate";
import GuidePage from "@/pages/guide";
import NotificationsPage from "@/pages/notifications";

import WorkerPortal from "@/pages/worker-portal";

function ProtectedRoute({ component: Component }: { component: React.ComponentType<any> }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4 text-center">
          <div>
            <h1 className="text-2xl font-bold mb-4">Pati një gabim në ngarkim</h1>
            <pre className="p-4 bg-slate-900 rounded text-left text-xs overflow-auto max-w-full">
              {this.state.error?.message}
            </pre>
            <Button className="mt-4" onClick={() => window.location.reload()}>Rifresko faqen</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/rate/:token" component={PublicRatePage} />
      <Route path="/portal/:token" component={WorkerPortal} />
      <Route path="/">{() => <ProtectedRoute component={Dashboard} />}</Route>
      <Route path="/new">{() => <ProtectedRoute component={CreateJob} />}</Route>
      <Route path="/edit/:id">{() => <ProtectedRoute component={EditJob} />}</Route>
      <Route path="/admin">{() => <ProtectedRoute component={AdminPage} />}</Route>
      <Route path="/clients">{() => <ProtectedRoute component={ClientsPage} />}</Route>
      <Route path="/workers">{() => <ProtectedRoute component={WorkersPage} />}</Route>
      <Route path="/inventory">{() => <ProtectedRoute component={InventoryPage} />}</Route>
      <Route path="/analytics">{() => <ProtectedRoute component={AnalyticsPage} />}</Route>
      <Route path="/calendar">{() => <ProtectedRoute component={CalendarPage} />}</Route>
      <Route path="/expenses">{() => <ProtectedRoute component={ExpensesPage} />}</Route>
      <Route path="/suppliers">{() => <ProtectedRoute component={SuppliersPage} />}</Route>
      <Route path="/profile">{() => <ProtectedRoute component={ProfilePage} />}</Route>
      <Route path="/guide">{() => <ProtectedRoute component={GuidePage} />}</Route>
      <Route path="/notifications">{() => <ProtectedRoute component={NotificationsPage} />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const authState = useAuthState();
  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <ErrorBoundary>
            <Router />
          </ErrorBoundary>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
