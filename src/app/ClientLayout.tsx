"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SIDEBAR from "@/components/myComponents/sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/" || pathname === "/login";
  const [sidebarWidth, setSidebarWidth] = useState("w-64");

  // Observer pour détecter les changements de largeur de la sidebar
  useEffect(() => {
    if (isLoginPage) return;

    const sidebarElement = document.querySelector('[data-sidebar]');
    if (!sidebarElement) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setSidebarWidth(`w-[${entry.contentRect.width}px]`);
      }
    });

    observer.observe(sidebarElement);
    return () => observer.disconnect();
  }, [isLoginPage]);

  // Gestion de l'affichage mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (isLoginPage) {
    return (
      <div className="w-full">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div data-sidebar className="flex-shrink-0">
        <SIDEBAR />
      </div>

      {/* Contenu principal avec margin pour éviter que le contenu ne soit sous la sidebar */}
      <div className={`flex-1 ${isMobile ? 'w-full' : 'ml-20 md:ml-64'} transition-all duration-300 p-6 overflow-y-auto`}>
        {children}
      </div>
    </div>
  );
}