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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  PlusCircle, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ArrowUpDown,
  AlertCircle,
  Package,
  MoreHorizontal,
  X,
  Save
} from "lucide-react";
import { toast } from "sonner";

// Données fictives pour les produits
const initialProducts = [
  { 
    id: 1, 
    name: "Burger Classique", 
    category: "Restauration", 
    price: 8.99, 
    stockQuantity: 120, 
    stockAlert: 20, 
    status: "Disponible"
  },
  { 
    id: 2, 
    name: "Pizza Margherita", 
    category: "Restauration", 
    price: 12.50, 
    stockQuantity: 45, 
    stockAlert: 15, 
    status: "Disponible" 
  },
  { 
    id: 3, 
    name: "Salade César", 
    category: "Restauration", 
    price: 7.95, 
    stockQuantity: 30, 
    stockAlert: 10, 
    status: "Disponible" 
  },
  { 
    id: 4, 
    name: "Bouteille d'eau 50cl", 
    category: "Boissons", 
    price: 1.50, 
    stockQuantity: 10, 
    stockAlert: 20, 
    status: "Stock faible" 
  },
  { 
    id: 5, 
    name: "Soda Cola 33cl", 
    category: "Boissons", 
    price: 2.20, 
    stockQuantity: 0, 
    stockAlert: 15, 
    status: "Rupture de stock" 
  },
  { 
    id: 6, 
    name: "Brownie Chocolat", 
    category: "Desserts", 
    price: 3.95, 
    stockQuantity: 25, 
    stockAlert: 8, 
    status: "Disponible" 
  }
];

const ProductManagement = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    category: "",
    price: "",
    shop: "",
    image: ""
  });
  
  // Filtre des produits en fonction de la recherche
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Gestion du statut avec badge coloré
  const getStatusBadge = (status, stockQuantity, stockAlert) => {
    if (stockQuantity === 0) {
      return <Badge variant="destructive">Rupture de stock</Badge>;
    } else if (stockQuantity <= stockAlert) {
      return <Badge className="bg-yellow-500">Stock faible</Badge>;
    } else {
      return <Badge variant="default" className="bg-green-500">Disponible</Badge>;
    }
  };

  const calculateStatus = (stockQuantity, stockAlert) => {
    if (stockQuantity === 0) {
      return "Rupture de stock";
    } else if (stockQuantity <= stockAlert) {
      return "Stock faible";
    } else {
      return "Disponible";
    }
  };
  
  // Gérer l'ajout d'un nouveau produit
  const handleAddProduct = () => {
    setCurrentProduct(null);
    setFormData({
      id: null,
      name: "",
      category: "",
      price: "",
      shop: "",
      image: ""
    });
    setIsEditing(true);
  };
  
  // Gérer la modification d'un produit
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      shop: product.shop,
      image: product.image
    });
    setIsEditing(true);
  };
  
  // Gérer la suppression d'un produit
  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
    toast.success("Produit supprimé avec succès");
  };
  
  // Gérer les changements de formulaire
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'stockQuantity' || name === 'stockAlert' 
        ? parseFloat(value) || "" 
        : value
    });
  };
  
  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (
      !formData.name || 
      !formData.category || 
      formData.price === "" || 
      formData.stockQuantity === "" || 
      formData.stockAlert === ""
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      stockAlert: parseInt(formData.stockAlert),
      status: calculateStatus(parseInt(formData.stockQuantity), parseInt(formData.stockAlert))
    };
    
    if (currentProduct) {
      // Mettre à jour un produit existant
      const updatedProducts = products.map(product => 
        product.id === currentProduct.id ? productData : product
      );
      setProducts(updatedProducts);
      toast.success(`Produit "${productData.name}" mis à jour avec succès`);
    } else {
      // Ajouter un nouveau produit
      const newProduct = {
        ...productData,
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      };
      setProducts([...products, newProduct]);
      toast.success(`Produit "${newProduct.name}" ajouté avec succès`);
    }
    
    setIsEditing(false);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-gray-500 mt-1">Gérez votre catalogue de produits et les stocks</p>
        </div>
        
        <Button onClick={handleAddProduct} className="flex items-center gap-2">
          <PlusCircle size={16} />
          <span>Ajouter un produit</span>
        </Button>
      </div>
      
      {/* Alerte de stock */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-md p-4 mb-6 flex items-start">
        <AlertCircle className="text-yellow-500 mr-3 mt-0.5" size={20} />
        <div>
          <h3 className="font-medium text-yellow-800">Alerte de stock</h3>
          <p className="text-yellow-700 text-sm">
            {products.filter(p => p.stockQuantity === 0 || p.stockQuantity <= p.stockAlert).length} produits sont en rupture de stock ou en stock faible. Vérifiez l'inventaire et approvisionnez si nécessaire.
          </p>
        </div>
      </div>
      
      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Rechercher un produit..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            <span>Filtrer</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowUpDown size={16} />
            <span>Trier</span>
          </Button>
        </div>
      </div>
      
      {/* Carte principale avec tableau des produits */}
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl flex items-center">
            <Package className="mr-2" size={20} />
            Catalogue de produits
          </CardTitle>
          <CardDescription>
            Liste complète des produits avec statut de stock
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Prix</TableHead>
                <TableHead className="text-center">Boutique</TableHead>
                {/* <TableHead className="text-center">Alerte stock</TableHead> */}
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">{product.price.toFixed(2)} €</TableCell>
                    <TableCell className="text-center">
                     Marina Market
                    </TableCell>
                    {/* <TableCell className="text-center">{product.stockAlert}</TableCell> */}
                    <TableCell className="text-center">
                      {getStatusBadge(product.status, product.stockQuantity, product.stockAlert)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit size={16} className="text-blue-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toast.info(`Options pour ${product.name}`)}
                        >
                          <MoreHorizontal size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                    Aucun produit ne correspond à votre recherche
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 px-6 py-3">
          <div className="text-sm text-gray-500">
            Affichage de {filteredProducts.length} produits sur {products.length} au total
          </div>
        </CardFooter>
      </Card>

      {/* Overlay et formulaire d'ajout/modification */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="sm:max-w-[425px]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package size={20} />
                  <span>{currentProduct ? "Modifier le produit" : "Ajouter un produit"}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                  <X size={18} />
                </Button>
              </CardTitle>
              <CardDescription>
                {currentProduct ? "Modifiez les informations du produit" : "Remplissez le formulaire pour ajouter un nouveau produit"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom du produit</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Burger Classique"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Categorie" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">BonBon</SelectItem>
                            <SelectItem value="dark">Fruit</SelectItem>
                            <SelectItem value="system">Legume</SelectItem>
                        </SelectContent>
                    </Select>

                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (€)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="8.99"
                      value={formData.price}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Boutique</Label>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="`{formData.shop}`" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Adidas</SelectItem>
                            <SelectItem value="dark">Nike</SelectItem>
                            <SelectItem value="system">Apple</SelectItem>
                        </SelectContent>
                    </Select>

                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stockAlert">Image</Label>
                    <Input
                      id="stockAlert"
                      name="stockAlert"
                      type="file"
                      value={formData.image}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="flex items-center gap-2">
                    <Save size={16} />
                    {currentProduct ? "Mettre à jour" : "Ajouter"}
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

export default ProductManagement;