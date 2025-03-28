"use client";
import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Tag,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { set } from "date-fns";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);
  const [isActivateCategoryOpen, setIsActivateCategoryOpen] = useState(false);
  const [isDeactivateCategoryOpen, setIsDeactivateCategoryOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [shops, setShops] = useState([]);
  
  const [newCategory, setNewCategory] = useState({
    intitule: "",
    description: "",
    shopId: 0,
    acteurUsername: "",
  });

  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `http://195.35.24.128:8081/api/productCategories/liste?username=${username}`,
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
        setCategories(data.data);
        setFilteredCategories(data.data);
        toast.success("Catégories chargées avec succès");
      } catch (err) {
        console.error("Error fetching categories:", err.message);
        toast.error("Erreur lors de la récupération des catégories");
      }
    };

    const fetchShops = async () => {
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
        setShops(data.data);
        toast.success("Boutiques chargées avec succès");
      } catch (err) {
        console.error("Error fetching shops:", err.message);
        toast.error("Erreur lors de la récupération des boutiques");
      }
    };

    fetchCategories();
    fetchShops();
  }, [setCategories]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = categories.filter(
      (category) =>
        category.intitule?.toLowerCase().includes(query) ||
        category.description?.toLowerCase().includes(query) ||
        category.shopNom?.toLowerCase().includes(query)
    );
    setFilteredCategories(filtered);
  };

  const handleAddCategory = async () => {
    if (!newCategory.intitule || !newCategory.description) {
      toast.error("L'intitulé et la description sont obligatoires");
      return;
    }

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    const categoryToSend = {
      ...newCategory,
      acteurUsername: username,
    };

    try {
      const response = await fetch(`http://195.35.24.128:8081/api/productCategories/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCategories([...categories, data.data]);
      setFilteredCategories([...filteredCategories, data.data]);
      setIsAddCategoryOpen(false);
      setNewCategory({
        intitule: "",
        description: "",
        shopId: 0,
        acteurUsername: "",
      });
      toast.success("Catégorie ajoutée avec succès");
    } catch (err) {
      console.error("Error adding category:", err.message);
      toast.error("Erreur lors de l'ajout de la catégorie");
    }
  };

  const handleEditCategory = async () => {
    if (!currentCategory) return;

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    const categoryToEdit = {
      ...currentCategory,
      acteurUsername: username,
    };

    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/productCategories/update/${currentCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(categoryToEdit),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const updatedCategories = categories.map((category) =>
        category.id === currentCategory.id ? data.data : category
      );
      setCategories(updatedCategories);
      setFilteredCategories(
        filteredCategories.map((category) =>
          category.id === currentCategory.id ? data.data : category
        )
      );
      setIsEditCategoryOpen(false);
      setCurrentCategory(null);
      toast.success("Catégorie mise à jour avec succès");
    } catch (err) {
      console.error("Error updating category:", err.message);
      toast.error("Erreur lors de la mise à jour de la catégorie");
    }
  };

  const handleDeleteCategory = async () => {
    if (!currentCategory) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/productCategories/delete?id=${currentCategory.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedCategories = categories.filter(
        (category) => category.id !== currentCategory.id
      );
      setCategories(updatedCategories);
      setFilteredCategories(
        filteredCategories.filter(
          (category) => category.id !== currentCategory.id
        )
      );
      setIsDeleteCategoryOpen(false);
      setCurrentCategory(null);
      toast.success("Catégorie supprimée avec succès");
    } catch (err) {
      console.error("Error deleting category:", err.message);
      toast.error("Erreur lors de la suppression de la catégorie");
    }
  };

  const handleActivateCategory = async () => {
    if (!currentCategory) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/productCategories/api/productCategories/changeStatus/${currentCategory.id}`,
        {
          method: "PUT",
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
      const updatedCategories = categories.map((category) =>
        category.id === currentCategory.id ? { ...category, status: true } : category
      );
      setCategories(updatedCategories);
      setFilteredCategories(
        filteredCategories.map((category) =>
          category.id === currentCategory.id ? { ...category, status: true } : category
        )
      );
      setIsActivateCategoryOpen(false);
      setCurrentCategory(null);
      toast.success("Catégorie activée avec succès");
    } catch (err) {
      console.error("Error activating category:", err.message);
      toast.error("Erreur lors de l'activation de la catégorie");
    }
  };

  const handleDeactivateCategory = async () => {
    if (!currentCategory) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/productCategories/api/productCategories/changeStatus/${currentCategory.id}`,
        {
          method: "PUT",
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
      const updatedCategories = categories.map((category) =>
        category.id === currentCategory.id ? { ...category, status: false } : category
      );
      setCategories(updatedCategories);
      setFilteredCategories(
        filteredCategories.map((category) =>
          category.id === currentCategory.id ? { ...category, status: false } : category
        )
      );
      setIsDeactivateCategoryOpen(false);
      setCurrentCategory(null);
      toast.success("Catégorie désactivée avec succès");
    } catch (err) {
      console.error("Error deactivating category:", err.message);
      toast.error("Erreur lors de la désactivation de la catégorie");
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
    } catch (e) {
      return "Date invalide";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Gestion des catégories</h1>
      </div>
      <Toaster />
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Liste des catégories
              </CardTitle>
              <CardDescription>
                {filteredCategories?.length || 0} catégorie
                {filteredCategories?.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Rechercher une catégorie..."
                  className="pl-8 w-full sm:w-[260px]"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une catégorie
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Ajouter une catégorie</DialogTitle>
                    <DialogDescription>
                      Créer une nouvelle catégorie dans le système
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="intitule">Intitulé</Label>
                        <Input
                          id="intitule"
                          value={newCategory.intitule}
                          onChange={(e) =>
                            setNewCategory({
                              ...newCategory,
                              intitule: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shopId">Boutique</Label>
                        <Select
                          value={newCategory.shopId.toString()}
                          onValueChange={(value) =>
                            setNewCategory({
                              ...newCategory,
                              shopId: parseInt(value) || 0,
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner une boutique" />
                          </SelectTrigger>
                          <SelectContent>
                            {shops && shops.length > 0 ? (
                              shops.map((shop) => (
                                <SelectItem
                                  key={shop.id}
                                  value={shop.id.toString()}
                                >
                                  {shop.nom}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="0" disabled>
                                Aucune boutique trouvée
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newCategory.description}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddCategoryOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button onClick={handleAddCategory}>Ajouter</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Intitulé</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Boutique</TableHead>
                  <TableHead>Acteur</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories && filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <TableRow key={category?.id}>
                      <TableCell>{category?.id}</TableCell>
                      <TableCell>{category?.intitule || "-"}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {category?.description || "-"}
                      </TableCell>
                      <TableCell>{category?.shopNom || "-"}</TableCell>
                      <TableCell>{category?.acteurNom || "-"}</TableCell>
                      <TableCell>
                        {category?.status ? "Actif" : "Inactif"}
                      </TableCell>
                      <TableCell>{formatDate(category?.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentCategory(category);
                                setIsEditCategoryOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentCategory(category);
                                setIsActivateCategoryOpen(true);
                              }}
                              disabled={category?.status}
                              className="text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Activer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentCategory(category);
                                setIsDeactivateCategoryOpen(true);
                              }}
                              disabled={!category?.status}
                              className="text-orange-600"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Désactiver
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentCategory(category);
                                setIsDeleteCategoryOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Aucune catégorie trouvée.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Category Dialog */}
      <Dialog
        open={isEditCategoryOpen && currentCategory !== null}
        onOpenChange={setIsEditCategoryOpen}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription>
              Mettre à jour les informations de la catégorie
            </DialogDescription>
          </DialogHeader>
          {currentCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-intitule">Intitulé</Label>
                  <Input
                    id="edit-intitule"
                    value={currentCategory.intitule}
                    onChange={(e) =>
                      setCurrentCategory({
                        ...currentCategory,
                        intitule: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-shopId">Boutique</Label>
                  <Select
                    value={currentCategory.shopId.toString()}
                    onValueChange={(value) =>
                      setCurrentCategory({
                        ...currentCategory,
                        shopId: parseInt(value) || 0,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une boutique" />
                    </SelectTrigger>
                    <SelectContent>
                      {shops && shops.length > 0 ? (
                        shops.map((shop) => (
                          <SelectItem key={shop.id} value={shop.id.toString()}>
                            {shop.nom}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="0" disabled>
                          Aucune boutique trouvée
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-acteurId">ID Acteur</Label>
                  <Input
                    id="edit-acteurId"
                    type="number"
                    value={currentCategory.acteurId}
                    onChange={(e) =>
                      setCurrentCategory({
                        ...currentCategory,
                        acteurId: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={currentCategory.description}
                  onChange={(e) =>
                    setCurrentCategory({
                      ...currentCategory,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditCategoryOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleEditCategory}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteCategoryOpen} onOpenChange={setIsDeleteCategoryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer la catégorie</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette catégorie ?
            </DialogDescription>
          </DialogHeader>
          {currentCategory && (
            <div className="py-4">
              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <Tag className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{currentCategory.intitule}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    Boutique: {currentCategory.shopNom || "-"}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    Acteur: {currentCategory.acteurNom || "-"}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteCategoryOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activate Category Dialog */}
      <Dialog open={isActivateCategoryOpen} onOpenChange={setIsActivateCategoryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Activer la catégorie</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir activer cette catégorie ?
            </DialogDescription>
          </DialogHeader>
          {currentCategory && (
            <div className="py-4">
              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <Tag className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{currentCategory.intitule}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    Boutique: {currentCategory.shopNom || "-"}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    Acteur: {currentCategory.acteurNom || "-"}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsActivateCategoryOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="default" className="bg-green-600 hover:bg-green-700" onClick={handleActivateCategory}>
              Activer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Category Dialog */}
      <Dialog open={isDeactivateCategoryOpen} onOpenChange={setIsDeactivateCategoryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Désactiver la catégorie</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir désactiver cette catégorie ?
            </DialogDescription>
          </DialogHeader>
          {currentCategory && (
            <div className="py-4">
              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <Tag className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{currentCategory.intitule}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    Boutique: {currentCategory.shopNom || "-"}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    Acteur: {currentCategory.acteurNom || "-"}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeactivateCategoryOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="default" className="bg-orange-600 hover:bg-orange-700" onClick={handleDeactivateCategory}>
              Désactiver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}