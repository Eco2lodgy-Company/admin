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
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { 
  Plus, 
  Edit, 
  Trash, 
  X,
  Calendar as CalendarIcon,
  Image,
  Save,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Données fictives pour les publicités
const initialAds = [
  { 
    id: 1, 
    name: "Promotion d'été", 
    description: "Profitez de nos offres spéciales tout l'été", 
    image: "/placeholder.svg",
    startDate: new Date(2023, 5, 1), // Juin 1, 2023
    endDate: new Date(2023, 7, 31), // Août 31, 2023
    isActive: true
  },
  { 
    id: 2, 
    name: "Offre Flash", 
    description: "24h seulement! Réductions exceptionnelles", 
    image: "/placeholder.svg",
    startDate: new Date(2023, 6, 15), // Juillet 15, 2023
    endDate: new Date(2023, 6, 16), // Juillet 16, 2023
    isActive: false
  },
  { 
    id: 3, 
    name: "Soldes d'hiver", 
    description: "Grandes réductions sur tous nos produits", 
    image: "/placeholder.svg",
    startDate: new Date(2023, 11, 1), // Décembre 1, 2023
    endDate: new Date(2024, 0, 31), // Janvier 31, 2024
    isActive: true
  },
];

const Advertisements = () => {
  const [ads, setAds] = useState(initialAds);
  const [isEditing, setIsEditing] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    image: "/placeholder.svg",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Une semaine plus tard par défaut
    isActive: true
  });

  const handleAddNewAd = () => {
    setFormData({
      id: null,
      name: "",
      description: "",
      image: "/placeholder.svg",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isActive: true
    });
    setIsEditing(true);
  };

  const handleEditAd = (ad) => {
    setFormData({ ...ad });
    setIsEditing(true);
  };

  const handleDeleteConfirm = (id) => {
    setAds(ads.filter(ad => ad.id !== id));
    setAdToDelete(null);
    toast.success("Publicité supprimée avec succès");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (field, date) => {
    setFormData({
      ...formData,
      [field]: date
    });
  };

  const handleToggleActive = () => {
    setFormData({
      ...formData,
      isActive: !formData.isActive
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.startDate || !formData.endDate) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    if (formData.startDate > formData.endDate) {
      toast.error("La date de début doit être antérieure à la date de fin");
      return;
    }
    
    if (formData.id) {
      // Mettre à jour une publicité existante
      const updatedAds = ads.map(ad => 
        ad.id === formData.id ? { ...formData } : ad
      );
      setAds(updatedAds);
      toast.success("Publicité mise à jour avec succès");
    } else {
      // Ajouter une nouvelle publicité
      const newAd = {
        ...formData,
        id: ads.length > 0 ? Math.max(...ads.map(a => a.id)) + 1 : 1,
      };
      setAds([...ads, newAd]);
      toast.success("Nouvelle publicité ajoutée avec succès");
    }
    
    setIsEditing(false);
  };

  const isActive = (ad) => {
    const now = new Date();
    return ad.isActive && ad.startDate <= now && ad.endDate >= now;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Publicités</h1>
          <p className="text-gray-500 mt-1">Programmez et gérez vos campagnes publicitaires</p>
        </div>
        
        <Button onClick={handleAddNewAd} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Ajouter une publicité</span>
        </Button>
      </div>

      {/* Carte principale avec tableau des publicités */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            <span>Publicités</span>
          </CardTitle>
          <CardDescription>
            Toutes vos campagnes publicitaires passées, présentes et futures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Date de début</TableHead>
                <TableHead>Date de fin</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.length > 0 ? (
                ads.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell className="font-medium">{ad.id}</TableCell>
                    <TableCell>{ad.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{ad.description}</TableCell>
                    <TableCell>
                      <div className="h-10 w-10 rounded-md bg-gray-100 overflow-hidden">
                        <img 
                          src={ad.image} 
                          alt={ad.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{format(ad.startDate, "dd/MM/yyyy")}</TableCell>
                    <TableCell>{format(ad.endDate, "dd/MM/yyyy")}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        isActive(ad) 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      )}>
                        {isActive(ad) ? "Actif" : "Inactif"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditAd(ad)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => setAdToDelete(ad)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    Aucune publicité définie
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t py-4 bg-gray-50">
          <div className="text-sm text-gray-500">
            {ads.length} publicités configurées
          </div>
        </CardFooter>
      </Card>

      {/* Overlay et formulaire d'ajout/modification */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image size={20} />
                  <span>{formData.id ? "Modifier la publicité" : "Ajouter une nouvelle publicité"}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                  <X size={18} />
                </Button>
              </CardTitle>
              <CardDescription>
                Configurez les détails et la durée de votre campagne publicitaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de la publicité</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Promotion d'été"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">URL de l'image</Label>
                    <Input
                      id="image"
                      name="image"
                      placeholder="/images/ad-summer.jpg"
                      value={formData.image}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Décrivez votre campagne publicitaire"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date de début</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? format(formData.startDate, "PPP") : <span>Choisir une date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => handleDateChange("startDate", date)}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Date de fin</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? format(formData.endDate, "PPP") : <span>Choisir une date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) => handleDateChange("endDate", date)}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2 md:col-span-2 flex items-center">
                    <Button 
                      type="button" 
                      variant={formData.isActive ? "default" : "outline"}
                      onClick={handleToggleActive}
                      className="mr-4"
                    >
                      {formData.isActive ? "Actif" : "Inactif"}
                    </Button>
                    <span className="text-sm text-gray-500">
                      Définissez si la publicité doit être active pendant la période définie
                    </span>
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

      {/* Boîte de dialogue de suppression */}
      <AlertDialog open={adToDelete !== null} onOpenChange={() => setAdToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la publicité "{adToDelete?.name}" ? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteConfirm(adToDelete?.id)}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Advertisements;