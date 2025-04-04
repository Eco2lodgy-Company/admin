"use client";
import { Toaster } from "@/components/ui/sonner";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User,
  Lock,
  Settings as SettingsIcon,
  X,
  Loader2, // Ajout de Loader2 pour les spinners
} from "lucide-react";

const Settings = () => {
  const [profileData, setProfileData] = useState({
    id: 0,
    email: "",
    nom: "",
    prenom: "",
    telephone: "",
    adresse: "",
    longitude: "",
    latitude: "",
    role: "",
  });

  const [passwordData, setPasswordData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(false); // Ajout de l'état loading

  // Fetch profile data on component mount
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    setLoading(true); // Début du chargement
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/user/findByUsername?email=${username}`,
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
      setProfileData({
        id: data.data.id || 0,
        email: data.data.email || "",
        nom: data.data.nom || "",
        prenom: data.data.prenom || "",
        telephone: data.data.telephone || "",
        adresse: data.data.adresse || "",
        longitude: data.data.longitude || "",
        latitude: data.data.latitude || "",
        role: "Administrateur",
      });
      // toast.success(data.message); // Commenté car non utilisé ici
    } catch (err) {
      console.error("Error fetching profile:", err.message);
      toast.error("Erreur lors de la récupération du profil");
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log("editing", profileData);
    setLoading(true); // Début du chargement
    try {
      const response = await fetch(`http://195.35.24.128:8081/api/user/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || "Unknown error"}`);
      }

      const data = await response.json(); // Récupérer la réponse
      toast.success(data.message || "Profil mis à jour avec succès"); // Utilisation de data.message
      setIsEditingProfile(false);
      await fetchProfile();
    } catch (err) {
      console.error("Error updating profile:", err.message);
      toast.error(`Erreur lors de la mise à jour du profil: ${err.message}`);
      await fetchProfile();
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    const token = localStorage.getItem("token");

    const passwordPayload = {
      email: profileData.email, // Utilise l'email du profil chargé
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword,
      confirmNewPassword: passwordData.confirmNewPassword,
    };

    setLoading(true); // Début du chargement
    try {
      const response = await fetch(`http://195.35.24.128:8081/api/user/changePassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || "Unknown error"}`);
      }

      const data = await response.json(); // Récupérer la réponse
      toast.success(data.message || "Mot de passe mis à jour avec succès"); // Utilisation de data.message
      setPasswordData({
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      await fetchProfile();
    } catch (err) {
      console.error("Error changing password:", err.message);
      toast.error(`Erreur lors du changement de mot de passe: ${err.message}`);
      await fetchProfile();
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  return (
    <div className="space-y-6">
      <Toaster />
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            <span className="text-gray-600">Traitement en cours...</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Paramètres</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profil</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Sécurité</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations de profil</CardTitle>
              <CardDescription>
                Mettez à jour vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prénom</Label>
                    <p className="text-sm">{profileData.prenom}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <p className="text-sm">{profileData.nom}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <p className="text-sm">{profileData.email}</p>
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <p className="text-sm">{profileData.telephone}</p>
                </div>
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <p className="text-sm">{profileData.adresse || "-"}</p>
                </div>
                <Button onClick={() => setIsEditingProfile(true)} className="mt-4" disabled={loading}>
                  Modifier le profil
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du compte</CardTitle>
              <CardDescription>Modifiez votre mot de passe</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="oldPassword">Mot de passe actuel</Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="mt-4" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mettre à jour le mot de passe"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Overlay et formulaire de modification du profil */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Modifier le profil</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingProfile(false)}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Mettez à jour vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input
                      id="prenom"
                      value={profileData.prenom}
                      onChange={handleProfileChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                      id="nom"
                      value={profileData.nom}
                      onChange={handleProfileChange}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    value={profileData.telephone}
                    onChange={handleProfileChange}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input
                    id="adresse"
                    value={profileData.adresse}
                    onChange={handleProfileChange}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    value={profileData.longitude}
                    onChange={handleProfileChange}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    value={profileData.latitude}
                    onChange={handleProfileChange}
                    disabled={loading}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditingProfile(false)}
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

export default Settings;