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
  Store,
  MapPin,
  Phone,
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

export default function ShopManagement() {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddShopOpen, setIsAddShopOpen] = useState(false);
  const [isEditShopOpen, setIsEditShopOpen] = useState(false);
  const [isDeleteShopOpen, setIsDeleteShopOpen] = useState(false);
  const [currentShop, setCurrentShop] = useState(null);
  const [users, setUsers] = useState([]);
  const [newShop, setNewShop] = useState({
    nom: "",
    description: "",
    telephone: "",
    adresse: "",
    longitude: 0,
    latitude: 0,
    banner: null,
    vendeurId: 0,
    acteurId: 0,
  });

  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

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
        setFilteredShops(data.data);
        toast.success(data.message);
      } catch (err) {
        console.error("Error fetching shops:", err.message);
        toast.error("Erreur lors de la récupération des boutiques");
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://195.35.24.128:8081/api/user/liste?username=${username}`,
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
        setUsers(data.data);
        toast.success("Utilisateurs chargés avec succès");
      } catch (err) {
        console.error("Error fetching users:", err.message);
        toast.error("Erreur lors de la récupération des utilisateurs");
      }
    };

    fetchShops();
    fetchUsers();
  }, [setShops]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = shops.filter(
      (shop) =>
        shop.nom?.toLowerCase().includes(query) ||
        shop.description?.toLowerCase().includes(query) ||
        shop.adresse?.toLowerCase().includes(query)
    );
    setFilteredShops(filtered);
  };

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (isEdit) {
        setCurrentShop({ ...currentShop, banner: file });
      } else {
        setNewShop({ ...newShop, banner: file });
      }
    }
  };

  const handleAddShop = async () => {
    if (!newShop.nom || !newShop.description) {
      toast.error("Le nom et la description sont obligatoires");
      return;
    }

    const token = localStorage.getItem("token");
    const id = localStorage.getItem("logedUserId");
    const formData = new FormData();
    formData.append("nom", newShop.nom);
    formData.append("description", newShop.description);
    formData.append("telephone", newShop.telephone);
    formData.append("adresse", newShop.adresse);
    formData.append("longitude", newShop.longitude);
    formData.append("latitude", newShop.latitude);
    if (newShop.banner) {
      formData.append("banner", newShop.banner);
    }
    formData.append("vendeurId", newShop.vendeurId);
    formData.append("acteurId", id);
    console.log(formData)
    try {
      const response = await fetch(`http://195.35.24.128:8081/api/shop/new`, {
        method: "POST",
        headers: {
          contentType: "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setShops([...shops, data.data]);
      setFilteredShops([...filteredShops, data.data]);
      setIsAddShopOpen(false);
      setNewShop({
        nom: "",
        description: "",
        telephone: "",
        adresse: "",
        longitude: 0,
        latitude: 0,
        banner: null,
        vendeurId: 0,
        acteurId: 0,
      });
      toast.success("Boutique ajoutée avec succès");
    } catch (err) {
      console.error("Error adding shop:", err.message);
      toast.error("Erreur lors de l'ajout de la boutique");
    }
  };

  const handleEditShop = async () => {
    if (!currentShop) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("id", currentShop.id);
    formData.append("nom", currentShop.nom);
    formData.append("description", currentShop.description);
    formData.append("telephone", currentShop.telephone);
    formData.append("adresse", currentShop.adresse);
    formData.append("longitude", currentShop.longitude);
    formData.append("latitude", currentShop.latitude);
    if (currentShop.banner instanceof File) {
      formData.append("banner", currentShop.banner);
    }
    formData.append("vendeurId", currentShop.vendeurId);
    formData.append("acteurId", currentShop.acteurId);
console.log(formData)
console.log(currentShop.id)
    try {
      const response = await fetch(`http://195.35.24.128:8081/api/shop/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const updatedShops = shops.map((shop) =>
        shop.id === currentShop.id ? data.data : shop
      );
      setShops(updatedShops);
      setFilteredShops(
        filteredShops.map((shop) =>
          shop.id === currentShop.id ? data.data : shop
        )
      );
      setIsEditShopOpen(false);
      setCurrentShop(null);
      toast.success("Boutique mise à jour avec succès");
    } catch (err) {
      console.error("Error updating shop:", err.message);
      toast.error("Erreur lors de la mise à jour de la boutique");
    }
  };

  const handleDeleteShop = async () => {
    if (!currentShop) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/shop/delete/${currentShop.id}`,
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

      const updatedShops = shops.filter((shop) => shop.id !== currentShop.id);
      setShops(updatedShops);
      setFilteredShops(
        filteredShops.filter((shop) => shop.id !== currentShop.id)
      );
      setIsDeleteShopOpen(false);
      setCurrentShop(null);
      toast.success("Boutique supprimée avec succès");
    } catch (err) {
      console.error("Error deleting shop:", err.message);
      toast.error("Erreur lors de la suppression de la boutique");
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
        <h1 className="text-2xl font-bold">Gestion des boutiques</h1>
      </div>
      <Toaster />
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Store className="h-5 w-5" />
                Liste des boutiques
              </CardTitle>
              <CardDescription>
                {filteredShops?.length || 0} boutique
                {filteredShops?.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Rechercher une boutique..."
                  className="pl-8 w-full sm:w-[260px]"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <Dialog open={isAddShopOpen} onOpenChange={setIsAddShopOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une boutique
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Ajouter une boutique</DialogTitle>
                    <DialogDescription>
                      Créer une nouvelle boutique dans le système
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nom">Nom</Label>
                        <Input
                          id="nom"
                          value={newShop.nom}
                          onChange={(e) =>
                            setNewShop({ ...newShop, nom: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telephone">Téléphone</Label>
                        <Input
                          id="telephone"
                          value={newShop.telephone}
                          onChange={(e) =>
                            setNewShop({ ...newShop, telephone: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adresse">Adresse</Label>
                        <Input
                          id="adresse"
                          value={newShop.adresse}
                          onChange={(e) =>
                            setNewShop({ ...newShop, adresse: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vendeurId">Vendeur</Label>
                        <Select
                          value={newShop.vendeurId.toString()}
                          onValueChange={(value) =>
                            setNewShop({
                              ...newShop,
                              vendeurId: parseInt(value) || 0,
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner un vendeur" />
                          </SelectTrigger>
                          <SelectContent>
                            {users && users.length > 0 ? (
                              users
                                .filter((user) => user.role === "VENDEUR")
                                .map((user) => (
                                  <SelectItem
                                    key={user.id}
                                    value={user.id.toString()}
                                  >
                                    {user.nom} {user.prenom}
                                  </SelectItem>
                                ))
                            ) : (
                              <SelectItem value="0" disabled>
                                Aucun vendeur trouvé
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      {/* <div className="space-y-2">
                        <Label htmlFor="acteurId">ID Acteur</Label>
                        <Input
                          id="acteurId"
                          type="number"
                          value={newShop.acteurId}
                          onChange={(e) =>
                            setNewShop({
                              ...newShop,
                              acteurId: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div> */}
                      {/* <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="0.0001"
                          value={newShop.longitude}
                          onChange={(e) =>
                            setNewShop({
                              ...newShop,
                              longitude: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div> */}
                      {/* <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          type="number"
                          step="0.0001"
                          value={newShop.latitude}
                          onChange={(e) =>
                            setNewShop({
                              ...newShop,
                              latitude: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div> */}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newShop.description}
                        onChange={(e) =>
                          setNewShop({ ...newShop, description: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="banner">Bannière</Label>
                      <Input
                        id="banner"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddShopOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button onClick={handleAddShop}>Ajouter</Button>
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
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Bannière</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShops && filteredShops.length > 0 ? (
                  filteredShops.map((shop) => (
                    <TableRow key={shop?.id}>
                      <TableCell>{shop?.id}</TableCell>
                      <TableCell>{shop?.nom || "-"}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {shop?.description}
                      </TableCell>
                      <TableCell>{shop?.telephone || "-"}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {shop?.adresse || "-"}
                      </TableCell>
                      <TableCell>
                        {shop?.banner && (
                          <img
                            src={
                              shop.banner instanceof File
                                ? URL.createObjectURL("http://195.35.24.128/"+shop.banner)
                                : shop.banner
                            }
                            alt="Bannière"
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                      </TableCell>
                      <TableCell>{formatDate(shop?.createdAt)}</TableCell>
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
                                setCurrentShop(shop);
                                setIsEditShopOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentShop(shop);
                                setIsDeleteShopOpen(true);
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
                      Aucune boutique trouvée.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Shop Dialog */}
      <Dialog
        open={isEditShopOpen && currentShop !== null}
        onOpenChange={setIsEditShopOpen}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la boutique</DialogTitle>
            <DialogDescription>
              Mettre à jour les informations de la boutique
            </DialogDescription>
          </DialogHeader>
          {currentShop && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nom">Nom</Label>
                  <Input
                    id="edit-nom"
                    value={currentShop.nom}
                    onChange={(e) =>
                      setCurrentShop({ ...currentShop, nom: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-telephone">Téléphone</Label>
                  <Input
                    id="edit-telephone"
                    value={currentShop.telephone}
                    onChange={(e) =>
                      setCurrentShop({
                        ...currentShop,
                        telephone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-adresse">Adresse</Label>
                  <Input
                    id="edit-adresse"
                    value={currentShop.adresse}
                    onChange={(e) =>
                      setCurrentShop({ ...currentShop, adresse: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-vendeurId">Vendeur</Label>
                  <Select
                    value={currentShop.vendeurId.toString()}
                    onValueChange={(value) =>
                      setCurrentShop({
                        ...currentShop,
                        vendeurId: parseInt(value) || 0,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un vendeur" />
                    </SelectTrigger>
                    <SelectContent>
                      {users && users.length > 0 ? (
                        users
                          .filter((user) => user.role === "VENDEUR")
                          .map((user) => (
                            <SelectItem
                              key={user.id}
                              value={user.id.toString()}
                            >
                              {user.nom} {user.prenom}
                            </SelectItem>
                          ))
                      ) : (
                        <SelectItem value="0" disabled>
                          Aucun vendeur trouvé
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="edit-acteurId">ID Acteur</Label>
                  <Input
                    id="edit-acteurId"
                    type="number"
                    value={currentShop.acteurId}
                    onChange={(e) =>
                      setCurrentShop({
                        ...currentShop,
                        acteurId: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div> */}
                {/* <div className="space-y-2">
                  <Label htmlFor="edit-longitude">Longitude</Label>
                  <Input
                    id="edit-longitude"
                    type="number"
                    step="0.0001"
                    value={currentShop.longitude}
                    onChange={(e) =>
                      setCurrentShop({
                        ...currentShop,
                        longitude: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div> */}
                {/* <div className="space-y-2">
                  <Label htmlFor="edit-latitude">Latitude</Label>
                  <Input
                    id="edit-latitude"
                    type="number"
                    step="0.0001"
                    value={currentShop.latitude}
                    onChange={(e) =>
                      setCurrentShop({
                        ...currentShop,
                        latitude: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div> */}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={currentShop.description}
                  onChange={(e) =>
                    setCurrentShop({
                      ...currentShop,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-banner">Bannière</Label>
                <Input
                  id="edit-banner"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, true)}
                />
                {currentShop.banner && (
                  <img
                    src={
                      currentShop.banner instanceof File
                        ? URL.createObjectURL(currentShop.banner)
                        : currentShop.banner
                    }
                    alt="Bannière"
                    className="mt-2 w-32 h-32 object-cover rounded"
                  />
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditShopOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditShop}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Shop Dialog */}
      <Dialog open={isDeleteShopOpen} onOpenChange={setIsDeleteShopOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer la boutique</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette boutique ?
              Cette action va supprimer tous les produits reliés à cette boutique
              Notez que action est irreversible !
            </DialogDescription>
          </DialogHeader>
          {currentShop && (
            <div className="py-4">
              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <Store className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{currentShop.nom}</p>
                  {currentShop.telephone && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-3 w-3 mr-1" />
                      {currentShop.telephone}
                    </div>
                  )}
                  {currentShop.adresse && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {currentShop.adresse}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteShopOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteShop}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}