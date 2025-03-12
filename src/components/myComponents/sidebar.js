"use client";
import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Truck,
  ShoppingCart,
  Package,
  BarChart,
  CreditCard,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Percent
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SIDEBAR = () => {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Vérifier si l'écran est mobile au chargement
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px est généralement considéré comme le breakpoint pour les mobiles
      
      // Sur mobile, fermez la sidebar par défaut
      if (window.innerWidth < 768) {
        setExpanded(false);
      }
    };

    // Vérifier à l'initialisation
    checkIfMobile();

    // Ajouter un écouteur pour vérifier lors du redimensionnement
    window.addEventListener('resize', checkIfMobile);

    // Nettoyer l'écouteur lors du démontage du composant
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Utilisateurs', href: '/users' },
    { icon: Truck, label: 'Livraisons', href: '/deliver' },
    { icon: ShoppingCart, label: 'Boutiques', href: '/shops' },
    // { icon: Package, label: 'Produits', href: '/products' },
    { icon: BarChart, label: 'Statistiques', href: '/analytics' },
    { icon: CreditCard, label: 'Paiements', href: '/payments' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: Percent , label: 'Promotion', href: '/promotion' },
    { icon: Settings, label: 'Paramètres', href: '/settings' },
    { icon: HelpCircle, label: 'Support', href: '/support' },
  ];

  // Version mobile: bouton hamburger et menu modal
  if (isMobile) {
    return (
      <>
        {/* Bouton hamburger en haut de l'écran */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-md shadow-md"
        >
          <Menu size={24} />
        </button>

        {/* Menu mobile (modal) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
            <div className="bg-slate-900 text-white w-64 h-full overflow-y-auto">
              {/* En-tête avec logo et bouton de fermeture */}
              <div className="flex items-center p-4 border-b border-slate-700">
                <div className="bg-blue-600 h-10 w-10 rounded-md flex items-center justify-center text-white font-bold text-xl">
                  DR
                </div>
                <h1 className="ml-3 font-bold text-xl">drive.re</h1>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="ml-auto p-2 rounded-md hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Menu principal */}
              <nav className="flex-1 pt-4">
                <ul className="space-y-2 px-2">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="flex items-center p-3 rounded-md hover:bg-slate-800 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon size={20} className="text-slate-300" />
                        <span className="ml-3 text-slate-200">{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Bouton de déconnexion */}
              <div className="p-4 border-t border-slate-700 mt-auto">
                <button className="flex items-center p-3 w-full rounded-md hover:bg-slate-800 transition-colors">
                  <LogOut size={20} className="text-slate-300" />
                  <span className="ml-3 text-slate-200">Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Version desktop: sidebar fixe
  return (
    <div className={cn(
      "h-screen flex flex-col bg-slate-900 text-white transition-all duration-300 fixed left-0 top-0 bottom-0",
      expanded ? "w-64" : "w-20"
    )}>
      {/* Logo et titre */}
      <div className="flex items-center p-4 border-b border-slate-700">
        <div className="bg-blue-600 h-10 w-10 rounded-md flex items-center justify-center text-white font-bold text-xl">
          DR
        </div>
        {expanded && (
          <h1 className="ml-3 font-bold text-xl">drive.re</h1>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-auto p-2 rounded-md hover:bg-slate-800"
        >
          {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Menu principal avec scrolling */}
      <nav className="flex-1 pt-4 overflow-y-auto">
        <ul className="space-y-2 px-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className="flex items-center p-3 rounded-md hover:bg-slate-800 transition-colors"
              >
                <item.icon size={20} className="text-slate-300" />
                {expanded && (
                  <span className="ml-3 text-slate-200">{item.label}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Profil admin */}
      <div className="p-4 border-t border-slate-700 mt-auto">
        <button className="mt-4 flex items-center p-3 w-full rounded-md hover:bg-slate-800 transition-colors">
          <LogOut size={20} className="text-slate-300" />
          {expanded && (
            <span className="ml-3 text-slate-200">Déconnexion</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default SIDEBAR;