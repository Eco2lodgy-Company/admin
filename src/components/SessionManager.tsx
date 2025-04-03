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
  const [isChecking, setIsChecking] = useState(true); // État pour la vérification initiale

  useEffect(() => {
    const isLoginPage = pathname === "/" ;

    // Si c'est la page de connexion, pas de vérification
    if (isLoginPage) {
      setIsChecking(false);
      return;
    }

    // Vérification de l'authentification côté client
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (!username || !token) {
      router.push("/");
      toast.error("Veuillez vous connecter.");
      setIsChecking(false);
      return;
    }

    const decoded = jwt.decode(token) as { exp?: number } | null;
    if (decoded?.exp && Date.now() >= decoded.exp * 1000) {
      router.push("/");
      toast.error("Session expirée, veuillez vous reconnecter.");
      setIsChecking(false);
      return;
    }

    // Si tout est valide, terminer la vérification
    setIsChecking(false);
  }, [router, pathname]);

  // Afficher le loader pendant la vérification initiale
  if (isChecking) {
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

  // Une fois la vérification terminée, rendre les enfants (ou rediriger si non autorisé)
  return <>{children}</>;
}