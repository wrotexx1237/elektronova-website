import { createContext, useContext, useState, useCallback } from "react";

interface AdminContextValue {
  isAdmin: boolean;
  toggleAdmin: () => void;
}

export const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
  toggleAdmin: () => {},
});

export function useAdmin() {
  return useContext(AdminContext);
}

export function useAdminState(): AdminContextValue {
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem("elektronova_admin") === "true";
    } catch {
      return false;
    }
  });

  const toggleAdmin = useCallback(() => {
    setIsAdmin(prev => {
      const next = !prev;
      try { localStorage.setItem("elektronova_admin", String(next)); } catch {}
      return next;
    });
  }, []);

  return { isAdmin, toggleAdmin };
}
