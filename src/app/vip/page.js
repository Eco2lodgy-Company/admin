"use client";
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Diamond,
  Edit,
  Save,
  X,
  Percent,
  Star,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

// Données fictives pour les tarifs VIP
const initialVIPTiers = [
  {
    id: 1,
    name: "Silver",
    discountPercent: 5,
    freeDeliveryThreshold: 30,
    monthlyFee: 0,
    pointsMultiplier: 1.2,
    exclusiveDeals: false,
    prioritySupport: false,
    active: true
  },
  {
    id: 2,
    name: "Gold",
    discountPercent: 10,
    freeDeliveryThreshold: 20,
    monthlyFee: 9.99,
    pointsMultiplier: 1.5,
    exclusiveDeals: true,
    prioritySupport: false,
    active: true
  },
  {
    id: 3,
    name: "Platinum",
    discountPercent: 15,
    freeDeliveryThreshold: 0,
    monthlyFee: 19.99,
    pointsMultiplier: 2.0,
    exclusiveDeals: true,
    prioritySupport: true,
    active: true
  }
];

const VIPPricing = () => {
  const [vipTiers, setVipTiers] = useState(initialVIPTiers);
  const [editingTierId, setEditingTierId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    discountPercent: 0,
    freeDeliveryThreshold: 0,
    monthlyFee: 0,
    pointsMultiplier: 1,
    exclusiveDeals: false,
    prioritySupport: false,
    active: true
  });
  
  // Commencer l'édition d'un niveau VIP
  const startEditing = (tier) => {
    setEditingTierId(tier.id);
    setEditFormData({ ...tier });
  };
  
  // Annuler l'édition
  const cancelEditing = () => {
    setEditingTierId(null);
  };
  
  // Sauvegarder les modifications
  const saveChanges = () => {
    // Vérification des données
    if (editFormData.name.trim() === "") {
      toast.error("Le nom du niveau VIP ne peut pas être vide");
      return;
    }
    
    if (editFormData.discountPercent < 0 || editFormData.discountPercent > 100) {
      toast.error("Le pourcentage de réduction doit être compris entre 0 et 100");
      return;
    }
    
    // Mise à jour des données
    const updatedTiers = vipTiers.map(tier => 
      tier.id === editingTierId ? { ...editFormData, id: tier.id } : tier
    );
    
    setVipTiers(updatedTiers);
    setEditingTierId(null);
    toast.success("Tarif VIP mis à jour avec succès");
  };
  
  // Gérer les changements dans le formulaire d'édition
  const handleEditChange = (field, value) => {
    setEditFormData({
      ...editFormData,
      [field]: value
    });
  };
  
  // Gérer l'ajout d'un nouveau niveau VIP
  const handleAddNewTier = () => {
    const newTier = {
      id: Date.now(),
      name: "Nouveau niveau",
      discountPercent: 0,
      freeDeliveryThreshold: 50,
      monthlyFee: 0,
      pointsMultiplier: 1,
      exclusiveDeals: false,
      prioritySupport: false,
      active: true
    };
    
    setVipTiers([...vipTiers, newTier]);
    startEditing(newTier); // Commencer l'édition immédiatement
    toast.success("Nouveau niveau VIP ajouté");
  };
  
  // Gérer la suppression d'un niveau VIP
  const handleDeleteTier = (id) => {
    const updatedTiers = vipTiers.filter(tier => tier.id !== id);
    setVipTiers(updatedTiers);
    toast.success("Niveau VIP supprimé avec succès");
  };
  
  // Afficher la ligne de tableau en mode édition
  const renderEditRow = () => {
    return (
      <TableRow key={editingTierId} className="bg-muted/50">
        <TableCell>
          <Input 
            value={editFormData.name} 
            onChange={(e) => handleEditChange('name', e.target.value)}
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <div className="flex items-center">
            <Input 
              type="number" 
              value={editFormData.discountPercent}
              onChange={(e) => handleEditChange('discountPercent', parseFloat(e.target.value))}
              className="w-16"
            />
            <span className="ml-1">%</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center">
            <Input 
              type="number" 
              value={editFormData.freeDeliveryThreshold}
              onChange={(e) => handleEditChange('freeDeliveryThreshold', parseFloat(e.target.value))}
              className="w-20"
            />
            <span className="ml-1">€</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center">
            <Input 
              type="number" 
              value={editFormData.monthlyFee}
              onChange={(e) => handleEditChange('monthlyFee', parseFloat(e.target.value))}
              className="w-20"
              step="0.01"
            />
            <span className="ml-1">€</span>
          </div>
        </TableCell>
        <TableCell>
          <Input 
            type="number" 
            value={editFormData.pointsMultiplier}
            onChange={(e) => handleEditChange('pointsMultiplier', parseFloat(e.target.value))}
            className="w-16"
            step="0.1"
          />
        </TableCell>
        <TableCell>
          <div className="flex justify-center">
            <Switch 
              checked={editFormData.exclusiveDeals}
              onCheckedChange={(checked) => handleEditChange('exclusiveDeals', checked)}
            />
          </div>
        </TableCell>
        <TableCell>
          <div className="flex justify-center">
            <Switch 
              checked={editFormData.prioritySupport}
              onCheckedChange={(checked) => handleEditChange('prioritySupport', checked)}
            />
          </div>
        </TableCell>
        <TableCell>
          <div className="flex justify-center">
            <Switch 
              checked={editFormData.active}
              onCheckedChange={(checked) => handleEditChange('active', checked)}
            />
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={saveChanges}>
              <Save size={18} className="text-green-600" />
            </Button>
            <Button variant="ghost" size="icon" onClick={cancelEditing}>
              <X size={18} className="text-red-600" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tarification VIP</h1>
          <p className="text-gray-500 mt-1">Gérez les offres spéciales pour vos clients VIP</p>
        </div>
        
        <Button onClick={handleAddNewTier} className="flex items-center gap-2">
          <Diamond size={16} />
          <span>Ajouter un niveau VIP</span>
        </Button>
      </div>
      
      {/* Cartes récapitulatives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {vipTiers
          .filter(tier => tier.active)
          .map(tier => (
            <Card key={tier.id} className={`shadow-sm ${tier.name === "Platinum" ? "border-amber-500" : ""}`}>
              <CardHeader className={`${tier.name === "Platinum" ? "bg-amber-50" : "bg-gray-50"}`}>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    {tier.name === "Silver" && <Star className="mr-2 text-gray-400" size={20} />}
                    {tier.name === "Gold" && <Star className="mr-2 text-amber-400" size={20} />}
                    {tier.name === "Platinum" && <Diamond className="mr-2 text-amber-600" size={20} />}
                    {tier.name}
                  </CardTitle>
                  <div className="text-2xl font-bold">
                    {tier.monthlyFee === 0 ? (
                      "Gratuit"
                    ) : (
                      <div className="flex items-center">
                        {tier.monthlyFee.toFixed(2)}€
                        <span className="text-xs text-gray-500 ml-1">/mois</span>
                      </div>
                    )}
                  </div>
                </div>
                <CardDescription>
                  {tier.discountPercent}% de réduction sur toutes les commandes
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <DollarSign className="text-green-500 mr-2" size={16} />
                    {tier.freeDeliveryThreshold === 0 ? (
                      "Livraison gratuite sur toutes les commandes"
                    ) : (
                      `Livraison gratuite dès ${tier.freeDeliveryThreshold}€ d'achat`
                    )}
                  </li>
                  <li className="flex items-center">
                    <Star className="text-amber-500 mr-2" size={16} />
                    Multiplicateur de points x{tier.pointsMultiplier}
                  </li>
                  {tier.exclusiveDeals && (
                    <li className="flex items-center">
                      <Percent className="text-blue-500 mr-2" size={16} />
                      Accès aux offres exclusives
                    </li>
                  )}
                  {tier.prioritySupport && (
                    <li className="flex items-center">
                      <Diamond className="text-purple-500 mr-2" size={16} />
                      Support prioritaire
                    </li>
                  )}
                </ul>
              </CardContent>
              <CardFooter className="bg-gray-50 flex justify-center border-t">
                <Button variant="outline" size="sm" onClick={() => startEditing(tier)}>
                  <Edit size={14} className="mr-1" />
                  Modifier
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
      
      {/* Tableau complet de configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration détaillée des tarifs VIP</CardTitle>
          <CardDescription>
            Gérez tous les paramètres de vos différents niveaux VIP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Niveau</TableHead>
                <TableHead>Réduction</TableHead>
                <TableHead>Livraison gratuite dès</TableHead>
                <TableHead>Frais mensuels</TableHead>
                <TableHead>Multiplicateur</TableHead>
                <TableHead className="text-center">Offres exclusives</TableHead>
                <TableHead className="text-center">Support prioritaire</TableHead>
                <TableHead className="text-center">Actif</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vipTiers.map(tier => (
                (editingTierId === tier.id) ? renderEditRow() : (
                  <TableRow key={tier.id}>
                    <TableCell className="font-medium">{tier.name}</TableCell>
                    <TableCell>{tier.discountPercent}%</TableCell>
                    <TableCell>{tier.freeDeliveryThreshold === 0 ? "Toujours" : `${tier.freeDeliveryThreshold}€`}</TableCell>
                    <TableCell>{tier.monthlyFee === 0 ? "Gratuit" : `${tier.monthlyFee.toFixed(2)}€`}</TableCell>
                    <TableCell>x{tier.pointsMultiplier}</TableCell>
                    <TableCell className="text-center">
                      {tier.exclusiveDeals ? <span className="text-green-500">Oui</span> : <span className="text-gray-400">Non</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      {tier.prioritySupport ? <span className="text-green-500">Oui</span> : <span className="text-gray-400">Non</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      {tier.active ? <span className="text-green-500">Actif</span> : <span className="text-red-500">Inactif</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => startEditing(tier)}>
                          <Edit size={18} className="text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTier(tier.id)}>
                          <X size={18} className="text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VIPPricing;