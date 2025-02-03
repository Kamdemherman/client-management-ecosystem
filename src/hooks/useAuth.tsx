import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useToast } from '@/components/ui/use-toast';

export const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!localStorage.getItem('token')) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        await authService.getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      await authService.login(email, password);
      setIsAuthenticated(true);
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
      navigate('/');
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
      console.error('Logout failed:', error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  return { isAuthenticated, isLoading, login, logout };
};