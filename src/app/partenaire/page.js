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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus, Search, Edit, Trash, Building, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner"; // Ajout pour les notifications

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentPartner, setCurrentPartner] = useState(null);
  const [addFormData, setAddFormData] = useState({
    email: "",
    nom: "",
    prenom: "",
    telephone: "",
    adresse: "",
    longitude: 0,
    latitude: 0,
  });
  const [editFormData, setEditFormData] = useState({
    id: null,
    email: "",
    nom: "",
    prenom: "",
    telephone: "",
    adresse: "",
    longitude: 0,
    latitude: 0,
  });
  const [loading, setLoading] = useState(false); // Nouvel état pour le chargement

  const fetchPartners = async () => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("username");
    setLoading(true); // Début du chargement
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/partenaires/liste?username=${id}`,
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
      setPartners(data.data || []);
      console.log("Partners fetched:", data.data);
    } catch (err) {
      console.error("Error fetching partners:", err.message);
      toast.error("Erreur lors de la récupération des partenaires");
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const filteredPartners = partners.filter(
    (partner) =>
      partner?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner?.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    setLoading(true); // Début du chargement
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/partenaires/delete/${id}`,
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

      await fetchPartners(); // Rafraîchir la liste
      toast.success("Partenaire supprimé avec succès");
    } catch (err) {
      console.error("Error deleting partner:", err.message);
      toast.error("Erreur lors de la suppression du partenaire");
      await fetchPartners();
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  const handleAdd = () => {
    setAddFormData({
      email: "",
      nom: "",
      prenom: "",
      telephone: "",
      adresse: "",
      longitude: 0,
      latitude: 0,
    });
    setShowAddForm(true);
  };

  const handleEdit = (partner) => {
    setCurrentPartner(partner);
    setEditFormData({
      id: partner.id,
      email: partner.email,
      nom: partner.nom,
      prenom: partner.prenom,
      telephone: partner.telephone,
      adresse: partner.adresse,
      longitude: partner.longitude,
      latitude: partner.latitude,
    });
    setShowEditForm(true);
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddFormData({
      ...addFormData,
      [name]:
        name === "longitude" || name === "latitude"
          ? parseFloat(value) || 0
          : value,
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]:
        name === "longitude" || name === "latitude"
          ? parseFloat(value) || 0
          : value,
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (
      !addFormData.email ||
      !addFormData.nom ||
      !addFormData.prenom ||
      !addFormData.telephone ||
      !addFormData.adresse
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const token = localStorage.getItem("token");
    const adminId = localStorage.getItem("logedUserId") || 2;

    const partnerToSend = {
      ...addFormData,
      adminId: adminId,
    };

    setLoading(true); // Début du chargement
    try {
      const response = await fetch(`http://195.35.24.128:8081/api/partenaires/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(partnerToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      await fetchPartners(); // Rafraîchir la liste
      toast.success(data.message);
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding partner:", err.message);
      toast.error("Erreur lors de l'ajout du partenaire");
      await fetchPartners();
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (
      !editFormData.email ||
      !editFormData.nom ||
      !editFormData.prenom ||
      !editFormData.telephone ||
      !editFormData.adresse
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const token = localStorage.getItem("token");
    const adminId = localStorage.getItem("logedUserId") || 2;

    const partnerToSend = {
      ...editFormData,
      adminId: adminId,
    };

    setLoading(true); // Début du chargement
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/partenaires/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(partnerToSend),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      await fetchPartners(); // Rafraîchir la liste
      toast.success(data.message);
      setShowEditForm(false);
    } catch (err) {
      console.error("Error updating partner:", err.message);
      toast.error("Erreur lors de la mise à jour du partenaire");
      await fetchPartners();
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  return (
    <div className="space-y-6">
      <Toaster /> {/* Ajout pour afficher les notifications */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            <span className="text-gray-600">Traitement en cours...</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Partenaires</h1>
        <Button className="flex items-center gap-2" onClick={handleAdd} disabled={loading}>
          <Plus size={16} /> Ajouter un partenaire
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            <span>Partenaires</span>
          </CardTitle>
          <CardDescription>
            Gérez tous les partenaires que vous avez créés et administrés.
          </CardDescription>

          <div className="mt-4 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un partenaire..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.length > 0 ? (
                filteredPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">{partner.id}</TableCell>
                    <TableCell>{partner.nom}</TableCell>
                    <TableCell>{partner.prenom}</TableCell>
                    <TableCell>{partner.email}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {partner.adresse}
                    </TableCell>
                    <TableCell>{partner.telephone}</TableCell>
                    <TableCell>{partner.createdAt.split("T")[0]}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(partner)}
                          disabled={loading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(partner.id)}
                          disabled={loading}
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
                    Aucun partenaire trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t py-4 bg-gray-50">
          <div className="text-sm text-gray-500">
            Affichage de {filteredPartners.length} partenaires sur{" "}
            {partners.length} au total
          </div>
        </CardFooter>
      </Card>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  <span>Ajouter un partenaire</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddForm(false)}
                  disabled={loading}
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardTitle>
              <CardDescription>
                Remplissez le formulaire pour ajouter un nouveau partenaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={addFormData.nom}
                      onChange={handleAddFormChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input
                      id="prenom"
                      name="prenom"
                      value={addFormData.prenom}
                      onChange={handleAddFormChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={addFormData.email}
                      onChange={handleAddFormChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input
                      id="adresse"
                      name="adresse"
                      value={addFormData.adresse}
                      onChange={handleAddFormChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      value={addFormData.telephone}
                      onChange={handleAddFormChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      value={addFormData.longitude}
                      onChange={handleAddFormChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      value={addFormData.latitude}
                      onChange={handleAddFormChange}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    disabled={loading}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ajouter"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  <span>Modifier le partenaire</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowEditForm(false)}
                  disabled={loading}
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardTitle>
              <CardDescription>
                Modifiez les informations du partenaire existant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={editFormData.nom}
                      onChange={handleEditFormChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input
                      id="prenom"
                      name="prenom"
                      value={editFormData.prenom}
                      onChange={handleEditFormChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={editFormData.email}
                      onChange={handleEditFormChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input
                      id="adresse"
                      name="adresse"
                      value={editFormData.adresse}
                      onChange={handleEditFormChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      value={editFormData.telephone}
                      onChange={handleEditFormChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      value={editFormData.longitude}
                      onChange={handleEditFormChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      value={editFormData.latitude}
                      onChange={handleEditFormChange}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    disabled={loading}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mettre à jour"}
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

export default Partners;