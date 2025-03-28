"use client";
import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Filter, Eye } from "lucide-react";
import { toast } from "sonner";

const SupportTickets = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Charger les feedbacks depuis l'API au montage du composant
  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(
          `http://195.35.24.128:8081/api/feedbacks/liste?username=${username}`, // À ajuster selon votre endpoint
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
        setFeedbacks(data.data || []);
        toast.success("Feedbacks chargés avec succès");
      } catch (err) {
        console.error("Error fetching feedbacks:", err.message);
        toast.error("Erreur lors de la récupération des feedbacks");
      }
    };

    fetchFeedbacks();
  }, [setFeedbacks]);

  // Filtrer les feedbacks en fonction de la recherche
  const filteredFeedbacks = feedbacks.filter(
    (feedback) =>
      feedback.objet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Feedbacks</h1>
          <p className="text-muted-foreground">
            Consultez les retours de vos utilisateurs.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Rechercher un feedback..."
              className="w-64 rounded-md border border-input pl-8 py-2 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filtrer
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="livreur">Livreur</TabsTrigger>
          <TabsTrigger value="client">Client</TabsTrigger>
        </TabsList>

        {/* Onglet "Tous" */}
        <TabsContent value="all" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Objet</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedbacks.length > 0 ? (
                  filteredFeedbacks.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell className="font-medium">{feedback.id}</TableCell>
                      <TableCell>{feedback.type}</TableCell>
                      <TableCell>{feedback.objet}</TableCell>
                      <TableCell>{feedback.message}</TableCell>
                      <TableCell>{feedback.username}</TableCell>
                      <TableCell>{feedback.userEmail}</TableCell>
                      <TableCell>{formatDate(feedback.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      Aucun feedback trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Onglet "Livreur" */}
        <TabsContent value="livreur" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Objet</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedbacks
                  .filter((feedback) => feedback.type === "livreur")
                  .map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell className="font-medium">{feedback.id}</TableCell>
                      <TableCell>{feedback.objet}</TableCell>
                      <TableCell>{feedback.message}</TableCell>
                      <TableCell>{feedback.username}</TableCell>
                      <TableCell>{feedback.userEmail}</TableCell>
                      <TableCell>{formatDate(feedback.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Onglet "Client" */}
        <TabsContent value="client" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Objet</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedbacks
                  .filter((feedback) => feedback.type === "client")
                  .map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell className="font-medium">{feedback.id}</TableCell>
                      <TableCell>{feedback.objet}</TableCell>
                      <TableCell>{feedback.message}</TableCell>
                      <TableCell>{feedback.username}</TableCell>
                      <TableCell>{feedback.userEmail}</TableCell>
                      <TableCell>{formatDate(feedback.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportTickets;