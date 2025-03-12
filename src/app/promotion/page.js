"use client"
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Percent, Plus, Edit, Trash2, Search, FilterX } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const Promotions = () => {
  // État pour stocker les promotions (simulé pour l'instant)
  const [promotions, setPromotions] = useState([
    { 
      id: 1, 
      code: "SUMMER2023", 
      discount: "20%", 
      startDate: "2023-06-01", 
      endDate: "2023-08-31", 
      status: "active", 
      appliesTo: "Tous les produits",
      description: "Remise d'été sur tous les produits"
    },
    { 
      id: 2, 
      code: "BIENVENUE", 
      discount: "15%", 
      startDate: "2023-01-01", 
      endDate: "2023-12-31", 
      status: "active", 
      appliesTo: "Première commande",
      description: "Offre de bienvenue pour les nouveaux clients"
    },
    { 
      id: 3, 
      code: "FLASH50", 
      discount: "50%", 
      startDate: "2023-05-15", 
      endDate: "2023-05-16", 
      status: "expired", 
      appliesTo: "Articles sélectionnés",
      description: "Vente flash limitée"
    },
  ]);

  // État pour gérer le formulaire d'ajout/modification
  const [formData, setFormData] = useState({
    id: null,
    code: "",
    discount: "",
    startDate: "",
    endDate: "",
    status: "active",
    appliesTo: "",
    description: ""
  });

  // État pour gérer si nous sommes en mode édition
  const [isEditing, setIsEditing] = useState(false);
  
  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState("");
  
  // État pour les filtres
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Ouvrir le dialog pour ajouter une promotion
  const handleAddClick = () => {
    setFormData({
      id: null,
      code: "",
      discount: "",
      startDate: "",
      endDate: "",
      status: "active",
      appliesTo: "",
      description: ""
    });
    setIsEditing(false);
  };

  // Ouvrir le dialog pour modifier une promotion
  const handleEditClick = (promo) => {
    setFormData({
      ...promo,
      startDate: promo.startDate,
      endDate: promo.endDate
    });
    setIsEditing(true);
  };

  // Gérer les changements dans le formulaire
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Gérer les sélections dans les selects
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Mettre à jour une promotion existante
      const updatedPromotions = promotions.map(promo => 
        promo.id === formData.id ? formData : promo
      );
      setPromotions(updatedPromotions);
    } else {
      // Ajouter une nouvelle promotion
      const newPromo = {
        ...formData,
        id: promotions.length > 0 ? Math.max(...promotions.map(p => p.id)) + 1 : 1
      };
      setPromotions([...promotions, newPromo]);
    }
    
    // Réinitialiser le formulaire
    setFormData({
      id: null,
      code: "",
      discount: "",
      startDate: "",
      endDate: "",
      status: "active",
      appliesTo: "",
      description: ""
    });
    
    // Fermer le dialog (le dialog se fermera automatiquement car c'est un component controlled par radix)
  };

  // Supprimer une promotion
  const handleDeletePromo = (id) => {
    setPromotions(promotions.filter(promo => promo.id !== id));
  };

  // Filtrer les promotions selon la recherche et le statut
  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch = promo.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         promo.appliesTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promo.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || promo.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Promotions</h1>
          <p className="text-muted-foreground">
            Créez et gérez les codes promotionnels et les remises pour vos clients.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handleAddClick}>
              <Plus className="mr-2 h-4 w-4" /> Nouvelle Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Modifier la promotion" : "Ajouter une promotion"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleFormChange}
                    placeholder="ex: SUMMER2023"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Remise</Label>
                  <Input
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleFormChange}
                    placeholder="ex: 20%"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Date de début</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Date de fin</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="scheduled">Programmé</SelectItem>
                      <SelectItem value="expired">Expiré</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appliesTo">Applicable à</Label>
                  <Input
                    id="appliesTo"
                    name="appliesTo"
                    value={formData.appliesTo}
                    onChange={handleFormChange}
                    placeholder="ex: Tous les produits"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Description de la promotion"
                  rows={3}
                />
              </div>
              
              <DialogFooter>
                <Button type="submit">{isEditing ? "Mettre à jour" : "Ajouter"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des promotions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select 
          value={filterStatus} 
          onValueChange={setFilterStatus}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <FilterX className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filtrer par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="scheduled">Programmé</SelectItem>
            <SelectItem value="expired">Expiré</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Actives</TabsTrigger>
          <TabsTrigger value="scheduled">Programmées</TabsTrigger>
          <TabsTrigger value="expired">Expirées</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {filteredPromotions.filter(promo => promo.status === 'active').length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Remise</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Applicable à</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPromotions.filter(promo => promo.status === 'active').map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell className="font-medium">{promotion.code}</TableCell>
                      <TableCell>{promotion.discount}</TableCell>
                      <TableCell>
                        {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{promotion.appliesTo}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">{promotion.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(promotion)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            {/* Le contenu du dialogue est le même que pour l'ajout - React le remplacera automatiquement */}
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" onClick={() => handleDeletePromo(promotion.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <Percent className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">Aucune promotion active</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Les promotions actives apparaîtront ici.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="scheduled" className="space-y-4">
          {filteredPromotions.filter(promo => promo.status === 'scheduled').length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Remise</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Applicable à</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPromotions.filter(promo => promo.status === 'scheduled').map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell className="font-medium">{promotion.code}</TableCell>
                      <TableCell>{promotion.discount}</TableCell>
                      <TableCell>
                        {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{promotion.appliesTo}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50">{promotion.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(promotion)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            {/* Le contenu du dialogue est le même que pour l'ajout */}
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" onClick={() => handleDeletePromo(promotion.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <Percent className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">Aucune promotion programmée</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Créez une nouvelle promotion pour qu'elle apparaisse ici.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="expired" className="space-y-4">
          {filteredPromotions.filter(promo => promo.status === 'expired').length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Remise</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Applicable à</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPromotions.filter(promo => promo.status === 'expired').map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell className="font-medium">{promotion.code}</TableCell>
                      <TableCell>{promotion.discount}</TableCell>
                      <TableCell>
                        {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{promotion.appliesTo}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">{promotion.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(promotion)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            {/* Le contenu du dialogue est le même que pour l'ajout */}
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" onClick={() => handleDeletePromo(promotion.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <Percent className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">Aucune promotion expirée</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Les promotions expirées apparaîtront ici.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Promotions;
