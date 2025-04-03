// app/ClientLayout.tsx
"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SIDEBAR from "@/components/myComponents/sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/" || pathname === "/login";
  const [isMobile, setIsMobile] = useState(false);

  // Détecte si l'écran est en mode mobile
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  if (isLoginPage) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <SIDEBAR />
      </div>

      {/* Contenu principal */}
      <div
        className={`flex-1 ${
          isMobile ? "w-full" : "ml-20 md:ml-64"
        } transition-all duration-300 p-6 overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  );
}