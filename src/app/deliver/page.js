"use client"
import React, { useState, useEffect } from 'react';
import { mockUsers, mockOrders } from '@/data/mockData';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  MoreVertical, 
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Package2,
  LocateFixed,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

// Filter out only deliverers
const deliverers = mockUsers.filter(user => user.role === 'deliverer');

// Combine order data with user data for deliverer assignments
const deliveryData = mockOrders.map(order => {
  const deliverer = order.deliver_id ? mockUsers.find(user => user.id === order.deliver_id) : null;
  return {
    ...order,
    deliverer: deliverer ? `${deliverer.first_name} ${deliverer.last_name}` : 'Non assigné',
    delivererDetails: deliverer
  };
});

export default function DeliveryManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDeliverers, setFilteredDeliverers] = useState(deliverers);
  const [filteredOrders, setFilteredOrders] = useState(deliveryData);
  const [selectedDeliverer, setSelectedDeliverer] = useState(null);
  const [showDelivererDetails, setShowDelivererDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("deliverers");
  const [showAddDeliverer, setShowAddDeliverer] = useState(false);
  const [newDeliverer, setNewDeliverer] = useState({
    first_name: '',
    last_name: '',
    email: '',
    tel: '',
    address: ''
  });

  // Statistics
  const pendingOrders = deliveryData.filter(order => order.status === 'pending').length;
  const inProgressOrders = deliveryData.filter(order => order.status === 'in_progress').length;
  const deliveredOrders = deliveryData.filter(order => order.status === 'delivered').length;

  // Handle search for deliverers
  const handleSearchDeliverers = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = deliverers.filter(deliverer => 
      deliverer.first_name.toLowerCase().includes(query) || 
      deliverer.last_name.toLowerCase().includes(query) || 
      deliverer.email.toLowerCase().includes(query)
    );
    
    setFilteredDeliverers(filtered);
  };

  // Handle search for orders
  const handleSearchOrders = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = deliveryData.filter(order => 
      order.deliverer.toLowerCase().includes(query) || 
      order.status.toLowerCase().includes(query) || 
      order.delivery_address.toLowerCase().includes(query) ||
      order.id.toString().includes(query)
    );
    
    setFilteredOrders(filtered);
  };

  // Handle adding new deliverer
  const handleAddDeliverer = () => {
    // Here you would typically make an API call to add the deliverer
    toast.success('Nouveau livreur ajouté avec succès !');
    setShowAddDeliverer(false);
    setNewDeliverer({
      first_name: '',
      last_name: '',
      email: '',
      tel: '',
      address: ''
    });
  };

  // Reset search when changing tabs
  useEffect(() => {
    setSearchQuery('');
    setFilteredDeliverers(deliverers);
    setFilteredOrders(deliveryData);
  }, [activeTab]);

  // Get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En attente</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">En cours</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Livré</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Gestion des livraisons</h1>
        <p className="text-gray-500 mt-1">Gérez les livreurs et les commandes en cours</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">En attente</p>
                <h3 className="text-2xl font-bold text-yellow-900 mt-1">{pendingOrders}</h3>
              </div>
              <div className="h-12 w-12 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-700">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">En cours</p>
                <h3 className="text-2xl font-bold text-blue-900 mt-1">{inProgressOrders}</h3>
              </div>
              <div className="h-12 w-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700">
                <LocateFixed className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Livrées</p>
                <h3 className="text-2xl font-bold text-green-900 mt-1">{deliveredOrders}</h3>
              </div>
              <div className="h-12 w-12 bg-green-200 rounded-full flex items-center justify-center text-green-700">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Deliverers and Orders */}
      <Tabs defaultValue="deliverers" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deliverers">Livreurs</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
        </TabsList>
        
        {/* Deliverers Tab */}
        <TabsContent value="deliverers" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Liste des livreurs</CardTitle>
                  <CardDescription>
                    {filteredDeliverers.length} livreur{filteredDeliverers.length !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      type="search" 
                      placeholder="Rechercher un livreur..." 
                      className="pl-8 w-full sm:w-[260px]" 
                      value={searchQuery}
                      onChange={handleSearchDeliverers}
                    />
                  </div>
                  <Dialog open={showAddDeliverer} onOpenChange={setShowAddDeliverer}>
                    <DialogTrigger asChild>
                      <Button className="whitespace-nowrap">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un livreur
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Ajouter un nouveau livreur</DialogTitle>
                        <DialogDescription>
                          Remplissez les informations du nouveau livreur ci-dessous.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="first_name">Prénom</Label>
                            <Input
                              id="first_name"
                              value={newDeliverer.first_name}
                              onChange={(e) => setNewDeliverer({...newDeliverer, first_name: e.target.value})}
                              placeholder="Jean"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="last_name">Nom</Label>
                            <Input
                              id="last_name"
                              value={newDeliverer.last_name}
                              onChange={(e) => setNewDeliverer({...newDeliverer, last_name: e.target.value})}
                              placeholder="Dupont"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newDeliverer.email}
                            onChange={(e) => setNewDeliverer({...newDeliverer, email: e.target.value})}
                            placeholder="jean.dupont@example.com"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="tel">Téléphone</Label>
                          <Input
                            id="tel"
                            type="tel"
                            value={newDeliverer.tel}
                            onChange={(e) => setNewDeliverer({...newDeliverer, tel: e.target.value})}
                            placeholder="06 12 34 56 78"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="address">Adresse</Label>
                          <Input
                            id="address"
                            value={newDeliverer.address}
                            onChange={(e) => setNewDeliverer({...newDeliverer, address: e.target.value})}
                            placeholder="123 rue de la Livraison"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddDeliverer(false)}>
                          Annuler
                        </Button>
                        <Button onClick={handleAddDeliverer}>
                          Ajouter le livreur
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Livreur</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Adresse</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeliverers.length > 0 ? (
                      filteredDeliverers.map((deliverer) => (
                        <TableRow key={deliverer.id}>
                          <TableCell className="font-medium">
                            {deliverer.first_name} {deliverer.last_name}
                          </TableCell>
                          <TableCell>{deliverer.email}</TableCell>
                          <TableCell>{deliverer.tel || "-"}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {deliverer.address || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Ouvrir le menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedDeliverer(deliverer);
                                    setShowDelivererDetails(true);
                                  }}
                                >
                                  <UserCircle className="mr-2 h-4 w-4" />
                                  Voir les détails
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    toast.success(`Un message a été envoyé à ${deliverer.first_name} ${deliverer.last_name}`);
                                  }}
                                >
                                  <Mail className="mr-2 h-4 w-4" />
                                  Envoyer un message
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          Aucun livreur trouvé.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Commandes en livraison</CardTitle>
                  <CardDescription>
                    {filteredOrders.length} commande{filteredOrders.length !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    type="search" 
                    placeholder="Rechercher une commande..." 
                    className="pl-8 w-full sm:w-[260px]" 
                    value={searchQuery}
                    onChange={handleSearchOrders}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Livreur</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Adresse</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>
                            {order.deliver_id ? order.deliverer : (
                              <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Non assigné</Badge>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {order.delivery_address}
                          </TableCell>
                          <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Ouvrir le menu</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    toast.success(`Détails de la commande #${order.id}`);
                                  }}
                                >
                                  <Package2 className="mr-2 h-4 w-4" />
                                  Voir les détails
                                </DropdownMenuItem>
                                {order.status === 'pending' && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      toast.success(`Livreur assigné à la commande #${order.id}`);
                                    }}
                                  >
                                    <UserCircle className="mr-2 h-4 w-4" />
                                    Assigner un livreur
                                  </DropdownMenuItem>
                                )}
                                {order.status === 'in_progress' && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      toast.success(`La commande #${order.id} a été marquée comme livrée`);
                                    }}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Marquer comme livrée
                                  </DropdownMenuItem>
                                )}
                                {order.status !== 'delivered' && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      toast.error(`La commande #${order.id} a été signalée comme problématique`);
                                    }}
                                    className="text-red-600"
                                  >
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Signaler un problème
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Aucune commande trouvée.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline">Exporter les commandes</Button>
              <Button>Assigner les commandes en attente</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Deliverer Details Dialog */}
      <Dialog open={showDelivererDetails} onOpenChange={setShowDelivererDetails}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Détails du livreur</DialogTitle>
            <DialogDescription>
              Informations complètes sur le livreur
            </DialogDescription>
          </DialogHeader>
          {selectedDeliverer && (
            <div className="py-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <UserCircle className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold">{selectedDeliverer.first_name} {selectedDeliverer.last_name}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Mail className="h-4 w-4 mr-1" />
                      {selectedDeliverer.email}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Coordonnées</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{selectedDeliverer.tel || "Non renseigné"}</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-blue-600 mt-0.5" />
                        <span>{selectedDeliverer.address || "Non renseigné"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Statistiques</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Commandes livrées:</span>
                        <span className="font-medium">24</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Taux de satisfaction:</span>
                        <span className="font-medium">97%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Temps moyen:</span>
                        <span className="font-medium">28 min</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Commandes en cours</h4>
                  {deliveryData.filter(order => order.deliver_id === selectedDeliverer.id && order.status !== 'delivered').length > 0 ? (
                    <div className="space-y-2">
                      {deliveryData
                        .filter(order => order.deliver_id === selectedDeliverer.id && order.status !== 'delivered')
                        .map(order => (
                          <div key={order.id} className="flex items-center justify-between text-sm p-2 bg-white rounded border">
                            <div className="flex items-center">
                              <Package2 className="h-4 w-4 mr-2 text-gray-500" />
                              <span>Commande #{order.id}</span>
                            </div>
                            {getStatusBadge(order.status)}
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Aucune commande en cours</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelivererDetails(false)}>
              Fermer
            </Button>
            <Button onClick={() => {
              toast.success(`Un message a été envoyé à ${selectedDeliverer?.first_name} ${selectedDeliverer?.last_name}`);
              setShowDelivererDetails(false);
            }}>
              Contacter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}