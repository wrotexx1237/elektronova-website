import { createContext, useContext, useState, useCallback } from "react";

const ADMIN_PASSWORD = "Endrit123$";

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
      if (prev) {
        try { localStorage.setItem("elektronova_admin", "false"); } catch {}
        return false;
      }
      const pw = window.prompt("Vendos fjalekalimin per Admin:");
      if (pw === ADMIN_PASSWORD) {
        try { localStorage.setItem("elektronova_admin", "true"); } catch {}
        return true;
      }
      if (pw !== null) {
        window.alert("Fjalekalimi nuk eshte i sakte!");
      }
      return false;
    });
  }, []);

  return { isAdmin, toggleAdmin };
}
