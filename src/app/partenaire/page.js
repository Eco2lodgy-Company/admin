"use client"
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter 
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, Plus, Search, Edit, Trash, Building, X } from 'lucide-react';
import { toast } from "sonner";

// Mock data for partners
const mockPartners = [
  {
    id: 1,
    name: "Restaurant Le Gourmet",
    contactName: "Jean Dupont",
    description: "Restaurant gastronomique partenaire",
    address: "123 Rue de la Paix, Paris",
    phone: "+33 1 23 45 67 89",
    createdAt: "2023-04-15",
  },
  {
    id: 2,
    name: "Épicerie Bio Natura",
    contactName: "Marie Martin",
    description: "Épicerie bio et produits locaux",
    address: "456 Avenue des Champs-Élysées, Paris",
    phone: "+33 6 12 34 56 78",
    createdAt: "2023-05-20",
  },
  {
    id: 3,
    name: "Café des Artistes",
    contactName: "Pierre Durand",
    description: "Café et pâtisseries artisanales",
    address: "789 Boulevard Haussmann, Paris",
    phone: "+33 7 98 76 54 32",
    createdAt: "2023-06-10",
  },
];

const Partners = () => {
  const [partners, setPartners] = useState(mockPartners);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentPartner, setCurrentPartner] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    contactName: "",
    description: "",
    address: "",
    phone: "",
  });

  const filteredPartners = partners.filter(partner => 
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setPartners(partners.filter(partner => partner.id !== id));
    toast.success("Partenaire supprimé avec succès");
  };

  const handleAdd = () => {
    setCurrentPartner(null);
    setFormData({
      id: null,
      name: "",
      contactName: "",
      description: "",
      address: "",
      phone: "",
    });
    setShowForm(true);
  };

  const handleEdit = (partner) => {
    setCurrentPartner(partner);
    setFormData({
      id: partner.id,
      name: partner.name,
      contactName: partner.contactName,
      description: partner.description,
      address: partner.address,
      phone: partner.phone,
    });
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentPartner) {
      // Update existing partner
      const updatedPartners = partners.map(partner => 
        partner.id === currentPartner.id ? { 
          ...partner, 
          ...formData 
        } : partner
      );
      setPartners(updatedPartners);
      toast.success(`Partenaire ${formData.name} modifié avec succès`);
    } else {
      // Add new partner
      const newPartner = {
        ...formData,
        id: partners.length > 0 ? Math.max(...partners.map(p => p.id)) + 1 : 1,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setPartners([...partners, newPartner]);
      toast.success(`Partenaire ${formData.name} ajouté avec succès`);
    }
    
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Partenaires</h1>
        <Button className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={16} /> Ajouter un partenaire
        </Button>
      </div>

      {/* Carte principale avec tableau des partenaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            <span>Partenaires</span>
          </CardTitle>
          <CardDescription>
            Gérez tous les partenaires que vous avez créés et administrés.
          </CardDescription>
          
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un partenaire..."
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
                <TableHead>Contact</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.length > 0 ? (
                filteredPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">{partner.id}</TableCell>
                    <TableCell>{partner.name}</TableCell>
                    <TableCell>{partner.contactName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{partner.description}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{partner.address}</TableCell>
                    <TableCell>{partner.phone}</TableCell>
                    <TableCell>{partner.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleEdit(partner)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleDelete(partner.id)}
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
                    Aucun partenaire trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t py-4 bg-gray-50">
          <div className="text-sm text-gray-500">
            Affichage de {filteredPartners.length} partenaires sur {partners.length} au total
          </div>
        </CardFooter>
      </Card>

      {/* Overlay et formulaire d'ajout/modification */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  <span>{currentPartner ? "Modifier le partenaire" : "Ajouter un partenaire"}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </CardTitle>
              <CardDescription>
                {currentPartner 
                  ? "Modifiez les informations du partenaire existant" 
                  : "Remplissez le formulaire pour ajouter un nouveau partenaire"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom du partenaire</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Nom du contact</Label>
                    <Input
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" type="button" onClick={() => setShowForm(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {currentPartner ? "Mettre à jour" : "Ajouter"}
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

export default Partners;