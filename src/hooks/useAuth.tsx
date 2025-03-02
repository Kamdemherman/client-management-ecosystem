
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
  const initialCheckDoneRef = useRef<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Auth check triggered on path:', location.pathname);
      
      // Prevent multiple simultaneous auth checks
      if (isCheckingRef.current) {
        console.log('Auth check already in progress, skipping');
        return;
      }
      
      isCheckingRef.current = true;
      
      // Skip check on login page
      if (location.pathname === '/login') {
        console.log('On login page, skipping auth check');
        setIsLoading(false);
        isCheckingRef.current = false;
        initialCheckDoneRef.current = true;
        return;
      }

      // Check if token exists and is valid
      const localAuthStatus = authService.isAuthenticated();
      console.log('Local auth check result:', localAuthStatus);
      
      if (!localAuthStatus) {
        console.log('Not authenticated according to local check');
        setIsAuthenticated(false);
        setIsLoading(false);
        isCheckingRef.current = false;
        initialCheckDoneRef.current = true;
        
        // Redirect to login if not already there
        if (location.pathname !== '/login') {
          console.log('Redirecting to login page');
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
        
        // Only redirect on auth errors (401) or token missing/expired
        if (
          (error.response && error.response.status === 401) || 
          error.message === 'No token found' || 
          error.message === 'Token expired'
        ) {
          console.log('Auth error, logging out');
          setIsAuthenticated(false);
          
          if (location.pathname !== '/login') {
            navigate('/login');
          }
        } else {
          // For network or server errors, keep current auth state
          console.log('Network/server error, keeping current auth state:', isAuthenticated);
        }
      } finally {
        setIsLoading(false);
        isCheckingRef.current = false;
        initialCheckDoneRef.current = true;
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Login attempt initiated');
      const response = await authService.login(email, password);
      console.log('Login API response received');
      
      // Check both token formats
      const token = response.token || response.access_token;
      
      if (token) {
        console.log('Setting authenticated state to true');
        setIsAuthenticated(true);
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
        return response;
      } else {
        console.error('No token in response:', response);
        toast({
          title: "Erreur de connexion", 
          description: "Réponse du serveur invalide",
          variant: "destructive",
        });
        throw new Error('No token in response');
      }
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
