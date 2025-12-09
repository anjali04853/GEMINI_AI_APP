import { useAuthStore } from '../store/authStore';
import { User } from '../types';

export const useAuth = () => {
  const { user, token, isLoading, login, logout } = useAuthStore();

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin';

  const handleLogin = (userData: User, authToken: string) => {
    login(userData, authToken);
  };

  const handleLogout = () => {
    logout();
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    login: handleLogin,
    logout: handleLogout,
  };
};