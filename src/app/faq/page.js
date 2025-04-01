"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Edit,
  User,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
// import { stat } from "fs";
// import { stat } from "fs";

// Composant principal
const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState({
    id: 0,
    status: true,
    question: "",
    reponse: "",
    userId: 0, // Par défaut, à ajuster selon votre logique d'utilisateur
  });

  // Charger les FAQs au montage du composant

  

  const fetchFAQs = async () => {
    const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/faqs/liste?username=${username}`, // À ajuster selon votre endpoint
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
      setFaqs(data.data || []);
      toast.success(data.message);
    } catch (err) {
      console.error("Error fetching FAQs:", err.message);
      toast.error("Erreur lors de la récupération des FAQs");
    }
  };
  useEffect(() => {
       fetchFAQs();
  }, [setFaqs]);

  // Filtrer les FAQs en fonction de la recherche
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq?.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq?.reponse?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Gérer l'ajout d'une nouvelle FAQ
  const handleAddFaq = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("logedUserId"); // À adapter selon votre gestion d'utilisateur
    console.log("userId", userId);
    console.log("token", token);

    if (!currentFaq.question || !currentFaq.reponse) {
      toast.error("La question et la réponse sont obligatoires");
      return;
    }

    const faqData = {
      question: currentFaq.question,
      reponse: currentFaq.reponse,
      userId: parseInt(userId),
    };

    try {
      console.log("Adding FAQ with data:", faqData);
      const response = await fetch(`http://195.35.24.128:8081/api/faqs/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(faqData),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setFaqs([...faqs, data.data]);
      setCurrentFaq({ question: "", reponse: "", userId: 0 });
      setIsAddDialogOpen(false);
      toast.success(data.message);
      fetchFAQs();
    } catch (err) {
      console.error("Error adding FAQ:", err.message);
      toast.error("Erreur lors de l'ajout de la FAQ");
      fetchFAQs();
    }
  };

  // Gérer la modification d'une FAQ
  const handleUpdateFaq = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("logedUserId") || 0;

    if (!currentFaq.question || !currentFaq.reponse) {
      toast.error("La question et la réponse sont obligatoires");
      return;
    }

    const faqData = {
      id: currentFaq.id,
      question: currentFaq.question,
      reponse: currentFaq.reponse,
      status: true,
      userId: parseInt(userId),
    };

    try {
      console.log("Updating FAQ with data:", faqData);
      const response = await fetch(
        `http://195.35.24.128:8081/api/faqs/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(faqData),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const updatedFaqs = faqs.map((faq) =>
        faq.id === currentFaq.id ? data.data : faq
      );
      setFaqs(updatedFaqs);
      setIsEditDialogOpen(false);
      setCurrentFaq({ question: "", reponse: "", userId: 0 });
      toast.success(data.message);
      fetchFAQs();
    } catch (err) {
      console.error("Error updating FAQ:", err.message);
      toast.error("Erreur lors de la mise à jour de la FAQ");
      fetchFAQs();
    }
  };

  // Gérer la suppression d'une FAQ
  const handleDeleteFaq = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/faqs/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const updatedFaqs = faqs.filter((faq) => faq.id !== id);
      setFaqs(updatedFaqs);
      toast.success("FAQ supprimée avec succès");
      fetchFAQs();
    } catch (err) {
      console.error("Error deleting FAQ:", err.message);
      toast.error("Erreur lors de la suppression de la FAQ");
      fetchFAQs();
    }
  };

  // Ouvrir le dialogue de modification avec les données de la FAQ sélectionnée
  const openEditDialog = (faq) => {
    setCurrentFaq({
      id: faq.id,
      question: faq.question,
      reponse: faq.reponse,
      userId: faq.userId || 0,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des FAQ</h1>
          <p className="text-gray-500 mt-1">Gérez les questions fréquemment posées</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle size={16} />
              <span>Ajouter une FAQ</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle FAQ</DialogTitle>
              <DialogDescription>
                Créez une nouvelle question et réponse pour aider vos utilisateurs.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  placeholder="Saisissez la question"
                  value={currentFaq.question}
                  onChange={(e) =>
                    setCurrentFaq({ ...currentFaq, question: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="answer">Réponse</Label>
                <Textarea
                  id="answer"
                  placeholder="Saisissez la réponse"
                  value={currentFaq.reponse}
                  rows={5}
                  onChange={(e) =>
                    setCurrentFaq({ ...currentFaq, reponse: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddFaq}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barre de recherche */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Rechercher une FAQ..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={16} />
          <span>Filtrer</span>
        </Button>
      </div>

      {/* Liste des FAQ en style bulles de discussion */}
      <div className="space-y-6">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <Card key={faq.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(faq)}
                      className="h-7 w-7 text-gray-500 hover:text-primary"
                    >
                      <Edit size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="h-7 w-7 text-gray-500 hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>

                {/* Bulle de question */}
                <div className="flex mb-4">
                  <div className="flex-shrink-0 mr-3">
                    <div className="bg-gray-200 rounded-full p-2">
                      <User size={20} className="text-gray-700" />
                    </div>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none max-w-3xl relative">
                    <div className="absolute top-0 -left-2 w-2 h-2 bg-gray-100 transform rotate-45"></div>
                    <h3 className="font-medium text-gray-900">{faq.question}</h3>
                  </div>
                </div>

                {/* Bulle de réponse */}
                <div className="flex justify-end">
                  <div className="bg-green-100 p-3 rounded-lg rounded-tr-none max-w-3xl relative">
                    <div className="absolute top-0 -right-2 w-2 h-2 bg-green-100 transform rotate-45"></div>
                    <p className="text-gray-700">{faq.reponse}</p>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    <div className="bg-green-500 rounded-full p-2">
                      <MessageCircle size={20} className="text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Aucune FAQ ne correspond à votre recherche</p>
          </div>
        )}
      </div>

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier la FAQ</DialogTitle>
            <DialogDescription>Modifiez les informations de cette FAQ.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-question">Question</Label>
              <Input
                id="edit-question"
                placeholder="Saisissez la question"
                value={currentFaq.question}
                onChange={(e) =>
                  setCurrentFaq({ ...currentFaq, question: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-answer">Réponse</Label>
              <Textarea
                id="edit-answer"
                placeholder="Saisissez la réponse"
                value={currentFaq.reponse}
                rows={5}
                onChange={(e) =>
                  setCurrentFaq({ ...currentFaq, reponse: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateFaq}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FAQ;