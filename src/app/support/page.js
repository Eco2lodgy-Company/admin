"use client"
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Search, Filter, Eye } from 'lucide-react';

const SupportTickets = () => {
  // État pour stocker les tickets (simulé pour l'instant)
  const [tickets, setTickets] = useState([
    { 
      id: "TKT-001", 
      subject: "Problème de livraison", 
      customer: "Jean Dupont", 
      email: "jean.dupont@example.com",
      priority: "high", 
      status: "open", 
      created: "2023-05-10T14:30:00", 
      lastUpdated: "2023-05-11T09:15:00" 
    },
    { 
      id: "TKT-002", 
      subject: "Remboursement non reçu", 
      customer: "Marie Martin", 
      email: "marie.martin@example.com",
      priority: "medium", 
      status: "pending", 
      created: "2023-05-09T11:20:00", 
      lastUpdated: "2023-05-10T16:45:00" 
    },
    { 
      id: "TKT-003", 
      subject: "Produit défectueux", 
      customer: "Pierre Dubois", 
      email: "pierre.dubois@example.com",
      priority: "high", 
      status: "open", 
      created: "2023-05-08T09:50:00", 
      lastUpdated: "2023-05-09T14:20:00" 
    },
    { 
      id: "TKT-004", 
      subject: "Question sur abonnement", 
      customer: "Sophie Lambert", 
      email: "sophie.lambert@example.com",
      priority: "low", 
      status: "resolved", 
      created: "2023-05-07T15:40:00", 
      lastUpdated: "2023-05-08T10:30:00" 
    },
  ]);

  // Fonction pour obtenir la couleur du badge en fonction de la priorité
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tickets de Support</h1>
          <p className="text-muted-foreground">
            Gérez et répondez aux demandes d'assistance de vos clients.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Rechercher un ticket..."
              className="w-64 rounded-md border border-input pl-8 py-2 text-sm"
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
          <TabsTrigger value="open">Ouverts</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="resolved">Résolus</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead>Dernière mise à jour</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>{ticket.customer}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityBadgeColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(ticket.created).toLocaleString()}</TableCell>
                    <TableCell>{new Date(ticket.lastUpdated).toLocaleString()}</TableCell>
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
        <TabsContent value="open" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead>Dernière mise à jour</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.filter(ticket => ticket.status === 'open').map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>{ticket.customer}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityBadgeColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(ticket.created).toLocaleString()}</TableCell>
                    <TableCell>{new Date(ticket.lastUpdated).toLocaleString()}</TableCell>
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
        <TabsContent value="pending" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead>Dernière mise à jour</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.filter(ticket => ticket.status === 'pending').map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>{ticket.customer}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityBadgeColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(ticket.created).toLocaleString()}</TableCell>
                    <TableCell>{new Date(ticket.lastUpdated).toLocaleString()}</TableCell>
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
        <TabsContent value="resolved" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead>Dernière mise à jour</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.filter(ticket => ticket.status === 'resolved').map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>{ticket.customer}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityBadgeColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(ticket.created).toLocaleString()}</TableCell>
                    <TableCell>{new Date(ticket.lastUpdated).toLocaleString()}</TableCell>
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
