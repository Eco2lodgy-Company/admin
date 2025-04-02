"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Ajout de useRouter pour la redirection
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
  LifeBuoy,
  Tags,
  X,
  Percent,
  Home,
  ShoppingBag,
  BarChart2,
  Star,
  Tag,
  Shield,
  Database,
  TrendingUp,
  MessageSquare,
  UserCheck,
  Store,
  DollarSign,
  Heart,
  Activity,
  AlertTriangle,
  ChevronDown,
  Building,
  Image
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SIDEBAR = () => {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState('');
  const activeItemRef = useRef(null);
  const navRef = useRef(null);
  const router = useRouter(); // Initialisation du router

  useEffect(() => {
    const path = window.location.pathname;
    setActivePath(path);

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setExpanded(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    if (activeItemRef.current && navRef.current) {
      setTimeout(() => {
        const containerHeight = navRef.current.clientHeight;
        const itemPosition = activeItemRef.current.offsetTop;
        const itemHeight = activeItemRef.current.clientHeight;
        navRef.current.scrollTop = itemPosition - (containerHeight / 2) + (itemHeight / 2);
      }, 100);
    }
  }, [activePath, expanded, mobileMenuOpen]);

  // Fonction de déconnexion
  const handleLogout = () => {
    // Nettoyer le localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiresAt");
    localStorage.removeItem("username");
    localStorage.removeItem("logedUserId");
    // Ou utiliser localStorage.clear() pour tout supprimer

    // Fermer le menu mobile si ouvert
    setMobileMenuOpen(false);
    
    // Rediriger vers la page de login
    router.push('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Utilisateurs', href: '/users' },
    { icon: Truck, label: 'Livraisons', href: '/deliver' },
    { icon: Tags, label: 'Tarifs des Courses', href: '/tarif' },
    { icon: ShoppingCart, label: 'Boutiques', href: '/shops' },
    { icon: Package, label: 'Produits', href: '/products' },
    { icon: Tag, label: 'Categories', href: '/category' },
    { icon: Building, label: 'Partenaires', href: '/partenaire' },
    { icon: ShoppingBag, label: 'Commandes des Partenaires', href: '/commandes' },
    { icon: BarChart, label: 'Statistiques', href: '/analytics' },
    { icon: CreditCard, label: 'Paiements', href: '/payments' },
    { icon: Percent, label: 'Promotion', href: '/promotion' },
    { icon: Image, label: 'Publicite', href: '/pub' },
    { icon: Settings, label: 'Paramètres', href: '/settings' },
    { icon: LifeBuoy, label: 'Support', href: '/support' },
    { icon: HelpCircle, label: 'FAQ', href: '/faq' },
  ];

  const isActive = (href) => activePath === href;

  // Version mobile
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-md shadow-md"
        >
          <Menu size={24} />
        </button>

        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
            <div className="bg-slate-900 text-white w-64 h-full overflow-y-auto">
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

              <nav className="flex-1 pt-4" ref={navRef}>
                <ul className="space-y-2 px-2">
                  {menuItems.map((item, index) => {
                    const active = isActive(item.href);
                    return (
                      <li key={index} ref={active ? activeItemRef : null}>
                        <a
                          href={item.href}
                          className={cn(
                            "flex items-center p-3 rounded-md transition-colors",
                            active ? "bg-blue-600 text-white" : "hover:bg-slate-800 text-slate-200"
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <item.icon size={20} className={active ? "text-white" : "text-slate-300"} />
                          <span className="ml-3">{item.label}</span>
                          {item.count > 0 && (
                            <span className={cn(
                              "ml-auto text-xs font-medium px-2 py-1 rounded-full",
                              active ? "bg-white text-blue-600" : "bg-blue-600 text-white"
                            )}>
                              {item.count}
                            </span>
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="p-4 border-t border-slate-700 mt-auto">
                <button 
                  onClick={handleLogout}
                  className="flex items-center p-3 w-full rounded-md hover:bg-slate-800 transition-colors"
                >
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

  // Version desktop
  return (
    <div className={cn(
      "h-screen flex flex-col bg-slate-900 text-white transition-all duration-300 fixed left-0 top-0 bottom-0",
      expanded ? "w-64" : "w-20"
    )}>
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

      <nav className="flex-1 pt-4 overflow-y-auto" ref={navRef}>
        <ul className="space-y-2 px-2">
          {menuItems.map((item, index) => {
            const active = isActive(item.href);
            return (
              <li key={index} ref={active ? activeItemRef : null} className="relative">
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center p-3 rounded-md transition-colors",
                    active ? "bg-blue-600 text-white" : "hover:bg-slate-800"
                  )}
                >
                  <item.icon size={20} className={active ? "text-white" : "text-slate-300"} />
                  {expanded && (
                    <div className="flex justify-between items-center w-full ml-3">
                      <span className={active ? "text-white" : "text-slate-200"}>{item.label}</span>
                      {item.count > 0 && (
                        <span className={cn(
                          "text-xs font-medium px-2 py-1 rounded-full",
                          active ? "bg-white text-blue-600" : "bg-blue-600 text-white"
                        )}>
                          {item.count}
                        </span>
                      )}
                    </div>
                  )}
                  {!expanded && item.count > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-blue-600 text-white text-xs font-medium px-1.5 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700 mt-auto">
        <button 
          onClick={handleLogout}
          className="mt-4 flex items-center p-3 w-full rounded-md hover:bg-slate-800 transition-colors"
        >
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