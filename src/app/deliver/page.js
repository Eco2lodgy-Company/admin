"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Search,
  MoreVertical,
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Package2,
  LocateFixed,
  Clock,
  CheckCircle,
  Plus,
  Edit,
  Trash,
  Loader2, // Ajout de Loader2 pour les spinners
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner"; // Ajout pour les notifications

export default function DeliveryManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deliverers, setDeliverers] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredDeliverers, setFilteredDeliverers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedDeliverer, setSelectedDeliverer] = useState(null);
  const [showDelivererDetails, setShowDelivererDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("deliverers");
  const [showAddDeliverer, setShowAddDeliverer] = useState(false);
  const [showEditDeliverer, setShowEditDeliverer] = useState(false);
  const [showDeleteDeliverer, setShowDeleteDeliverer] = useState(false);
  const [newDeliverer, setNewDeliverer] = useState({
    livreurUserId: "",
    moyenDeplacement: "",
  });
  const [loading, setLoading] = useState(false); // Nouvel état pour le chargement

  const fetchDeliverers = async () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    setLoading(true); // Début du chargement
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/livreurs/liste?username=${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const delivererList = data.data || [];
      setDeliverers(delivererList);
      setFilteredDeliverers(delivererList);
      // toast.success("Livreurs chargés avec succès");
    } catch (err) {
      console.error("Error fetching deliverers:", err.message);
      toast.error("Erreur lors de la récupération des livreurs");
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  const fetchUsers = async () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    setLoading(true); // Début du chargement
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
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const userList = data.data || [];
      setUsers(userList);
    } catch (err) {
      console.error("Error fetching users:", err.message);
      toast.error("Erreur lors de la récupération des utilisateurs");
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  const fetchOrders = async () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    setLoading(true); // Début du chargement
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/commandes/administrateur/liste`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const orderList = data.data || [];
      setOrders(orderList);
      setFilteredOrders(orderList);
      console.log("Paniers:", orderList);
    } catch (err) {
      console.error("Error fetching orders:", err.message);
      toast.error("Erreur lors de la récupération des paniers");
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  useEffect(() => {
    fetchDeliverers();
    fetchUsers();
    fetchOrders();
  }, []);

  const handleSearchDeliverers = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = deliverers.filter(
      (deliverer) =>
        deliverer.prenom.toLowerCase().includes(query) ||
        deliverer.nom.toLowerCase().includes(query) ||
        deliverer.email.toLowerCase().includes(query)
    );
    setFilteredDeliverers(filtered);
  };

  const handleSearchOrders = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = orders.filter(
      (order) =>
        order.id.toString().includes(query) ||
        order.clientNom.toLowerCase().includes(query) ||
        order.clientEmail.toLowerCase().includes(query)
    );
    setFilteredOrders(filtered);
  };

  const handleAddDeliverer = async () => {
    const token = localStorage.getItem("token");
    const acteurId = localStorage.getItem("logedUserId");

    if (!newDeliverer.livreurUserId || !newDeliverer.moyenDeplacement) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const delivererData = {
      livreurUserId: parseInt(newDeliverer.livreurUserId),
      acteurId: parseInt(acteurId),
      moyenDeplacement: newDeliverer.moyenDeplacement,
    };

    setLoading(true); // Début du chargement
    try {
      const response = await fetch(`http://195.35.24.128:8081/api/livreurs/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(delivererData),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      await fetchDeliverers(); // Rafraîchir la liste
      setNewDeliverer({ livreurUserId: "", moyenDeplacement: "" });
      setShowAddDeliverer(false);
      toast.success(data.message);
    } catch (err) {
      console.error("Error adding deliverer:", err.message);
      toast.error("Erreur lors de l'ajout du livreur");
      await fetchDeliverers();
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  const handleEditDeliverer = async () => {
    const token = localStorage.getItem("token");
    const acteurId = localStorage.getItem("logedUserId");

    if (!selectedDeliverer?.livreurUserId || !selectedDeliverer?.moyenDeplacement) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const delivererData = {
      idLivreur: parseInt(selectedDeliverer.id),
      acteurId: parseInt(acteurId),
      isDisponible: true,
      moyenDeplacement: selectedDeliverer.moyenDeplacement,
    };

    setLoading(true); // Début du chargement
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/livreurs/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(delivererData),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      await fetchDeliverers(); // Rafraîchir la liste
      setShowEditDeliverer(false);
      toast.success(data.message);
    } catch (err) {
      console.error("Error updating deliverer:", err.message);
      toast.error("Erreur lors de la modification du livreur");
      await fetchDeliverers();
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  const handleDeleteDeliverer = async () => {
    const token = localStorage.getItem("token");

    setLoading(true); // Début du chargement
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/livreurs/delete/${selectedDeliverer.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      await fetchDeliverers(); // Rafraîchir la liste
      setShowDeleteDeliverer(false);
      const data = await response.json();
      toast.success(data.message);
    } catch (err) {
      console.error("Error deleting deliverer:", err.message);
      toast.error("Erreur lors de la suppression du livreur");
      await fetchDeliverers();
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  useEffect(() => {
    setSearchQuery("");
    setFilteredDeliverers(deliverers);
    setFilteredOrders(orders);
  }, [activeTab, deliverers, orders]);

  const getStatusBadge = (isApproved) => {
    if (isApproved === null) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          En attente
        </Badge>
      );
    } else if (isApproved === "En attente") {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          En atttente
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
          Refusé
        </Badge>
      );
    }
  };

  const calculateTotalAmount = (produits) => {
    return produits?.reduce((total, produit) => total + produit.quantite * produit.prix, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Gestion des livraisons</h1>
        <p className="text-gray-500 mt-1">Gérez les livreurs et les paniers en cours</p>
      </div>

      <Toaster /> {/* Ajout pour afficher les notifications */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            <span className="text-gray-600">Traitement en cours...</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">En attente</p>
                <h3 className="text-2xl font-bold text-yellow-900 mt-1">
                  {orders.filter((order) => order.etat === "En attente").length}
                </h3>
              </div>
              <div className="h-12 w-12 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-700">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">En cours</p>
                <h3 className="text-2xl font-bold text-blue-900 mt-1">0</h3>
              </div>
              <div className="h-12 w-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700">
                <LocateFixed className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Livrées</p>
                <h3 className="text-2xl font-bold text-green-900 mt-1">0</h3>
              </div>
              <div className="h-12 w-12 bg-green-200 rounded-full flex items-center justify-center text-green-700">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="deliverers" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deliverers">Livreurs</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
        </TabsList>

        <TabsContent value="deliverers" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Liste des livreurs</CardTitle>
                  <CardDescription>
                    {filteredDeliverers.length} livreur{filteredDeliverers.length !== 1 ? "s" : ""}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Rechercher un livreur..."
                      className="pl-8 w-full sm:w-[260px]"
                      value={searchQuery}
                      onChange={handleSearchDeliverers}
                      disabled={loading}
                    />
                  </div>
                  <Dialog open={showAddDeliverer} onOpenChange={setShowAddDeliverer}>
                    <DialogTrigger asChild>
                      <Button className="whitespace-nowrap" disabled={loading}>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un livreur
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Ajouter un nouveau livreur</DialogTitle>
                        <DialogDescription>
                          Sélectionnez un utilisateur avec le rôle "Livreur" et son moyen de déplacement.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="livreurUserId">Livreur</Label>
                          <Select
                            value={newDeliverer.livreurUserId}
                            onValueChange={(value) =>
                              setNewDeliverer({ ...newDeliverer, livreurUserId: value })
                            }
                            disabled={loading}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Sélectionner un livreur" />
                            </SelectTrigger>
                            <SelectContent>
                              {users
                                .filter((u) => u.role === "LIVREUR")
                                .map((deliverer) => (
                                  <SelectItem key={deliverer.id} value={deliverer.id.toString()}>
                                    {deliverer.prenom} {deliverer.nom} ({deliverer.email})
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="moyenDeplacement">Moyen de déplacement</Label>
                          <Select
                            value={newDeliverer.moyenDeplacement}
                            onValueChange={(value) =>
                              setNewDeliverer({ ...newDeliverer, moyenDeplacement: value })
                            }
                            disabled={loading}
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
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddDeliverer(false)} disabled={loading}>
                          Annuler
                        </Button>
                        <Button onClick={handleAddDeliverer} disabled={loading}>
                          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ajouter le livreur"}
                        </Button>
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
                      <TableHead>Livreur</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Adresse</TableHead>
                      <TableHead>Moyen de déplacement</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeliverers.length > 0 ? (
                      filteredDeliverers.map((deliverer) => (
                        <TableRow key={deliverer?.id}>
                          <TableCell className="font-medium">
                            {deliverer?.prenom} {deliverer?.nom}
                          </TableCell>
                          <TableCell>{deliverer?.email}</TableCell>
                          <TableCell>{deliverer?.telephone || "-"}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {deliverer?.adresse || "-"}
                          </TableCell>
                          <TableCell>{deliverer?.moyenDeplacement || "-"}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
                                  <span className="sr-only">Ouvrir le menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedDeliverer(deliverer);
                                    setShowDelivererDetails(true);
                                  }}
                                >
                                  <UserCircle className="mr-2 h-4 w-4" />
                                  Voir les détails
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedDeliverer({
                                      ...deliverer,
                                      livreurUserId: deliverer.id.toString(),
                                    });
                                    setShowEditDeliverer(true);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedDeliverer(deliverer);
                                    setShowDeleteDeliverer(true);
                                  }}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Aucun livreur trouvé.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Commandes en attente</CardTitle>
                  <CardDescription>
                    {filteredOrders.length} Commandes{filteredOrders.length !== 1 ? "s" : ""}
                  </CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Rechercher un panier..."
                    className="pl-8 w-full sm:w-[260px]"
                    value={searchQuery}
                    onChange={handleSearchOrders}
                    disabled={loading}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Intitule</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>ClientNom</TableHead>
                      <TableHead>VendeurNom</TableHead>
                      <TableHead>Etat</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order?.id}>
                          <TableCell className="font-medium">#{order?.id}</TableCell>
                          <TableCell>{order?.clientNom|| "-"} </TableCell>
                          <TableCell>{order?.description || "-"}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {order.clientNom || "-"}
                          </TableCell>
                          <TableCell>{order.vendeurNom || "-"}</TableCell>
                          <TableCell>{getStatusBadge(order.etat) || "-"}</TableCell>
                          <TableCell>{order?.createdAt.split("T")[0]}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
                                  <span className="sr-only">Ouvrir le menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    toast.success(`Détails du panier #${order.id}`);
                                    console.log(order);
                                  }}
                                >
                                  <Package2 className="mr-2 h-4 w-4" />
                                  Voir les détails
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Aucun panier trouvé.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showDelivererDetails} onOpenChange={setShowDelivererDetails}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Détails du livreur</DialogTitle>
            <DialogDescription>Informations complètes sur le livreur</DialogDescription>
          </DialogHeader>
          {selectedDeliverer && (
            <div className="py-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <UserCircle className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold">
                      {selectedDeliverer.prenom} {selectedDeliverer.nom}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Mail className="h-4 w-4 mr-1" />
                      {selectedDeliverer.email}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Coordonnées</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{selectedDeliverer.telephone || "Non renseigné"}</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-blue-600 mt-0.5" />
                        <span>{selectedDeliverer.adresse || "Non renseigné"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Moyen de déplacement</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <span>{selectedDeliverer.moyenDeplacement || "Non défini"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelivererDetails(false)} disabled={loading}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDeliverer} onOpenChange={setShowEditDeliverer}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le livreur</DialogTitle>
            <DialogDescription>Modifiez les informations du livreur ci-dessous.</DialogDescription>
          </DialogHeader>
          {selectedDeliverer && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="moyenDeplacement">Moyen de déplacement</Label>
                <Select
                  value={selectedDeliverer.moyenDeplacement}
                  onValueChange={(value) =>
                    setSelectedDeliverer({ ...selectedDeliverer, moyenDeplacement: value })
                  }
                  disabled={loading}
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
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDeliverer(false)} disabled={loading}>
              Annuler
            </Button>
            <Button onClick={handleEditDeliverer} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer les modifications"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDeliverer} onOpenChange={setShowDeleteDeliverer}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer le livreur</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce livreur ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDeliverer(false)} disabled={loading}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteDeliverer} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}