"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function SessionManager({ children }) {
  const router = useRouter();
  const [showExpirationAlert, setShowExpirationAlert] = useState(false);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const expiresAt = localStorage.getItem("tokenExpiresAt");
      if (expiresAt && Date.now() > parseInt(expiresAt)) {
        setShowExpirationAlert(true);
      }
    };

    // Vérification au chargement
    checkTokenExpiration();

    // Vérification périodique
    const interval = setInterval(checkTokenExpiration, 60000); // Vérifie toutes les minutes
    return () => clearInterval(interval);
  }, []);

  const handleReconnect = () => {
    setShowExpirationAlert(false);
    localStorage.clear(); // Nettoie tout le localStorage
    router.push('/');
  };

  return (
    <>
      {showExpirationAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-4"
        >
          <AlertCircle className="w-5 h-5" />
          <span>Votre session a expiré.</span>
          <button
            onClick={handleReconnect}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Se reconnecter
          </button>
        </motion.div>
      )}
      {children}
    </>
  );
}