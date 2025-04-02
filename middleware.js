import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode'; // Installez cette dépendance : npm install jwt-decode

// Liste des routes publiques (accessibles sans authentification)
const publicPaths = ['/'];

// Routes réservées aux admins uniquement
const adminPaths = ['/dashboard', '/users', '/settings']; // Ajoutez ici toutes les routes admin

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Récupérer le token depuis les cookies
  const token = request.cookies.get('token')?.value;

  // Vérifier si la route est publique
  const isPublicPath = publicPaths.includes(path);

  // Si pas de token et que la route n'est pas publique, rediriger vers 
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Si token présent et tentative d'accès à une page publique, rediriger vers dashboard
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Si token présent, vérifier sa validité et le rôle
  if (token) {
    try {
      // Décoder le token JWT pour obtenir les informations (exp, role, etc.)
      const decodedToken = jwtDecode(token);
      const isTokenExpired = decodedToken.exp * 1000 < Date.now(); // exp est en secondes

      // Si le token est expiré, rediriger vers 
      if (isTokenExpired) {
        const response = NextResponse.redirect(new URL('/', request.url));
        response.cookies.delete('token'); // Supprimer le cookie invalide
        return response;
      }

      // Vérifier le rôle pour les routes admin
      const userRole = decodedToken.role; // Assurez-vous que votre token contient un champ "role"
      const isAdminRoute = adminPaths.includes(path);

      if (isAdminRoute && userRole !== 'Administrateur') {
        // Si l'utilisateur n'est pas admin et tente d'accéder à une route admin, rediriger
        return NextResponse.redirect(new URL('/', request.url));
      }

    } catch (error) {
      // Si le token est invalide ou mal formé, rediriger vers 
      console.error('Erreur de décodage du token:', error);
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // Si tout est OK, continuer vers la page demandée
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/',
    '/dashboard',
    '/users',
    '/settings',
    '/profile',
    // Ajoutez toutes les routes que vous voulez protéger
  ],
};