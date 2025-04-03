// middleware.js
import { NextResponse } from 'next/server'
import { parse } from 'cookie'

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const cookies = parse(request.headers.get('cookie') || '')
  const token = cookies.token

  // Routes protégées
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      // Vérifiez la validité du token avec votre API
      const response = await fetch('http://195.35.24.128:8081/api/validate-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Token invalide')
      }

      // Vous pouvez aussi vérifier le rôle ici si nécessaire
      const userData = await response.json()
      if (pathname.startsWith('/admin') && userData.role !== 'Administrateur') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

    } catch (error) {
      // Si le token est invalide, redirigez vers la page de login
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Si l'utilisateur est déjà connecté et essaie d'accéder à la page de login
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}