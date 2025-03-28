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
  AlertTriangle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Advertisements = () => {
  const [ads, setAds] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    intitule: "",
    description: "",
    media: null,
    mediaPath: "",
    dateDebut: new Date(),
    dateFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");

  useEffect(() => {
    const fetchAds = async () => {
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `http://195.35.24.128:8081/api/pubs/liste?username=${username}`,
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
        const validAds = (data.data || []).filter(ad => ad && ad.id);
        setAds(validAds);
        toast.success("Publicités chargées avec succès");
      } catch (err) {
        console.error("Error fetching ads:", err.message);
        toast.error("Erreur lors de la récupération des publicités");
      }
    };

    fetchAds();
  }, []);

  const handleAddNewAd = () => {
    setFormData({
      id: null,
      intitule: "",
      description: "",
      media: null,
      mediaPath: "",
      dateDebut: new Date(),
      dateFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    setStartTime("00:00");
    setEndTime("23:59");
    setIsEditing(true);
  };

  const handleEditAd = (ad) => {
    if (!ad || !ad.id) return;
    const debut = ad.dateDebut ? new Date(ad.dateDebut) : new Date();
    const fin = ad.dateFin ? new Date(ad.dateFin) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    setFormData({
      id: ad.id,
      intitule: ad.intitule || "",
      description: ad.description || "",
      media: null,
      mediaPath: ad.mediaPath || "",
      dateDebut: debut,
      dateFin: fin,
    });
    setStartTime(ad.dateDebut ? format(new Date(ad.dateDebut), "HH:mm") : "00:00");
    setEndTime(ad.dateFin ? format(new Date(ad.dateFin), "HH:mm") : "23:59");
    setIsEditing(true);
  };

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/pubs/delete/${adToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      setAds(ads.filter((ad) => ad.id !== adToDelete.id));
      setAdToDelete(null);
      toast.success("Publicité supprimée avec succès");
    } catch (err) {
      console.error("Error deleting ad:", err.message);
      toast.error("Erreur lors de la suppression de la publicité");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      media: e.target.files[0],
    });
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

  const handleCreateAd = async () => {
    const token = localStorage.getItem("token");
    const acteurId = localStorage.getItem("logedUserId") || 2;

    const formDataToSend = new FormData();
    formDataToSend.append("acteurId", acteurId);
    formDataToSend.append("intitule", formData.intitule);
    formDataToSend.append("description", formData.description);
    if (formData.media) formDataToSend.append("media", formData.media);
    formDataToSend.append("dateDebut", formData.dateDebut.toISOString());
    formDataToSend.append("dateFin", formData.dateFin.toISOString());

    console.log("Form data to send (create):", Object.fromEntries(formDataToSend.entries()));

    try {
      const response = await fetch(`http://195.35.24.128:8081/api/pubs/new`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      console.log("Response status (create):", response);


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || "Unknown error"}`);
      }
      console.log("Response status (create):", response);
      const data = await response.json();
      console.log("API response (create):", data);
      const newAd = data.data;

      if (!newAd || !newAd.id) {
        throw new Error("La réponse de l'API est invalide ou incomplète");
      }

      setAds([...ads, newAd]);
      toast.success("Nouvelle publicité ajoutée avec succès");
      setIsEditing(false);
    } catch (err) {
      console.error("Error creating ad:", err.message);
      toast.error(`Erreur lors de l'ajout de la publicité: ${err.message}`);
    }
  };

  const handleUpdateAd = async () => {
    const token = localStorage.getItem("token");

    const formDataToSend = new FormData();
    formDataToSend.append("id", formData.id);
    formDataToSend.append("intitule", formData.intitule);
    formDataToSend.append("description", formData.description);
    if (formData.media) formDataToSend.append("media", formData.media);
    formDataToSend.append("dateDebut", formData.dateDebut.toISOString());
    formDataToSend.append("dateFin", formData.dateFin.toISOString());

    console.log("Form data to send (update):", Object.fromEntries(formDataToSend.entries()));

    try {
      const response = await fetch(`http://195.35.24.128:8081/api/pubs/update/${formData.id}`, {
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
      console.log("API response (update):", data);
      const updatedAd = data.data;

      if (!updatedAd || !updatedAd.id) {
        throw new Error("La réponse de l'API est invalide ou incomplète");
      }

      setAds(ads.map((ad) => (ad.id === updatedAd.id ? updatedAd : ad)));
      toast.success("Publicité mise à jour avec succès");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating ad:", err.message);
      toast.error(`Erreur lors de la mise à jour de la publicité: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.intitule || !formData.description) {
      toast.error("Veuillez remplir tous les champs obligatoires (intitulé et description)");
      return;
    }

    if (formData.dateDebut > formData.dateFin) {
      toast.error("La date de début doit être antérieure à la date de fin");
      return;
    }

    if (formData.id) {
      await handleUpdateAd();
    } else {
      await handleCreateAd();
    }
  };

  const isActive = (ad) => {
    if (!ad || !ad.dateDebut || !ad.dateFin) return false;
    const now = new Date();
    return new Date(ad.dateDebut) <= now && new Date(ad.dateFin) >= now;
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
                <TableHead>Intitulé</TableHead>
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
                ads.map((ad) =>
                  ad ? (
                    <TableRow key={ad.id}>
                      <TableCell className="font-medium">{ad.id}</TableCell>
                      <TableCell>{ad.intitule || "-"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{ad.description || "-"}</TableCell>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md bg-gray-100 overflow-hidden">
                          <img
                            src={ad.mediaPath ? `http://195.35.24.128:8081${ad.mediaPath}` : "/placeholder.svg"}
                            alt={ad.intitule || "Publicité"}
                            className="h-full w-full object-cover"
                            // onError={(e) => (e.target.src = "/placeholder.svg")}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        {ad.dateDebut ? format(new Date(ad.dateDebut), "dd/MM/yyyy HH:mm") : "-"}
                      </TableCell>
                      <TableCell>
                        {ad.dateFin ? format(new Date(ad.dateFin), "dd/MM/yyyy HH:mm") : "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            isActive(ad)
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          )}
                        >
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
                  ) : null
                )
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
                    <Label htmlFor="intitule">Intitulé</Label>
                    <Input
                      id="intitule"
                      name="intitule"
                      placeholder="Promotion spéciale"
                      value={formData.intitule}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="media">Image</Label>
                    <Input
                      id="media"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {formData.mediaPath && !formData.media && (
                      <div className="mt-2">
                        <img
                          src={`http://195.35.24.128:8081${formData.mediaPath}`}
                          alt="Prévisualisation"
                          className="h-20 w-20 object-cover rounded-md"
                          // onError={(e) => (e.target.src = "/placeholder.svg")}
                        />
                        <p className="text-sm text-gray-500">Image actuelle</p>
                      </div>
                    )}
                    {formData.media && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(formData.media)}
                          alt="Prévisualisation"
                          className="h-20 w-20 object-cover rounded-md"
                        />
                        <p className="text-sm text-gray-500">Nouvelle image sélectionnée</p>
                      </div>
                    )}
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
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => handleTimeChange("startTime", e.target.value)}
                        className="w-24"
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
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => handleTimeChange("endTime", e.target.value)}
                        className="w-24"
                      />
                    </div>
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

      <AlertDialog open={adToDelete !== null} onOpenChange={() => setAdToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la publicité "{adToDelete?.intitule || "Sans titre"}" ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Advertisements;