
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Éviter les vérifications multiples simultanées
      if (isCheckingAuth) return;
      setIsCheckingAuth(true);
      
      // Si l'utilisateur est déjà sur la page de connexion, pas besoin de vérification
      if (location.pathname === '/login') {
        setIsLoading(false);
        setIsCheckingAuth(false);
        return;
      }

      if (!authService.isAuthenticated()) {
        setIsAuthenticated(false);
        setIsLoading(false);
        setIsCheckingAuth(false);
        
        // Rediriger vers la page de connexion uniquement si l'utilisateur n'y est pas déjà
        if (location.pathname !== '/login') {
          navigate('/login');
        }
        return;
      }

      try {
        // Vérifier si l'utilisateur est toujours authentifié avec le backend
        await authService.getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        
        // Ne déconnecter que si l'erreur est liée à l'authentification (401)
        if (error.response && error.response.status === 401) {
          setIsAuthenticated(false);
          
          // Rediriger uniquement si l'utilisateur n'est pas déjà sur la page de connexion
          if (location.pathname !== '/login') {
            navigate('/login');
          }
        } else {
          // En cas d'erreur réseau temporaire, on garde l'utilisateur connecté
          console.warn('Erreur temporaire, l\'utilisateur reste connecté');
        }
      } finally {
        setIsLoading(false);
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname, isCheckingAuth]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      if (response.token) {
        setIsAuthenticated(true);
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
        
        // Rediriger vers la page d'accueil après connexion réussie
        navigate('/');
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
      
      // Même en cas d'erreur, on déconnecte l'utilisateur côté client
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  return { isAuthenticated, isLoading, login, logout };
};
