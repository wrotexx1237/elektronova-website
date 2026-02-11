import { useAuth } from "./use-auth";

export function useAdmin() {
  const { isAdmin } = useAuth();
  return { isAdmin };
}
