"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  UserCircle,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  Percent
} from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4
    }
  }
};

export default function CommissionsManagement() {
  const [commissions, setCommissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [shops, setShops] = useState([]);

  const [formData, setFormData] = useState({
    partSociete: "",
    partBoutique: "",
    partPlateformePaiement: "",
    commentaire: "",
    shopId: "",
    adminId: ""
  });

  const fetchShops = async () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/shop/liste?username=${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setShops(data.data || []);
    } catch (err) {
      console.error("Error fetching shops:", err.message);
      toast.error("Erreur lors de la récupération des boutiques");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommissions = async () => {
    try {
      setIsLoading(true);
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('token');
      const response = await fetch(`http://195.35.24.128:8081/api/commissions/liste?username=${username}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la récupération des commissions");
      }
      
      setCommissions(result.data || []);
      toast.success(result.message || "Commissions récupérées avec succès");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const id = localStorage.getItem('logedUserId');
      const token = localStorage.getItem('token');
      const formDataToSend = {
        ...formData,
        adminId: id,
        shopId: parseInt(formData.shopId) // Assurez-vous que shopId est un nombre
      };
      
      const response = await fetch('http://195.35.24.128:8081/api/commissions/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formDataToSend)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de l'ajout");
      }

      setShowAddModal(false);
      resetForm();
      fetchCommissions();
      toast.success(result.message || "Commission ajoutée avec succès");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const id = localStorage.getItem('logedUserId');
      const token = localStorage.getItem('token');
      const formDataToUpdate = {
        ...formData,
        adminId: id,
        id: selectedCommission.id,
        shopId: parseInt(formData.shopId) // Assurez-vous que shopId est un nombre
      };

      const response = await fetch(`http://195.35.24.128:8081/api/commissions/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formDataToUpdate)
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la modification");
      }

      setShowEditModal(false);
      resetForm();
      fetchCommissions();
      toast.success(result.message || "Commission modifiée avec succès");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cette commission ?")) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://195.35.24.128:8081/api/commissions/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la suppression");
      }

      fetchCommissions();
      toast.success(result.message || "Commission supprimée avec succès");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      partSociete: "",
      partBoutique: "",
      partPlateformePaiement: "",
      commentaire: "",
      shopId: "",
      adminId: ""
    });
  };
const selectedShop = (name) => {
    const shop = shops.find(shop => shop.nom === name);
    return shop ? shop.id : null;
};

const selectedShopName = (ids) => {
    const shop = shops.find(shop => shop.id === parseInt(ids));
    console.log("converting id to name", ids ,"to", shop.nom);
    return shop ? shop.nom : null;
};
  const openEditModal = (commission) => {
    setSelectedCommission(commission);
    setFormData({
      partSociete: commission.partSociete,
      partBoutique: commission.partBoutique,
      partPlateformePaiement: commission.partPlateformePaiement,
      commentaire: commission.commentaire,
      shopId: selectedShop(commission.shopNom )|| "",
      adminId: commission.adminId || ""
    });
    setShowEditModal(true);
  };

  useEffect(() => {
    fetchShops();
    fetchCommissions();
  }, []);

  return (
    <div className="min-h-screen  p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Percent className="w-8 h-8 text-green-800 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">Gestion des Commissions</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-green-800 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter
          </motion.button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div variants={containerVariants} className="bg-white rounded-xl shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Société</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Boutique</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plateforme</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Boutique</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {commissions.map((commission) => (
                  <motion.tr key={commission.id} variants={itemVariants}>
                    <td className="px-6 py-4">{commission.partSociete}%</td>
                    <td className="px-6 py-4">{commission.partBoutique}%</td>
                    <td className="px-6 py-4">{commission.partPlateformePaiement}%</td>
                    <td className="px-6 py-4">{commission.shopNom}</td>
                    <td className="px-6 py-4">{commission.adminNom}</td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button 
                        onClick={() => openEditModal(commission)}
                        className="text-green-800 hover:text-green-900"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(commission.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </motion.div>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Ajouter une commission</h2>
            <form onSubmit={handleAdd}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Part Société (%)</label>
                  <input
                    type="number"
                    value={formData.partSociete}
                    onChange={(e) => setFormData({...formData, partSociete: e.target.value})}
                    className="mt-1 w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Part Boutique (%)</label>
                  <input
                    type="number"
                    value={formData.partBoutique}
                    onChange={(e) => setFormData({...formData, partBoutique: e.target.value})}
                    className="mt-1 w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Part Plateforme (%)</label>
                  <input
                    type="number"
                    value={formData.partPlateformePaiement}
                    onChange={(e) => setFormData({...formData, partPlateformePaiement: e.target.value})}
                    className="mt-1 w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Boutique</label>
                  <Select
                    value={formData.shopId}
                    onValueChange={(value) => setFormData({...formData, shopId: value})}
                    required
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Sélectionner une boutique" />
                    </SelectTrigger>
                    <SelectContent>
                      {shops.length > 0 ? (
                        shops.map((shop) => (
                          <SelectItem key={shop.id} value={shop.id.toString()}>
                            {shop.nom}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="0" disabled>
                          Aucune boutique disponible
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Commentaire</label>
                <textarea
                  value={formData.commentaire}
                  onChange={(e) => setFormData({...formData, commentaire: e.target.value})}
                  className="mt-1 w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {setShowAddModal(false); resetForm();}}
                  className="px-4 py-2 text-gray-600"
                >
                  Annuler
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-green-800 text-white px-4 py-2 rounded-lg"
                >
                  Ajouter
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal d'édition */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Modifier la commission de {selectedShopName(formData.shopId)}</h2>
            <form onSubmit={handleEdit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Part Société (%)</label>
                  <input
                    type="number"
                    value={formData.partSociete}
                    onChange={(e) => setFormData({...formData, partSociete: e.target.value})}
                    className="mt-1 w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Part Boutique (%)</label>
                  <input
                    type="number"
                    value={formData.partBoutique}
                    onChange={(e) => setFormData({...formData, partBoutique: e.target.value})}
                    className="mt-1 w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Part Plateforme (%)</label>
                  <input
                    type="number"
                    value={formData.partPlateformePaiement}
                    onChange={(e) => setFormData({...formData, partPlateformePaiement: e.target.value})}
                    className="mt-1 w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                {/* <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Boutique</label>
                  <Select
                    value={formData.shopId}
                    onValueChange={(value) => setFormData({...formData, shopId: value})}
                    required
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Sélectionner une boutique" />
                    </SelectTrigger>
                    <SelectContent>
                      {shops.length > 0 ? (
                        shops.map((shop) => (
                          <SelectItem key={shop.id} value={shop.id}>
                            {shop.nom}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="0" disabled>
                          Aucune boutique disponible
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Commentaire</label>
                <textarea
                  value={formData.commentaire}
                  onChange={(e) => setFormData({...formData, commentaire: e.target.value})}
                  className="mt-1 w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {setShowEditModal(false); resetForm();}}
                  className="px-4 py-2 text-gray-600"
                >
                  Annuler
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-green-800 text-white px-4 py-2 rounded-lg"
                >
                  Sauvegarder
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}