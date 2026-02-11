import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthContext, useAuthState, useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import Dashboard from "@/pages/dashboard";
import CreateJob from "@/pages/create-job";
import EditJob from "@/pages/edit-job";
import AdminPage from "@/pages/admin";
import Login from "@/pages/login";

import ClientsPage from "@/pages/clients";
import InventoryPage from "@/pages/inventory";
import AnalyticsPage from "@/pages/analytics";
import NotFound from "@/pages/not-found";

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

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">{() => <ProtectedRoute component={Dashboard} />}</Route>
      <Route path="/new">{() => <ProtectedRoute component={CreateJob} />}</Route>
      <Route path="/edit/:id">{() => <ProtectedRoute component={EditJob} />}</Route>
      <Route path="/admin">{() => <ProtectedRoute component={AdminPage} />}</Route>
      <Route path="/clients">{() => <ProtectedRoute component={ClientsPage} />}</Route>
      <Route path="/inventory">{() => <ProtectedRoute component={InventoryPage} />}</Route>
      <Route path="/analytics">{() => <ProtectedRoute component={AnalyticsPage} />}</Route>
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
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
