"use client"
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, Search, Filter, Trash2, Edit, HelpCircle, User, MessageCircle } from "lucide-react";
import { toast } from "sonner";

// Données fictives pour les FAQ
const initialFAQs = [
  {
    id: 1,
    question: "Comment ajouter un nouveau produit ?",
    answer: "Pour ajouter un nouveau produit, accédez à la section 'Produits' dans le menu principal, puis cliquez sur le bouton 'Ajouter un produit'. Remplissez ensuite les informations requises et cliquez sur 'Enregistrer'.",
    category: "Produits"
  },
  {
    id: 2,
    question: "Comment gérer les commandes en attente ?",
    answer: "Les commandes en attente sont affichées dans l'onglet 'En attente' de la section 'Commandes'. Vous pouvez les traiter en cliquant sur 'Voir les détails' puis en sélectionnant l'action appropriée (confirmer, annuler, etc.).",
    category: "Commandes"
  },
  {
    id: 3,
    question: "Comment modifier les tarifs de livraison ?",
    answer: "Les tarifs de livraison peuvent être modifiés dans la section 'Paramètres > Livraison'. Vous pouvez définir des tarifs par zone géographique ou par distance. N'oubliez pas de cliquer sur 'Appliquer les changements' après modification.",
    category: "Livraison"
  },
  {
    id: 4,
    question: "Comment contacter le support technique ?",
    answer: "Pour contacter le support technique, utilisez le formulaire dans la section 'Support > Nouveau ticket' en détaillant votre problème. Notre équipe vous répondra dans un délai maximum de 24 heures ouvrables.",
    category: "Support"
  },
  {
    id: 5,
    question: "Comment configurer les notifications ?",
    answer: "Les paramètres de notification sont disponibles dans 'Paramètres > Notifications'. Vous pouvez choisir quels événements déclenchent des notifications et par quels canaux (email, SMS, notifications push, etc.).",
    category: "Paramètres"
  }
];

const FAQ = () => {
  const [faqs, setFaqs] = useState(initialFAQs);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState({
    question: "",
    answer: "",
    category: "Général"
  });

  // Filtrer les FAQs en fonction de la recherche
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Gérer l'ajout d'une nouvelle FAQ
  const handleAddFaq = () => {
    if (currentFaq.question.trim() === "" || currentFaq.answer.trim() === "") {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    const newFaq = {
      id: Date.now(),
      ...currentFaq
    };
    
    setFaqs([...faqs, newFaq]);
    setCurrentFaq({ question: "", answer: "", category: "Général" });
    setIsAddDialogOpen(false);
    toast.success("FAQ ajoutée avec succès");
  };

  // Gérer la modification d'une FAQ
  const handleUpdateFaq = () => {
    if (currentFaq.question.trim() === "" || currentFaq.answer.trim() === "") {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    const updatedFaqs = faqs.map(faq => 
      faq.id === currentFaq.id ? currentFaq : faq
    );
    
    setFaqs(updatedFaqs);
    setIsEditDialogOpen(false);
    toast.success("FAQ mise à jour avec succès");
  };

  // Gérer la suppression d'une FAQ
  const handleDeleteFaq = (id) => {
    const updatedFaqs = faqs.filter(faq => faq.id !== id);
    setFaqs(updatedFaqs);
    toast.success("FAQ supprimée avec succès");
  };

  // Ouvrir le dialogue de modification avec les données de la FAQ sélectionnée
  const openEditDialog = (faq) => {
    setCurrentFaq(faq);
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
                  onChange={(e) => setCurrentFaq({...currentFaq, question: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="answer">Réponse</Label>
                <Textarea
                  id="answer"
                  placeholder="Saisissez la réponse"
                  value={currentFaq.answer}
                  rows={5}
                  onChange={(e) => setCurrentFaq({...currentFaq, answer: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  placeholder="Ex: Général, Produits, Support..."
                  value={currentFaq.category}
                  onChange={(e) => setCurrentFaq({...currentFaq, category: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleAddFaq}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Barre de recherche */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
                  <span className="text-xs px-2 py-1 bg-gray-200 text-gray-800 rounded-full">
                    {faq.category}
                  </span>
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
                    <p className="text-gray-700">{faq.answer}</p>
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
            <DialogDescription>
              Modifiez les informations de cette FAQ.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-question">Question</Label>
              <Input
                id="edit-question"
                placeholder="Saisissez la question"
                value={currentFaq.question}
                onChange={(e) => setCurrentFaq({...currentFaq, question: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-answer">Réponse</Label>
              <Textarea
                id="edit-answer"
                placeholder="Saisissez la réponse"
                value={currentFaq.answer}
                rows={5}
                onChange={(e) => setCurrentFaq({...currentFaq, answer: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Catégorie</Label>
              <Input
                id="edit-category"
                placeholder="Ex: Général, Produits, Support..."
                value={currentFaq.category}
                onChange={(e) => setCurrentFaq({...currentFaq, category: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleUpdateFaq}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FAQ;