"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DollarSign,
  Plus,
  Edit,
  Trash,
  Tags,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";

const RidePricing = () => {
  const [prices, setPrices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeletePriceOpen, setIsDeletePriceOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [formData, setFormData] = useState({
    distanceMin: "",
    distanceMax: "",
    tarif: "",
    moyenDeplacement: "",
  });

  // Fetch prices from the API
  useEffect(() => {
    const fetchPrices = async () => {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      try {
        const response = await fetch(
          `http://195.35.24.128:8081/api/tarifications/liste`,
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
        setPrices(data.data || []);
        toast.success("Tarifs chargés avec succès");
      } catch (err) {
        console.error("Error fetching prices:", err.message);
        toast.error("Erreur lors de la récupération des tarifs");
      }
    };

    fetchPrices();
  }, []);

  const handleAddNewPrice = () => {
    setFormData({
      distanceMin: "",
      distanceMax: "",
      tarif: "",
      moyenDeplacement: "",
    });
    setIsEditing(true);
  };

  const handleEditPrice = (price) => {
    setFormData({
      id: price.id,
      distanceMin: price.distanceMin,
      distanceMax: price.distanceMax,
      tarif: price.tarif,
      moyenDeplacement: price.moyenDeplacement,
    });
    setIsEditing(true);
  };

  const handleDeletePrice = async () => {
    if (!currentPrice) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/tarifications/delete/${currentPrice.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setPrices(prices.filter((price) => price.id !== currentPrice.id));
      setIsDeletePriceOpen(false);
      setCurrentPrice(null);
      toast.success("Tarif supprimé avec succès");
    } catch (err) {
      console.error("Error deleting price:", err.message);
      toast.error("Erreur lors de la suppression du tarif");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "distanceMin" || name === "distanceMax" || name === "tarif"
          ? parseFloat(value) || ""
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.distanceMin || !formData.distanceMax || !formData.tarif || !formData.moyenDeplacement) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const token = localStorage.getItem("token");
    const id = localStorage.getItem("logedUserId");

    const priceToSend = {
      ...formData,
      acteurId: id || 0, // Utilise l'ID de l'utilisateur connecté ou 0 par défaut
    };

    try {
      console.log("priceToSend", priceToSend);
      let response;

      if (formData.id) {
        // Update existing price
        response = await fetch(
          `http://195.35.24.128:8081/api/tarifications/update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(priceToSend),
          }
        );
      } else {
        // Add new price
        response = await fetch(`http://195.35.24.128:8081/api/tarifications/new`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(priceToSend),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (formData.id) {
        const updatedPrices = prices.map((price) =>
          price.id === formData.id ? data.data : price
        );
        setPrices(updatedPrices);
        toast.success("Tarif mis à jour avec succès");
      } else {
        setPrices([...prices, data.data]);
        toast.success("Nouveau tarif ajouté avec succès");
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Error submitting price:", err.message);
      toast.error(
        `Erreur lors de ${formData.id ? "la mise à jour" : "l'ajout"} du tarif`
      );
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Tarification des Courses</h1>
          <p className="text-gray-500 mt-1">
            Gérez les tarifs en fonction de la distance
          </p>
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
            Les tarifs de livraison sont calculés en fonction de la distance
            parcourue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Distance Min (km)</TableHead>
                <TableHead>Distance Max (km)</TableHead>
                <TableHead>Moyen de déplacement</TableHead>
                <TableHead className="text-right">Tarif (€)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices.length > 0 ? (
                prices.map((price) => (
                  <TableRow key={price?.id}>
                    <TableCell className="font-medium">{price?.id}</TableCell>
                    <TableCell>{price?.distanceMin} km</TableCell>
                    <TableCell>{price?.distanceMax} km</TableCell>
                    <TableCell>{price?.moyenDeplacement}</TableCell>
                    <TableCell className="text-right font-medium">
                      {price?.tarif.toFixed(2)} €
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditPrice(price)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            setCurrentPrice(price);
                            setIsDeletePriceOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
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

      {/* Edit/Add Price Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="sm:max-w-[500px]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tags size={20} />
                  <span>
                    {formData.id ? "Modifier le tarif" : "Ajouter un nouveau tarif"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(false)}
                >
                  <X size={18} />
                </Button>
              </CardTitle>
              <CardDescription>
                Définissez le prix en fonction de la distance et du moyen de déplacement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distanceMin">Distance Min (km)</Label>
                    <Input
                      id="distanceMin"
                      name="distanceMin"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="0"
                      value={formData.distanceMin}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="distanceMax">Distance Max (km)</Label>
                    <Input
                      id="distanceMax"
                      name="distanceMax"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="10"
                      value={formData.distanceMax}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tarif">Tarif (€)</Label>
                    <Input
                      id="tarif"
                      name="tarif"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="10.00"
                      value={formData.tarif}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="moyenDeplacement">Moyen de déplacement</Label>
                    <Select
                      value={formData.moyenDeplacement}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          moyenDeplacement: value,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un moyen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Moto">Moto</SelectItem>
                        <SelectItem value="Voiture">Voiture</SelectItem>
                        <SelectItem value="Camion">Camion</SelectItem>
                        <SelectItem value="Scooter">Scooter</SelectItem>
                        <SelectItem value="Vélo">Vélo</SelectItem>
                        <SelectItem value="Trotinette">Trotinette</SelectItem>
                        <SelectItem value="À pied">À pied</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
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

      {/* Delete Price Dialog */}
      <Dialog open={isDeletePriceOpen} onOpenChange={setIsDeletePriceOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer le tarif</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce tarif ?
            </DialogDescription>
          </DialogHeader>
          {currentPrice && (
            <div className="py-4">
              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">
                    {currentPrice.distanceMin}-{currentPrice.distanceMax} km
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    Tarif: {currentPrice.tarif.toFixed(2)} €
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    Moyen de déplacement: {currentPrice.moyenDeplacement || "-"}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeletePriceOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePrice}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RidePricing;