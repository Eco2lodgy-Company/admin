// components/SessionManager.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import jwt from "jsonwebtoken";
import { toast } from "sonner";
import { ReactNode, useState, useEffect } from "react";
import Image from "next/image";

interface SessionManagerProps {
  children: ReactNode;
}

export default function SessionManager({ children }: SessionManagerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false); // État pour vérifier le montage côté client
  const [isAuthorized, setIsAuthorized] = useState(false); // État pour l'autorisation

  // Marquer le composant comme monté côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Vérification de l'authentification une fois monté
  useEffect(() => {
    if (!isMounted) return; // Ne rien faire si pas encore monté

    const isLoginPage = pathname === "/" || pathname === "/login";

    // Si c'est la page de connexion, autoriser directement
    if (isLoginPage) {
      setIsAuthorized(true);
      return;
    }

    // Vérification côté client
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (!username || !token) {
      router.push("/");
      toast.error("Veuillez vous connecter.");
      return;
    }

    const decoded = jwt.decode(token) as { exp?: number } | null;
    if (decoded?.exp && Date.now() >= decoded.exp * 1000) {
      router.push("/");
      toast.error("Session expirée, veuillez vous reconnecter.");
      return;
    }

    // Si tout est valide, autoriser le rendu
    setIsAuthorized(true);
  }, [isMounted, pathname, router]);

  // Pendant le rendu initial ou si pas encore monté, afficher un loader
  if (!isMounted || (!isAuthorized && !pathname.match(/^\/(login)?$/))) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
        <div className="text-center">
          <Image
            src="/shield.png" // Assurez-vous que cette image existe dans public/
            alt="Vérification en cours"
            width={100}
            height={100}
            className="animate-pulse mx-auto"
          />
          <p className="mt-4 text-gray-600">Vérification de l'autorisation...</p>
        </div>
      </div>
    );
  }

  // Si autorisé ou sur la page de connexion, rendre les enfants
  return <>{children}</>;
}