"use client";
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
  Save,
} from "lucide-react";
import { toast } from "sonner";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [shops, setShops] = useState([]);
  const [newProduct, setNewProduct] = useState({
    libelle: "",
    description: "",
    expiredAt:"",
    prix: 0,
    quantite: 0,
    codeQr: "",
    image: null,
    categorieId: 0,
    boutiqueId: 0,
    username:"username",
    acteurId: 0,
  });

  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://195.35.24.128:8081/api/products/liste?username=${username}`,
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
        setProducts(data.data);
        setFilteredProducts(data.data);
        toast.success("Produits chargés avec succès");
      } catch (err) {
        console.error("Error fetching products:", err.message);
        toast.error("Erreur lors de la récupération des produits");
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `http://195.35.24.128:8081/api/productCategories/liste?username=${username}`,
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
        setCategories(data.data);
        console.log(data.message)
      } catch (err) {
        console.error("Error fetching categories:", err.message);
        toast.error("Erreur lors de la récupération des catégories");
      }
    };

    const fetchShops = async () => {
      try {
        const response = await fetch(
          `http://195.35.24.128:8081/api/shop/liste?username=${username}`,
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
        setShops(data.data);
      } catch (err) {
        console.error("Error fetching shops:", err.message);
        toast.error("Erreur lors de la récupération des boutiques");
      }
    };

    fetchProducts();
    fetchCategories();
    fetchShops();
  }, []);

  // Filtre des produits
  const filteredProductsList = products.filter((product) =>
    product?.libelle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product?.categorieIntitule?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product?.boutiqueNom?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Gestion du statut avec badge coloré
  const getStatusBadge = (quantite) => {
    if (quantite === 0) {
      return <Badge variant="destructive">Rupture de stock</Badge>;
    } else if (quantite <= 10) {
      return <Badge className="bg-yellow-500">Stock faible</Badge>;
    } else {
      return <Badge variant="default" className="bg-green-500">Disponible</Badge>;
    }
  };

  // Gérer l'ajout d'un nouveau produit
  const handleAddProduct = async () => {
    const username = localStorage.getItem("username");
    if (!newProduct.libelle || !newProduct.description) {
      toast.error("Le libellé et la description sont obligatoires");
      return;
    }

    const token = localStorage.getItem("token");
    const logedUserId = localStorage.getItem("logedUserId");
    const formData = new FormData();
    formData.append("libelle", newProduct.libelle);
    formData.append("description", newProduct.description);
    formData.append("prix", newProduct.prix);
    formData.append("quantite", newProduct.quantite);
    formData.append("codeQr", newProduct.codeQr);
    if (newProduct.image) {
      formData.append("image", newProduct.image);
    }
    formData.append("categorieId", newProduct.categorieId);
    formData.append("shopId", newProduct.boutiqueId);
    formData.append("expiredAt", newProduct.date);
    formData.append("acteurUsername", username); 

    try {
      console.log("expiredAt",newProduct.date)
      console.log("formData",formData)
      console.log("token",token)
      console.log("logedUserId",logedUserId)
      console.log("newProduct",newProduct.username)
      const response = await fetch(`http://195.35.24.128:8081/api/products/new`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        
        throw new Error(`HTTP error! Status: ${response.status}`);
        toast(response.message)
      }

      const data = await response.json();
      setProducts([...products, data.data]);
      setFilteredProducts([...filteredProducts, data.data]);
      setIsEditing(false);
      setNewProduct({
        libelle: "",
        description: "",
        prix: 0,
        quantite: 0,
        codeQr: "",
        imagePath: null,
        categorieId: 0,
        boutiqueId: 0,
        expiredAt:'',
        acteurId: 0,
      });
      toast.success("Produit ajouté avec succès");
    } catch (err) {
      console.error("Error adding product:", err.message);
      toast.error("Erreur lors de l'ajout du produit");
    }
  };

  // Gérer la modification d'un produit
  const handleEditProduct = async () => {
    if (!currentProduct) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("id", currentProduct.id);
    formData.append("libelle", currentProduct.libelle);
    formData.append("description", currentProduct.description);
    formData.append("prix", currentProduct.prix);
    formData.append("quantite", currentProduct.quantite);
    formData.append("codeQr", currentProduct.codeQr);
    if (currentProduct.imagePath instanceof File) {
      formData.append("imagePath", currentProduct.imagePath);
    }
    formData.append("categorieId", currentProduct.categorieId);
    formData.append("boutiqueId", currentProduct.boutiqueId);
    formData.append("acteurId", currentProduct.acteurId);
    formData.append("expiredat", currentProduct.expiredAt);

    try {
      const response = await fetch(`http://195.35.24.128:8081/api/products/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const updatedProducts = products.map((product) =>
        product.id === currentProduct.id ? data.data : product
      );
      setProducts(updatedProducts);
      setFilteredProducts(
        filteredProducts.map((product) =>
          product.id === currentProduct.id ? data.data : product
        )
      );
      setIsEditing(false);
      setCurrentProduct(null);
      toast.success("Produit mis à jour avec succès");
    } catch (err) {
      console.error("Error updating product:", err.message);
      toast.error("Erreur lors de la mise à jour du produit");
    }
  };

  // Gérer la suppression d'un produit
  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/products/delete?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedProducts = products.filter((product) => product.id !== id);
      setProducts(updatedProducts);
      setFilteredProducts(
        filteredProducts.filter((product) => product.id !== id)
      );
      toast.success("Produit supprimé avec succès");
    } catch (err) {
      console.error("Error deleting product:", err.message);
      toast.error("Erreur lors de la suppression du produit");
    }
  };

  // Gérer l'ouverture du formulaire d'ajout
  const handleOpenAddProduct = () => {
    setCurrentProduct(null);
    setNewProduct({
      libelle: "",
      description: "",
      prix: 0,
      quantite: 0,
      codeQr: "",
      date:"",
      imagePath: null,
      categorieId: 0,
      boutiqueId: 0,
      acteurId: 0,
    });
    setIsEditing(true);
  };

  // Gérer l'ouverture du formulaire de modification
  const handleOpenEditProduct = (product) => {
    setCurrentProduct(product);
    setNewProduct({
      libelle: product.libelle,
      description: product.description,
      prix: product.prix,
      quantite: product.quantite,
      codeQr: product.codeQr,
      imagePath: product.imagePath,
      categorieId: product.categorieId,
      boutiqueId: product.boutiqueId,
      acteurId: product.acteurId,
      expiredAt:product.expiredAt
    });
    setIsEditing(true);
  };

  // Gérer les changements de formulaire
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...newProduct,
      [name]:
        name === "prix" || name === "quantite" || name === "acteurId"
          ? parseFloat(value) || 0
          : value,
    };
    if (currentProduct) {
      setCurrentProduct(updatedData);
    } else {
      setNewProduct(updatedData);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (currentProduct) {
        setCurrentProduct({ ...currentProduct, imagePath: file });
      } else {
        setNewProduct({ ...newProduct, imagePath: file });
      }
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-gray-500 mt-1">Gérez votre catalogue de produits et les stocks</p>
        </div>
        <Toaster />
        <Button onClick={handleOpenAddProduct} className="flex items-center gap-2">
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
            {products.filter((p) => p?.quantite === 0 || p?.quantite <= 10).length} produits sont en rupture de stock ou en stock faible.
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
          <CardDescription>Liste complète des produits avec statut de stock</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Prix</TableHead>
                <TableHead className="text-center">Boutique</TableHead>
                <TableHead className="text-center">Quantité</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProductsList.length > 0 ? (
                filteredProductsList.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.libelle}</TableCell>
                    <TableCell>{product.categorieIntitule}</TableCell>
                    <TableCell className="text-right">{product.prix.toFixed(2)} €</TableCell>
                    <TableCell className="text-center">{product.boutiqueNom}</TableCell>
                    <TableCell className="text-center">{product.quantite}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(product.quantite)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditProduct(product)}
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
                          onClick={() => toast.info(`Options pour ${product.libelle}`)}
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
            Affichage de {filteredProductsList.length} produits sur {products.length} au total
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
                {currentProduct
                  ? "Modifiez les informations du produit"
                  : "Remplissez le formulaire pour ajouter un nouveau produit"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* <div className="space-y-2">
                    <Label htmlFor="libelle">Nom du produit</Label>
                    <Input
                      id="libelle"
                      name="libelle"
                      type="hidden"
                      placeholder="Produit"
                      value={currentProduct ? currentProduct.username : newProduct.username}
                      onChange={handleFormChange}
                      required
                    />
                  </div> */}
                  <div className="space-y-2">
                    <Label htmlFor="libelle">Nom du produit</Label>
                    <Input
                      id="libelle"
                      name="libelle"
                      placeholder="Produit"
                      value={currentProduct ? currentProduct.libelle : newProduct.libelle}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date d'expiration</Label>
                    <Input
                    type="date"
                      id="libelle"
                      name="date"
                      placeholder="date"
                      value={currentProduct ? currentProduct.date : newProduct.date}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categorieId">Catégorie</Label>
                    <Select
                      value={
                        currentProduct ? currentProduct.categorieId.toString() : newProduct.categorieId.toString()
                      }
                      onValueChange={(value) =>
                        handleFormChange({ target: { name: "categorieId", value: parseInt(value) || 0 } })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.intitule}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prix">Prix (€)</Label>
                    <Input
                      id="prix"
                      name="prix"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="8.99"
                      value={currentProduct ? currentProduct.prix : newProduct.prix}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="boutiqueId">Boutique</Label>
                    <Select
                      value={
                        currentProduct ? currentProduct.boutiqueId.toString() : newProduct.boutiqueId.toString()
                      }
                      onValueChange={(value) =>
                        handleFormChange({ target: { name: "boutiqueId", value: parseInt(value) || 0 } })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une boutique" />
                      </SelectTrigger>
                      <SelectContent>
                        {shops.map((shop) => (
                          <SelectItem key={shop.id} value={shop.id.toString()}>
                            {shop.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantite">Quantité</Label>
                    <Input
                      id="quantite"
                      name="quantite"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={currentProduct ? currentProduct.quantite : newProduct.quantite}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codeQr">Code QR</Label>
                    <Input
                      id="codeQr"
                      name="codeQr"
                      placeholder="Code QR"
                      value={currentProduct ? currentProduct.codeQr : newProduct.codeQr}
                      onChange={handleFormChange}
                    />
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="acteurId">ID Acteur</Label>
                    <Input
                      id="acteurId"
                      name="acteurId"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={currentProduct ? currentProduct.acteurId : newProduct.acteurId}
                      onChange={handleFormChange}
                    />
                  </div> */}
                  <div className="space-y-2">
                    <Label htmlFor="imagePath">Image</Label>
                    <Input
                      id="imagePath"
                      name="imagePath"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Description du produit"
                    value={currentProduct ? currentProduct.description : newProduct.description}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                  <Button
                    type="button"
                    className="flex items-center gap-2"
                    onClick={currentProduct ? handleEditProduct : handleAddProduct}
                  >
                    <Save size={16} />
                    {currentProduct ? "Mettre à jour" : "Ajouter"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;