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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Store, Plus, Search, Edit, Trash } from 'lucide-react';

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

  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setShops(shops.filter(shop => shop.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Boutiques</h1>
        <Button className="flex items-center gap-2">
          <Plus size={16} /> Ajouter une boutique
        </Button>
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
                        <Button variant="outline" size="icon">
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
    </div>
  );
};

export default ShopManagement;