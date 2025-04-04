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
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter
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
  Percent,
  Save,
  AlertTriangle,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    intitule: "",
    description: "",
    reduction: "",
    dateDebut: new Date(),
    dateFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: true, // Initialisé à true par défaut
    acteurId: 2,
    image: null,
  });
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    const username = localStorage.getItem("username") || "asaleydiori@gmail.com";
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/promotions/livraison/liste?username=${username}`,
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
      const validPromos = (data.data || []).filter((promo) => promo && promo.id);
      setPromotions(validPromos);
      console.log("Promotions fetched:", validPromos);  
    } catch (err) {
      console.error("Error fetching promotions:", err.message);
      toast.error("Erreur lors de la récupération des promotions");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewPromo = () => {
    setFormData({
      id: null,
      intitule: "",
      description: "",
      reduction: "",
      dateDebut: new Date(),
      dateFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: true, // Par défaut actif pour une nouvelle promo
      acteurId: 2,
      image: null,
    });
    setStartTime("00:00");
    setEndTime("23:59");
    setIsEditing(true);
  };

  const handleEditPromo = (promo) => {
    if (!promo || !promo.id) return;
    const debut = promo.promotionDateDebut ? new Date(promo.promotionDateDebut) : new Date();
    const fin = promo.promotionDateFin ? new Date(promo.promotionDateFin) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    setFormData({
      id: promo.id,
      intitule: promo.intitule || "",
      description: promo.description || "",
      reduction: promo.reduction || "",
      dateDebut: debut,
      dateFin: fin,
      status: promo.promotionStatus ?? true, // Récupère le statut actuel
      acteurId: 2,
      image: promo.image || null,
    });
    setStartTime(promo.promotionDateDebut ? format(new Date(promo.promotionDateDebut), "HH:mm") : "00:00");
    setEndTime(promo.promotionDateFin ? format(new Date(promo.promotionDateFin), "HH:mm") : "23:59");
    setIsEditing(true);
  };

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/promotions/livraison/delete/${promoToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      setPromotions(promotions.filter((promo) => promo.id !== promoToDelete.id));
      setPromoToDelete(null);
      toast.success("Promotion supprimée avec succès");
      await fetchPromotions();
    } catch (err) {
      console.error("Error deleting promotion:", err.message);
      toast.error("Erreur lors de la suppression de la promotion");
      await fetchPromotions();
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setFormData({
        ...formData,
        image: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleDateChange = (field, date) => {
    const time = field === "dateDebut" ? startTime : endTime;
    const [hours, minutes] = time.split(":");
    date.setHours(parseInt(hours), parseInt(minutes));
    setFormData({
      ...formData,
      [field]: date,
    });
  };

  const handleTimeChange = (field, value) => {
    const [hours, minutes] = value.split(":");
    const dateField = field === "startTime" ? "dateDebut" : "dateFin";
    const newDate = new Date(formData[dateField]);
    newDate.setHours(parseInt(hours), parseInt(minutes));
    setFormData({
      ...formData,
      [dateField]: newDate,
    });
    if (field === "startTime") setStartTime(value);
    else setEndTime(value);
  };

  const handleToggleStatus = () => {
    setFormData({
      ...formData,
      status: !formData.status,
    });
  };

  const handleCreatePromo = async () => {
    const token = localStorage.getItem("token");
    const formDataToSend = new FormData();
    formDataToSend.append("intitule", formData.intitule);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("reduction", parseInt(formData.reduction, 10));
    formDataToSend.append("acteurId", formData.acteurId);
    formDataToSend.append("dateDebut", formData.dateDebut.toISOString());
    formDataToSend.append("dateFin", formData.dateFin.toISOString());
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    setLoading(true);
    try {
      const response = await fetch(`http://195.35.24.128:8081/api/promotions/livraison/new`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || "Unknown error"}`);
      }
      const data = await response.json();
      const newPromo = data.data;

      setPromotions([...promotions, newPromo]);
      toast.success(data.message);
      setIsEditing(false);
      await fetchPromotions();
    } catch (err) {
      console.error("Error creating promotion:", err.message);
      toast.error(`Erreur lors de l'ajout de la promotion: ${err.message}`);
      await fetchPromotions();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePromo = async () => {
    const token = localStorage.getItem("token");
    const formDataToSend = new FormData();
    formDataToSend.append("id", formData.id);
    formDataToSend.append("intitule", formData.intitule);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("reduction", parseInt(formData.reduction, 10));
    formDataToSend.append("status", formData.status); // Inclus uniquement lors de la modification
    formDataToSend.append("acteurId", formData.acteurId);
    formDataToSend.append("dateDebut", formData.dateDebut.toISOString());
    formDataToSend.append("dateFin", formData.dateFin.toISOString());
    if (formData.image && formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    }
console.log("FormData to send:", Object.fromEntries(formDataToSend.entries()));
    setLoading(true);
    try {
      const response = await fetch(`http://195.35.24.128:8081/api/promotions/livraison/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || "Unknown error"}`);
      }

      const data = await response.json();
      const updatedPromo = data.data;

      toast.success("Promotion mise à jour avec succès");
      setIsEditing(false);
      await fetchPromotions();
    } catch (err) {
      console.error("Error updating promotion:", err.message);
      toast.error(`Erreur lors de la mise à jour de la promotion: ${err.message}`);
      await fetchPromotions();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.intitule || !formData.description || !formData.reduction) {
      toast.error("Veuillez remplir tous les champs obligatoires (intitulé, description, réduction)");
      return;
    }

    if (formData.dateDebut > formData.dateFin) {
      toast.error("La date de début doit être antérieure à la date de fin");
      return;
    }

    if (formData.id) {
      await handleUpdatePromo();
    } else {
      await handleCreatePromo();
    }
  };

  const isActive = (promo) => {
    // if (!promo || !promo.promotionDateDebut || !promo.promotionDateFin) return false;
    // const now = new Date();
    // return new Date(promo.promotionDateDebut) <= now && new Date(promo.promotionDateFin) >= now && promo.promotionStatus;
    return promo && promo.promotionStatus;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            <span className="text-gray-600">Traitement en cours...</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Promotions</h1>
          <p className="text-gray-500 mt-1">Programmez et gérez vos promotions</p>
        </div>
        <Button onClick={handleAddNewPromo} className="flex items-center gap-2" disabled={loading}>
          <Plus size={16} />
          <span>Ajouter une promotion</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            <span>Promotions</span>
          </CardTitle>
          <CardDescription>
            Toutes vos promotions passées, présentes et futures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Intitulé</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Réduction</TableHead>
                <TableHead>Date de début</TableHead>
                <TableHead>Date de fin</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.length > 0 ? (
                promotions.map((promo) =>
                  promo ? (
                    <TableRow key={promo.id}>
                      <TableCell className="font-medium">{promo.id}</TableCell>
                      <TableCell>{promo.intitule || "-"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{promo.description || "-"}</TableCell>
                      <TableCell>{promo.reduction ? `${promo.reduction}%` : "-"}</TableCell>
                      <TableCell>
                        {promo.promotionDateDebut ? format(new Date(promo.promotionDateDebut), "dd/MM/yyyy HH:mm") : "-"}
                      </TableCell>
                      <TableCell>
                        {promo.promotionDateFin ? format(new Date(promo.promotionDateFin), "dd/MM/yyyy HH:mm") : "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            isActive(promo)
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          )}
                        >
                          {isActive(promo) ? "Actif" : "Inactif"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditPromo(promo)} disabled={loading}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setPromoToDelete(promo)}
                            disabled={loading}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    Aucune promotion définie
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t py-4 bg-gray-50">
          <div className="text-sm text-gray-500">
            {promotions.length} promotions configurées
          </div>
        </CardFooter>
      </Card>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Percent size={20} />
                  <span>{formData.id ? "Modifier la promotion" : "Ajouter une nouvelle promotion"}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)} disabled={loading}>
                  <X size={18} />
                </Button>
              </CardTitle>
              <CardDescription>
                Configurez les détails et la durée de votre promotion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="intitule">Intitulé</Label>
                    <Input
                      id="intitule"
                      name="intitule"
                      placeholder="ex: SUMMER2025"
                      value={formData.intitule}
                      onChange={handleFormChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reduction">Réduction (%)</Label>
                    <Input
                      id="reduction"
                      name="reduction"
                      type="number"
                      placeholder="ex: 15"
                      value={formData.reduction}
                      onChange={handleFormChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Décrivez votre promotion"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows={3}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="image">Image de la promotion</Label>
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFormChange}
                      disabled={loading}
                    />
                    {formData.image && typeof formData.image === "string" && (
                      <div className="mt-2">
                        <img
                          src={formData.image}
                          alt="Aperçu de l'image"
                          className="h-20 w-20 object-cover rounded"
                        />
                      </div>
                    )}
                    {formData.image && formData.image instanceof File && (
                      <div className="mt-2 text-sm text-gray-500">
                        Fichier sélectionné : {formData.image.name}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Date et heure de début</Label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.dateDebut && "text-muted-foreground"
                            )}
                            disabled={loading}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.dateDebut ? format(formData.dateDebut, "PPP") : <span>Choisir une date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.dateDebut}
                            onSelect={(date) => handleDateChange("dateDebut", date)}
                            initialFocus
                            className="pointer-events-auto"
                            disabled={loading}
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => handleTimeChange("startTime", e.target.value)}
                        className="w-24"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Date et heure de fin</Label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.dateFin && "text-muted-foreground"
                            )}
                            disabled={loading}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.dateFin ? format(formData.dateFin, "PPP") : <span>Choisir une date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.dateFin}
                            onSelect={(date) => handleDateChange("dateFin", date)}
                            initialFocus
                            className="pointer-events-auto"
                            disabled={loading}
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => handleTimeChange("endTime", e.target.value)}
                        className="w-24"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  {/* Champ Status visible uniquement en mode édition */}
                  {formData.id && (
                    <div className="space-y-2 md:col-span-2 flex items-center">
                      <Label className="mr-4">Statut</Label>
                      <Button
                        type="button"
                        variant={formData.status ? "default" : "outline"}
                        onClick={handleToggleStatus}
                        className="mr-4"
                        disabled={loading}
                      >
                        {formData.status ? "Actif" : "Inactif"}
                      </Button>
                      <span className="text-sm text-gray-500">
                        Définissez si la promotion doit être active ou inactive
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={loading}>
                    Annuler
                  </Button>
                  <Button type="submit" className="flex items-center gap-2" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
                    {formData.id ? "Mettre à jour" : "Ajouter"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <AlertDialog open={promoToDelete !== null} onOpenChange={() => setPromoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la promotion "{promoToDelete?.intitule || "Sans titre"}" ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Promotions;