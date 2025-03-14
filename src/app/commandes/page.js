"use client"
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Badge
} from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Clock, 
  ShoppingBag, 
  Store, 
  Eye, 
  Calendar, 
  ArrowUpDown,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { toast } from "sonner";

// Données fictives pour les commandes partenaires
const initialOrders = [
  { 
    id: "CMD-123456", 
    shop: "Burger House", 
    orderDate: "2023-05-15 14:30", 
    totalAmount: 187.45, 
    items: 12, 
    status: "En attente", 
    priority: "Normal"
  },
  { 
    id: "CMD-123457", 
    shop: "Pizza Express", 
    orderDate: "2023-05-15 12:15", 
    totalAmount: 256.80, 
    items: 18, 
    status: "Confirmée", 
    priority: "Normal"
  },
  { 
    id: "CMD-123458", 
    shop: "Sushi & Co", 
    orderDate: "2023-05-14 18:45", 
    totalAmount: 324.10, 
    items: 24, 
    status: "En préparation", 
    priority: "Élevée"
  },
  { 
    id: "CMD-123459", 
    shop: "Le Boulanger", 
    orderDate: "2023-05-14 08:30", 
    totalAmount: 125.75, 
    items: 30, 
    status: "Expédiée", 
    priority: "Normal"
  },
  { 
    id: "CMD-123460", 
    shop: "Épicerie Fine", 
    orderDate: "2023-05-13 15:20", 
    totalAmount: 430.25, 
    items: 42, 
    status: "Livrée", 
    priority: "Normale"
  },
  { 
    id: "CMD-123461", 
    shop: "Burger House", 
    orderDate: "2023-05-13 10:05", 
    totalAmount: 145.60, 
    items: 8, 
    status: "Annulée", 
    priority: "Basse"
  }
];

const PartnerOrders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [priorityFilter, setPriorityFilter] = useState("Tous");

  // Filtre des commandes en fonction de la recherche et des filtres
  const filteredOrders = orders.filter(order => 
    (order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
     order.shop.toLowerCase().includes(searchQuery.toLowerCase()) ||
     order.status.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === "Tous" || order.status === statusFilter) &&
    (priorityFilter === "Tous" || order.priority === priorityFilter)
  );
  
  // Compteurs par statut
  const pendingCount = orders.filter(order => order.status === "En attente").length;
  const confirmedCount = orders.filter(order => order.status === "Confirmée" || order.status === "En préparation").length;
  const shippedCount = orders.filter(order => order.status === "Expédiée").length;
  const deliveredCount = orders.filter(order => order.status === "Livrée").length;
  
  // Style de badge selon le statut
  const getStatusBadge = (status) => {
    switch (status) {
      case "En attente":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">En attente</Badge>;
      case "Confirmée":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Confirmée</Badge>;
      case "En préparation":
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200">En préparation</Badge>;
      case "Expédiée":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Expédiée</Badge>;
      case "Livrée":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Livrée</Badge>;
      case "Annulée":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Style de badge selon la priorité
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Élevée":
        return <Badge className="bg-red-500">Élevée</Badge>;
      case "Normale":
        return <Badge className="bg-blue-500">Normale</Badge>;
      case "Basse":
        return <Badge className="bg-gray-500">Basse</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };
  
  // Changer l'état de la commande
  const handleStatusChange = (id, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    toast.success(`Statut de la commande ${id} mis à jour`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes Partenaires</h1>
          <p className="text-gray-500 mt-1">Gérez les commandes de vos boutiques partenaires</p>
        </div>
        <Button 
          onClick={() => toast.info("Exporter les commandes")} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Calendar size={16} />
          <span>Rapport mensuel</span>
        </Button>
      </div>
      
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">En attente</p>
              <h3 className="text-2xl font-bold">{pendingCount}</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Confirmées</p>
              <h3 className="text-2xl font-bold">{confirmedCount}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Expédiées</p>
              <h3 className="text-2xl font-bold">{shippedCount}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Store className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Livrées</p>
              <h3 className="text-2xl font-bold">{deliveredCount}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Rechercher une commande..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="Confirmée">Confirmée</option>
            <option value="En préparation">En préparation</option>
            <option value="Expédiée">Expédiée</option>
            <option value="Livrée">Livrée</option>
            <option value="Annulée">Annulée</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="Tous">Toutes les priorités</option>
            <option value="Élevée">Élevée</option>
            <option value="Normale">Normale</option>
            <option value="Basse">Basse</option>
          </select>
        </div>
      </div>
      
      {/* Liste des commandes */}
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl flex items-center">
            <ShoppingBag className="mr-2" size={20} />
            Commandes des boutiques partenaires
          </CardTitle>
          <CardDescription>
            Gérez le flux des commandes entre la plateforme et les boutiques
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Boutique</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="text-center">Articles</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-center">Priorité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.shop}</TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell className="text-right">{order.totalAmount.toFixed(2)} €</TableCell>
                    <TableCell className="text-center">{order.items}</TableCell>
                    <TableCell className="text-center">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="p-1 border rounded-md"
                      >
                        <option value="En attente">En attente</option>
                        <option value="Confirmée">Confirmée</option>
                        <option value="En préparation">En préparation</option>
                        <option value="Expédiée">Expédiée</option>
                        <option value="Livrée">Livrée</option>
                        <option value="Annulée">Annulée</option>
                      </select>
                    </TableCell>
                    <TableCell className="text-center">{getPriorityBadge(order.priority)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toast.info(`Voir détails de ${order.id}`)}
                        >
                          <Eye size={16} className="text-gray-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                    Aucune commande ne correspond à votre recherche
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 px-6 py-3">
          <div className="text-sm text-gray-500">
            Affichage de {filteredOrders.length} commandes sur {orders.length} au total
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PartnerOrders;