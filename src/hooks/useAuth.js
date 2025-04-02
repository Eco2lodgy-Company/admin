import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const  useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const expiresAt = localStorage.getItem("tokenExpiresAt");
      
      if (!token || !expiresAt || Date.now() > parseInt(expiresAt)) {
        // Token invalide ou expiré, rediriger vers login
        router.push('/login');
      }
    };

    checkAuth();
    
    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkAuth, 30000);
    
    return () => clearInterval(interval);
  }, [router]);

  return {
    isAuthenticated: () => {
      const token = localStorage.getItem("token");
      const expiresAt = localStorage.getItem("tokenExpiresAt");
      return !!token && !!expiresAt && Date.now() < parseInt(expiresAt);
    }
  };
};
export default useAuth;