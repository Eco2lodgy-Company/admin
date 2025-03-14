"use client"
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DollarSign, 
  Plus, 
  Edit, 
  Trash, 
  Tags,
  Save,
  X
} from "lucide-react";
import { toast } from "sonner";

// Données fictives pour les tarifs de courses
const initialPrices = [
  { id: 1, distance: 5, price: 3.99, description: "Rayon de 0-5 km" },
  { id: 2, distance: 10, price: 5.99, description: "Rayon de 5-10 km" },
  { id: 3, distance: 15, price: 7.99, description: "Rayon de 10-15 km" },
  { id: 4, distance: 20, price: 9.99, description: "Rayon de 15-20 km" },
  { id: 5, distance: 25, price: 12.99, description: "Rayon de 20-25 km" },
];

const RidePricing = () => {
  const [prices, setPrices] = useState(initialPrices);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    distance: "",
    price: "",
    description: ""
  });

  const handleAddNewPrice = () => {
    setFormData({
      id: null,
      distance: "",
      price: "",
      description: ""
    });
    setIsEditing(true);
  };

  const handleEditPrice = (price) => {
    setFormData({
      id: price.id,
      distance: price.distance,
      price: price.price,
      description: price.description
    });
    setIsEditing(true);
  };

  const handleDeletePrice = (id) => {
    setPrices(prices.filter(price => price.id !== id));
    toast.success("Tarif supprimé avec succès");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'distance' || name === 'price' ? parseFloat(value) || "" : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.distance || !formData.price) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    if (formData.id) {
      // Mettre à jour un tarif existant
      const updatedPrices = prices.map(price => 
        price.id === formData.id ? { ...formData } : price
      );
      setPrices(updatedPrices);
      toast.success("Tarif mis à jour avec succès");
    } else {
      // Ajouter un nouveau tarif
      const newPrice = {
        ...formData,
        id: prices.length > 0 ? Math.max(...prices.map(p => p.id)) + 1 : 1,
      };
      setPrices([...prices, newPrice]);
      toast.success("Nouveau tarif ajouté avec succès");
    }
    
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Tarification des Courses</h1>
          <p className="text-gray-500 mt-1">Gérez les tarifs en fonction de la distance</p>
        </div>
        
        <Button onClick={handleAddNewPrice} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Ajouter un tarif</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            <span>Tarifs par distance</span>
          </CardTitle>
          <CardDescription>
            Les tarifs de livraison sont calculés en fonction de la distance parcourue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Distance (km)</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Prix (€)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices.length > 0 ? (
                prices.map((price) => (
                  <TableRow key={price.id}>
                    <TableCell className="font-medium">{price.id}</TableCell>
                    <TableCell>{price.distance} km</TableCell>
                    <TableCell>{price.description}</TableCell>
                    <TableCell className="text-right font-medium">{price.price.toFixed(2)} €</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditPrice(price)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeletePrice(price.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Aucun tarif défini
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t py-4 bg-gray-50">
          <div className="text-sm text-gray-500">
            {prices.length} tarifs configurés
          </div>
        </CardFooter>
      </Card>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="sm:max-w-[425px]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tags size={20} />
                  <span>{formData.id ? "Modifier le tarif" : "Ajouter un nouveau tarif"}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                  <X size={18} />
                </Button>
              </CardTitle>
              <CardDescription>
                Définissez le prix en fonction de la distance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance (km)</Label>
                    <Input
                      id="distance"
                      name="distance"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="10"
                      value={formData.distance}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (€)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="5.99"
                      value={formData.price}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      placeholder="Rayon de 0-10 km"
                      value={formData.description}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="flex items-center gap-2">
                    <Save size={16} />
                    {formData.id ? "Mettre à jour" : "Ajouter"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RidePricing;