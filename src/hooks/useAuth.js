import { useAuthStore } from "../features/auth/authStore";

export default function useAuth() {
  const { user, token, setUser, logout } = useAuthStore();
  const isAuthenticated = !!token;
  return { user, token, setUser, logout, isAuthenticated };
}