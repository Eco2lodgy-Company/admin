"use client";
import { Badge } from "@/components/ui/badge"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  ArrowUpDown,
  AlertCircle,
  Package,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

// Fonction utilitaire pour formater les dates avec "/"
const formatDateForAPI = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

// Fonction utilitaire pour convertir une date avec "/" en format compatible avec <Input type="date">
const formatDateForInput = (date) => {
  if (!date) return "";
  const [year, month, day] = date.split("/");
  return `${year}-${month}-${day}`;
};

// Formulaire d'ajout de produit
const AddProductForm = ({ onClose, onAdd, categories, shops, newProduct, setNewProduct }) => {
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === "prix" || name === "quantite" ? parseFloat(value) || 0 : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewProduct({ ...newProduct, image: file });
  };

  const handleAddProduct = async () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (!newProduct.libelle || !newProduct.description) {
      toast.error("Le libellé et la description sont obligatoires");
      return;
    }

    const formData = new FormData();
    formData.append("libelle", newProduct.libelle);
    formData.append("description", newProduct.description);
    formData.append("prix", newProduct.prix);
    formData.append("quantite", newProduct.quantite);
    formData.append("codeQr", newProduct.codeQr || "");
    if (newProduct.image) formData.append("image", newProduct.image);
    formData.append("categorieId", newProduct.categorieId);
    formData.append("shopId", newProduct.boutiqueId);
    formData.append("expiredAt", formatDateForAPI(newProduct.expiredAt));
    formData.append("acteurUsername", username);

    try {
      console.log("Adding product with data:", Object.fromEntries(formData));
      const response = await fetch(`http://195.35.24.128:8081/api/products/new`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      onAdd(data.data);
      toast.success("Produit ajouté avec succès");
      onClose();
    } catch (err) {
      console.error("Error adding product:", err.message);
      toast.error("Erreur lors de l'ajout du produit");
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Ajouter un produit</DialogTitle>
        <DialogDescription>Créer un nouveau produit dans le système</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="libelle">Nom du produit</Label>
            <Input
              id="libelle"
              name="libelle"
              placeholder="Produit"
              value={newProduct.libelle}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiredAt">Date d'expiration</Label>
            <Input
              type="date"
              id="expiredAt"
              name="expiredAt"
              value={newProduct.expiredAt}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categorieId">Catégorie</Label>
            <Select
              value={newProduct.categorieId.toString()}
              onValueChange={(value) =>
                handleFormChange({ target: { name: "categorieId", value: parseInt(value) || 0 } })
              }
            >
              <SelectTrigger className="w-full">
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
              value={newProduct.prix}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="boutiqueId">Boutique</Label>
            <Select
              value={newProduct.boutiqueId.toString()}
              onValueChange={(value) =>
                handleFormChange({ target: { name: "boutiqueId", value: parseInt(value) || 0 } })
              }
            >
              <SelectTrigger className="w-full">
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
              value={newProduct.quantite}
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
              value={newProduct.codeQr}
              onChange={handleFormChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              name="image"
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
            value={newProduct.description}
            onChange={handleFormChange}
            required
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={handleAddProduct}>Ajouter</Button>
      </DialogFooter>
    </DialogContent>
  );
};

// Formulaire de modification de produit
const EditProductForm = ({ onClose, onEdit, categories, shops, currentProduct, setCurrentProduct }) => {
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: name === "prix" || name === "quantite" ? parseFloat(value) || 0 : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setCurrentProduct({ ...currentProduct, image: file });
  };

  const handleEditProduct = async () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!currentProduct.libelle || !currentProduct.description) {
      toast.error("Le libellé et la description sont obligatoires");
      return;
    }

    const formData = new FormData();
    formData.append("id", currentProduct.id);
    formData.append("libelle", currentProduct.libelle);
    formData.append("description", currentProduct.description);
    formData.append("prix", currentProduct.prix);
    formData.append("quantite", currentProduct.quantite);
    formData.append("codeQr", currentProduct.codeQr || "");
    if (currentProduct.image instanceof File) formData.append("image", currentProduct.image);
    formData.append("categorieId", currentProduct.categorieId);
    formData.append("shopId", currentProduct.boutiqueId);
    formData.append("acteurUsername", username);
    formData.append("expiredAt", formatDateForAPI(currentProduct.expiredAt));

    try {
      console.log("Updating product with data:", Object.fromEntries(formData));
      const response = await fetch(
        `http://195.35.24.128:8081/api/products/update/${currentProduct.id}`,
        {
          method: "PUT",
          headers: {
             Authorization: `Bearer ${token}` },
          
          body: formData,
        }
      );
      console.log("response", response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log("response", response);
      const data = await response.json();
      onEdit(data.data);
      toast.success(data.message);
      onClose();
    } catch (err) {
      console.error("Error updating product:", err.message);
      toast.error("Erreur lors de la mise à jour du produit");
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Modifier le produit</DialogTitle>
        <DialogDescription>Mettre à jour les informations du produit</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="libelle">Nom du produit</Label>
            <Input
              id="libelle"
              name="libelle"
              placeholder="Produit"
              value={currentProduct.libelle}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiredAt">Date d'expiration</Label>
            <Input
              type="date"
              id="expiredAt"
              name="expiredAt"
              value={currentProduct.expiredAt}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categorieId">Catégorie</Label>
            <Select
              value={currentProduct.categorieId.toString()}
              onValueChange={(value) =>
                handleFormChange({ target: { name: "categorieId", value: parseInt(value) || 0 } })
              }
            >
              <SelectTrigger className="w-full">
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
              value={currentProduct.prix}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="boutiqueId">Boutique</Label>
            <Select
              value={currentProduct.boutiqueId.toString()}
              onValueChange={(value) =>
                handleFormChange({ target: { name: "boutiqueId", value: parseInt(value) || 0 } })
              }
            >
              <SelectTrigger className="w-full">
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
              value={currentProduct.quantite}
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
              value={currentProduct.codeQr}
              onChange={handleFormChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {currentProduct.image && (
              <img
                src={
                  currentProduct.image instanceof File
                    ? URL.createObjectURL(currentProduct.image)
                    : currentProduct.image
                }
                alt="Image du produit"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Description du produit"
            value={currentProduct.description}
            onChange={handleFormChange}
            required
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={handleEditProduct}>Enregistrer</Button>
      </DialogFooter>
    </DialogContent>
  );
};

// Composant principal
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [shops, setShops] = useState([]);
  const [newProduct, setNewProduct] = useState({
    libelle: "",
    description: "",
    expiredAt: "",
    prix: 0,
    quantite: 0,
    codeQr: "",
    image: null,
    categorieId: 0,
    boutiqueId: 0,
    acteurUsername: "",
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
  }, [setProducts]);

  const filteredProductsList = products.filter((product) =>
    product?.libelle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product?.categorieIntitule?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product?.boutiqueNom?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (quantite) => {
    if (quantite === 0) return <Badge variant="destructive">Rupture de stock</Badge>;
    if (quantite <= 10) return <Badge className="bg-yellow-500">Stock faible</Badge>;
    return <Badge variant="default" className="bg-green-500">Disponible</Badge>;
  };

  const handleOpenAddProduct = () => {
    setIsAddProductOpen(true);
  };

  const handleOpenEditProduct = (product) => {
    setCurrentProduct({
      id: product.id,
      libelle: product.libelle,
      description: product.description,
      expiredAt: product.expiredAt, // La date est déjà au format YYYY/MM/DD depuis le backend
      prix: product.prix,
      quantite: product.quantite,
      codeQr: product.codeQr,
      image: product.image,
      categorieId: product.categorieId,
      boutiqueId: product.boutiqueId,
      acteurUsername: product.acteurUsername,
    });
    setIsEditProductOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/products/delete/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      setProducts(products.filter((product) => product.id !== id));
      setFilteredProducts(filteredProducts.filter((product) => product.id !== id));
      toast.success("Produit supprimé avec succès");
    } catch (err) {
      console.error("Error deleting product:", err.message);
      toast.error("Erreur lors de la suppression du produit");
    }
  };

  const handleAddSuccess = (newProductData) => {
    setProducts([...products, newProductData]);
    setFilteredProducts([...filteredProducts, newProductData]);
    setNewProduct({
      libelle: "",
      description: "",
      expiredAt: "",
      prix: 0,
      quantite: 0,
      codeQr: "",
      image: null,
      categorieId: 0,
      boutiqueId: 0,
      acteurUsername: "",
    });
    setIsAddProductOpen(false);
  };

  const handleEditSuccess = (updatedProduct) => {
    const updatedProducts = products.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    setCurrentProduct(null);
    setIsEditProductOpen(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-gray-500 mt-1">Gérez votre catalogue de produits et les stocks</p>
        </div>
        <Toaster />
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAddProduct} className="flex items-center gap-2">
              <PlusCircle size={16} />
              <span>Ajouter un produit</span>
            </Button>
          </DialogTrigger>
          <AddProductForm
            onClose={() => setIsAddProductOpen(false)}
            onAdd={handleAddSuccess}
            categories={categories}
            shops={shops}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
          />
        </Dialog>
      </div>

      <div className="bg-yellow-50 border border-yellow-300 rounded-md p-4 mb-6 flex items-start">
        <AlertCircle className="text-yellow-500 mr-3 mt-0.5" size={20} />
        <div>
          <h3 className="font-medium text-yellow-800">Alerte de stock</h3>
          <p className="text-yellow-700 text-sm">
            {products.filter((p) => p?.quantite === 0 || p?.quantite <= 10).length} produits sont en rupture de stock ou en stock faible.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher un produit..."
            className="pl-8"
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

      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        {currentProduct && (
          <EditProductForm
            onClose={() => setIsEditProductOpen(false)}
            onEdit={handleEditSuccess}
            categories={categories}
            shops={shops}
            currentProduct={currentProduct}
            setCurrentProduct={setCurrentProduct}
          />
        )}
      </Dialog>
    </div>
  );
};

export default ProductManagement;