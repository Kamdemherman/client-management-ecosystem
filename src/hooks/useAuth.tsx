import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isCheckingRef = useRef<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Prevent multiple simultaneous auth checks
      if (isCheckingRef.current) {
        console.log('Auth check already in progress, skipping');
        return;
      }
      
      isCheckingRef.current = true;
      
      // Skip check on login page
      if (location.pathname === '/login') {
        setIsLoading(false);
        isCheckingRef.current = false;
        return;
      }

      // Check if token exists and is valid
      if (!authService.isAuthenticated()) {
        console.log('Not authenticated according to local check');
        setIsAuthenticated(false);
        setIsLoading(false);
        isCheckingRef.current = false;
        
        // Redirect to login if not already there
        if (location.pathname !== '/login') {
          navigate('/login');
        }
        return;
      }

      try {
        // Verify authentication with backend
        console.log('Checking authentication with backend');
        await authService.getCurrentUser();
        console.log('Authentication verified with backend');
        setIsAuthenticated(true);
      } catch (error: any) {
        console.error('Auth check failed:', error);
        
        // Only redirect on auth errors (401)
        if (error.response && error.response.status === 401) {
          console.log('Auth error 401, logging out');
          setIsAuthenticated(false);
          
          if (location.pathname !== '/login') {
            navigate('/login');
          }
        } else {
          // For network or server errors, keep current auth state
          console.log('Network/server error, keeping current auth state');
        }
      } finally {
        setIsLoading(false);
        isCheckingRef.current = false;
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      if (response.token) {
        setIsAuthenticated(true);
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
      }
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      navigate('/login');
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
      
      // Even with errors, log out on client side
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  return { isAuthenticated, isLoading, login, logout };
};
