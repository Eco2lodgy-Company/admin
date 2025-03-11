"use client"
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Store, Plus, Search, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for shops
const mockShops = [
  {
    id: 1,
    name: "Fresh Market",
    sellerName: "Jean Dupont",
    description: "Produits frais et bio",
    address: "123 Rue de la Paix, Paris",
    phone: "+33 1 23 45 67 89",
    createdAt: "2023-04-15",
  },
  {
    id: 2,
    name: "Tech Haven",
    sellerName: "Marie Martin",
    description: "Tout pour la technologie",
    address: "456 Avenue des Champs-Élysées, Paris",
    phone: "+33 6 12 34 56 78",
    createdAt: "2023-05-20",
  },
  {
    id: 3,
    name: "Fashion World",
    sellerName: "Pierre Durand",
    description: "Vêtements tendance",
    address: "789 Boulevard Haussmann, Paris",
    phone: "+33 7 98 76 54 32",
    createdAt: "2023-06-10",
  },
];

const ShopManagement = () => {
  const [shops, setShops] = useState(mockShops);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddShop, setShowAddShop] = useState(false);
  const [showEditShop, setShowEditShop] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [newShop, setNewShop] = useState({
    name: '',
    sellerName: '',
    description: '',
    address: '',
    phone: ''
  });
  const [editingShop, setEditingShop] = useState({
    name: '',
    sellerName: '',
    description: '',
    address: '',
    phone: ''
  });

  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setShops(shops.filter(shop => shop.id !== id));
    toast.success('Boutique supprimée avec succès');
  };

  const handleAddShop = () => {
    const newShopData = {
      id: shops.length + 1,
      ...newShop,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setShops([...shops, newShopData]);
    setShowAddShop(false);
    setNewShop({
      name: '',
      sellerName: '',
      description: '',
      address: '',
      phone: ''
    });
    toast.success('Boutique ajoutée avec succès');
  };

  const handleEditClick = (shop) => {
    setSelectedShop(shop);
    setEditingShop({
      name: shop.name,
      sellerName: shop.sellerName,
      description: shop.description,
      address: shop.address,
      phone: shop.phone
    });
    setShowEditShop(true);
  };

  const handleEditShop = () => {
    const updatedShops = shops.map(shop => 
      shop.id === selectedShop.id 
        ? { ...shop, ...editingShop }
        : shop
    );
    
    setShops(updatedShops);
    setShowEditShop(false);
    setSelectedShop(null);
    toast.success('Boutique modifiée avec succès');
  };

  // Composant de formulaire réutilisable
  const ShopForm = ({ data, onChange, isEdit = false }) => (
    <div className="grid gap-4 py-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${isEdit ? 'edit-' : ''}name`}>Nom de la boutique</Label>
        <Input
          id={`${isEdit ? 'edit-' : ''}name`}
          value={data.name}
          onChange={(e) => onChange({...data, name: e.target.value})}
          placeholder="Fresh Market"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${isEdit ? 'edit-' : ''}sellerName`}>Nom du vendeur</Label>
        <Input
          id={`${isEdit ? 'edit-' : ''}sellerName`}
          value={data.sellerName}
          onChange={(e) => onChange({...data, sellerName: e.target.value})}
          placeholder="Jean Dupont"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${isEdit ? 'edit-' : ''}description`}>Description</Label>
        <Textarea
          id={`${isEdit ? 'edit-' : ''}description`}
          value={data.description}
          onChange={(e) => onChange({...data, description: e.target.value})}
          placeholder="Décrivez votre boutique..."
          className="resize-none"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${isEdit ? 'edit-' : ''}address`}>Adresse</Label>
        <Input
          id={`${isEdit ? 'edit-' : ''}address`}
          value={data.address}
          onChange={(e) => onChange({...data, address: e.target.value})}
          placeholder="123 Rue de la Paix, Paris"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${isEdit ? 'edit-' : ''}phone`}>Téléphone</Label>
        <Input
          id={`${isEdit ? 'edit-' : ''}phone`}
          value={data.phone}
          onChange={(e) => onChange({...data, phone: e.target.value})}
          placeholder="+33 1 23 45 67 89"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Boutiques</h1>
        <Dialog open={showAddShop} onOpenChange={setShowAddShop}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} /> Ajouter une boutique
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle boutique</DialogTitle>
              <DialogDescription>
                Remplissez les informations de la nouvelle boutique ci-dessous.
              </DialogDescription>
            </DialogHeader>
            <ShopForm data={newShop} onChange={setNewShop} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddShop(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddShop}>
                Ajouter la boutique
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            <span>Boutiques</span>
          </CardTitle>
          <CardDescription>
            Gérez toutes les boutiques de votre plateforme multivendeur.
          </CardDescription>
          
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher une boutique..."
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
                <TableHead>Vendeur</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShops.length > 0 ? (
                filteredShops.map((shop) => (
                  <TableRow key={shop.id}>
                    <TableCell className="font-medium">{shop.id}</TableCell>
                    <TableCell>{shop.name}</TableCell>
                    <TableCell>{shop.sellerName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{shop.description}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{shop.address}</TableCell>
                    <TableCell>{shop.phone}</TableCell>
                    <TableCell>{shop.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleEditClick(shop)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleDelete(shop.id)}
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
                    Aucune boutique trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de modification */}
      <Dialog open={showEditShop} onOpenChange={setShowEditShop}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier la boutique</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la boutique ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <ShopForm data={editingShop} onChange={setEditingShop} isEdit={true} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditShop(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditShop}>
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopManagement;