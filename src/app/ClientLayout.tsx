"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import SIDEBAR from "@/components/myComponents/sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/" || pathname === "/login";

  return (
    <div className={isLoginPage ? "" : "flex min-h-screen"}>
      {!isLoginPage && <SIDEBAR />}
      <div className={isLoginPage ? "w-full" : "flex-1 p-6 overflow-y-auto"}>
        {children}
      </div>
    </div>
  );
}