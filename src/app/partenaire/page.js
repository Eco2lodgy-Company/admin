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
import { Users, Plus, Search, Edit, Trash, Building, X } from "lucide-react";
import { toast } from "sonner";

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

  // Fetch partners from the API
  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("username");
    console.log("Token:", token);
    console.log("id:", id);

    const fetchPartners = async () => {
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
        toast.success("Partenaires chargés avec succès");
      } catch (err) {
        console.error("Error fetching partners:", err.message);
        toast.error("Erreur lors de la récupération des partenaires");
      }
    };

    fetchPartners();
  }, []);

  const filteredPartners = partners.filter(
    (partner) =>
      partner?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner?.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    console.log("ID:", id);

    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/partenaires/delete?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setPartners(partners.filter((partner) => partner.id !== id));
      toast.success("Partenaire supprimé avec succès");
    } catch (err) {
      console.error("Error deleting partner:", err.message);
      toast.error("Erreur lors de la suppression du partenaire");
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
    console.log("Partner to send:", partnerToSend);

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
      setPartners([...partners, data.data]);
      toast.success(`Partenaire ${addFormData.nom} ajouté avec succès`);
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding partner:", err.message);
      toast.error("Erreur lors de l'ajout du partenaire");
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
      const updatedPartners = partners.map((partner) =>
        partner.id === editFormData.id ? data.data : partner
      );
      setPartners(updatedPartners);
      toast.success(`Partenaire ${editFormData.nom} modifié avec succès`);
      setShowEditForm(false);
    } catch (err) {
      console.error("Error updating partner:", err.message);
      toast.error("Erreur lors de la mise à jour du partenaire");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Partenaires</h1>
        <Button className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={16} /> Ajouter un partenaire
        </Button>
      </div>

      {/* Carte principale avec tableau des partenaires */}
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
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(partner.id)}
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

      {/* Overlay et formulaire d'ajout */}
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
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowAddForm(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">Ajouter</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overlay et formulaire de modification */}
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
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowEditForm(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">Mettre à jour</Button>
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