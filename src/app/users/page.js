"use client";
import { Toaster } from "@/components/ui/sonner";
import React, { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [isEnableUserOpen, setIsEnableUserOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({
    email: "",
    nom: "",
    prenom: "",
    telephone: "",
    adresse: "",
    role: "Client",
    password: "ShopByNoor",
    confirmPassword: "ShopByNoor",
  });
  const [loading, setLoading] = useState(false);

  const formatRole = (role) => {
    switch (role) {
      case "ADMIN":
        return "Administrateur";
      case "LIVREUR":
        return "Livreur";
      case "VENDEUR":
        return "Vendeur";
      case "CLIENT":
        return "Client";
      default:
        return role;
    }
  };

  const formatRoleForDB = (role) => {
    switch (role) {
      case "Administrateur":
        return "ADMIN";
      case "Livreur":
        return "LIVREUR";
      case "Vendeur":
        return "VENDEUR";
      case "Client":
        return "CLIENT";
      default:
        return role;
    }
  };

  const fetchUsers = async () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    setLoading(true);
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
      setFilteredUsers(data.data);
    } catch (err) {
      console.error("Error fetching users:", err.message);
      toast.error("Erreur lors de la récupération des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterUsers(query, roleFilter);
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    filterUsers(searchQuery, role);
  };

  const filterUsers = (query, role) => {
    let filtered = users;

    if (query) {
      filtered = filtered.filter(
        (user) =>
          user?.email?.toLowerCase().includes(query) ||
          user?.nom?.toLowerCase().includes(query) ||
          user?.prenom?.toLowerCase().includes(query)
      );
    }

    if (role && role !== "all") {
      filtered = filtered.filter((user) => user?.role === role);
    }

    setFilteredUsers(filtered);
  };

  const handleAddUser = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    const formData = new FormData();
    formData.append("email", newUser.email);
    formData.append("nom", newUser.nom);
    formData.append("prenom", newUser.prenom);
    formData.append("telephone", newUser.telephone);
    formData.append("adresse", newUser.adresse);
    formData.append("role", newUser.role);
    formData.append("password", newUser.password);
    formData.append("confirmPassword", newUser.confirmPassword);

    try {
      const response = await fetch(`http://195.35.24.128:8081/api/user/new`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      await fetchUsers();
      toast.success(data.message);
    } catch (err) {
      console.error("Error adding user:", err.message);
      toast.error("Erreur lors de l'ajout de l'utilisateur");
    } finally {
      setLoading(false);
      setIsAddUserOpen(false);
      setNewUser({
        email: "",
        nom: "",
        prenom: "",
        telephone: "",
        adresse: "",
        role: "Client",
        password: "ShopByNoor",
        confirmPassword: "ShopByNoor",
      });
    }
  };

  const handleEditUser = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(`http://195.35.24.128:8081/api/user/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({currentUser}),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      await fetchUsers();
      toast.success(data.message);
    } catch (err) {
      console.error("Error updating user:", err.message);
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
    } finally {
      setLoading(false);
      setIsEditUserOpen(false);
      setCurrentUser(null);
    }
  };

  const handleEnableUser = async () => {
    if (!currentUser) return;
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/user/enable?username=${currentUser.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(currentUser),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      await fetchUsers();
      toast.success(data.message);
    } catch (err) {
      console.error("Error enabling user:", err.message);
      toast.error("Erreur lors de l'activation de l'utilisateur");
    } finally {
      setLoading(false);
      setIsEnableUserOpen(false);
      setCurrentUser(null);
    }
  };

  const handleDisableUser = async () => {
    if (!currentUser) return;
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/user/disable?username=${currentUser.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(currentUser),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      await fetchUsers();
      toast.success(data.message);
    } catch (err) {
      console.error("Error disabling user:", err.message);
      toast.error("Erreur lors de la désactivation de l'utilisateur");
    } finally {
      setLoading(false);
      setIsDeleteUserOpen(false);
      setCurrentUser(null);
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

  const getRoleBadge = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "VENDEUR":
        return "bg-blue-100 text-blue-800";
      case "LIVREUR":
        return "bg-green-100 text-green-800";
      case "CLIENT":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case "ADMIN":
        return "Administrateur";
      case "VENDEUR":
        return "Vendeur";
      case "LIVREUR":
        return "Livreur";
      case "CLIENT":
        return "Client";
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
      </div>
      <Toaster />
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            <span className="text-gray-600">Traitement en cours...</span>
          </div>
        </div>
      )}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Liste des utilisateurs</CardTitle>
              <CardDescription>
                {filteredUsers?.length || 0} utilisateur{filteredUsers?.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-8 w-full sm:w-[260px]"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <Select value={roleFilter} onValueChange={handleRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="ADMIN">Administrateurs</SelectItem>
                  <SelectItem value="VENDEUR">Vendeurs</SelectItem>
                  <SelectItem value="LIVREUR">Livreurs</SelectItem>
                  <SelectItem value="CLIENT">Clients</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto" disabled={loading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Ajouter un utilisateur</DialogTitle>
                    <DialogDescription>Créer un nouvel utilisateur dans le système</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">Rôle</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                      >
                        <SelectTrigger id="role" className="col-span-3">
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Administrateur">Administrateur</SelectItem>
                          <SelectItem value="Vendeur">Vendeur</SelectItem>
                          <SelectItem value="Livreur">Livreur</SelectItem>
                          <SelectItem value="Client">Client</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="first_name" className="text-right">Prénom</Label>
                      <Input
                        id="first_name"
                        className="col-span-3"
                        value={newUser.prenom}
                        onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="last_name" className="text-right">Nom</Label>
                      <Input
                        id="last_name"
                        className="col-span-3"
                        value={newUser.nom}
                        onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        className="col-span-3"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">Mot de passe</Label>
                      <Input
                        id="password"
                        type="password"
                        className="col-span-3"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="confirmPassword" className="text-right">Confirmer Mot de passe</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="col-span-3"
                        value={newUser.confirmPassword}
                        onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tel" className="text-right">Téléphone</Label>
                      <Input
                        id="tel"
                        className="col-span-3"
                        value={newUser.telephone}
                        onChange={(e) => setNewUser({ ...newUser, telephone: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="address" className="text-right">Adresse</Label>
                      <Input
                        id="address"
                        className="col-span-3"
                        value={newUser.adresse}
                        onChange={(e) => setNewUser({ ...newUser, adresse: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddUserOpen(false)} disabled={loading}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddUser} disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ajouter"}
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
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.nom} {user.prenom}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-semibold",
                            getRoleBadge(user.role)
                          )}
                        >
                          {getRoleName(user.role)}
                        </span>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.telephone || "-"}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>{user.status ? "Actif" : "Inactif"}</TableCell>
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
                                setCurrentUser(user);
                                setIsEditUserOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentUser(user);
                                setIsEnableUserOpen(true);
                              }}
                              className="text-green-600"
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentUser(user);
                                setIsDeleteUserOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Désactiver
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Aucun utilisateur trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen && currentUser !== null} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>Mettre à jour les informations de l'utilisateur</DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">Rôle</Label>
                <Select
                  value={getRoleName(currentUser.role)}
                  onValueChange={(value) => setCurrentUser({ ...currentUser, role: value })}
                  required
                >
                  <SelectTrigger id="edit-role" className="col-span-3">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrateur">Administrateur</SelectItem>
                    <SelectItem value="Vendeur">Vendeur</SelectItem>
                    <SelectItem value="Livreur">Livreur</SelectItem>
                    <SelectItem value="Client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-first-name" className="text-right">Prénom</Label>
                <Input
                  id="edit-first-name"
                  className="col-span-3"
                  value={currentUser.prenom || ""}
                  onChange={(e) => setCurrentUser({ ...currentUser, prenom: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-last-name" className="text-right">Nom</Label>
                <Input
                  id="edit-last-name"
                  className="col-span-3"
                  value={currentUser.nom || ""}
                  onChange={(e) => setCurrentUser({ ...currentUser, nom: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  className="col-span-3"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-tel" className="text-right">Téléphone</Label>
                <Input
                  id="edit-tel"
                  className="col-span-3"
                  value={currentUser.telephone || ""}
                  onChange={(e) => setCurrentUser({ ...currentUser, telephone: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">Adresse</Label>
                <Input
                  id="edit-address"
                  className="col-span-3"
                  value={currentUser.adresse || ""}
                  onChange={(e) => setCurrentUser({ ...currentUser, adresse: e.target.value })}
                  required
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)} disabled={loading}>
              Annuler
            </Button>
            <Button onClick={handleEditUser} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Désactiver l'utilisateur</DialogTitle>
            <DialogDescription>Êtes-vous sûr de vouloir désactiver cet utilisateur ?</DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="py-4">
              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserCircle className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">
                    {currentUser.prenom} {currentUser.nom}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-3 w-3 mr-1" />
                    {currentUser.email}
                  </div>
                  {currentUser.telephone && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-3 w-3 mr-1" />
                      {currentUser.telephone}
                    </div>
                  )}
                  {currentUser.adresse && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {currentUser.adresse}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserOpen(false)} disabled={loading}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDisableUser} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Désactiver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enable User Dialog */}
      <Dialog open={isEnableUserOpen} onOpenChange={setIsEnableUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Activer l'utilisateur</DialogTitle>
            <DialogDescription>Êtes-vous sûr de vouloir activer cet utilisateur ?</DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="py-4">
              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserCircle className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">
                    {currentUser.prenom} {currentUser.nom}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-3 w-3 mr-1" />
                    {currentUser.email}
                  </div>
                  {currentUser.telephone && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-3 w-3 mr-1" />
                      {currentUser.telephone}
                    </div>
                  )}
                  {currentUser.adresse && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {currentUser.adresse}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEnableUserOpen(false)} disabled={loading}>
              Annuler
            </Button>
            <Button onClick={handleEnableUser} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Activer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}