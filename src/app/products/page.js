"use client";
import { Badge } from "@/components/ui/badge";
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
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

// Fonction pour formater la date pour l'API (yyyy-mm-dd)
const formatDateForAPI = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`; // Format attendu par l'endpoint
};

// Fonction pour convertir une date API (yyyy/mm/dd) en format compatible avec le date picker (yyyy-mm-dd)
const formatDateForInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // Remplace les / par des - si nécessaire
};

const AddProductForm = ({ onClose, onAdd, categories, shops, newProduct, setNewProduct, loading }) => {
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
      toast.success(data.message);
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categorieId">Catégorie</Label>
            <Select
              value={newProduct.categorieId.toString()}
              onValueChange={(value) =>
                handleFormChange({ target: { name: "categorieId", value: parseInt(value) || 0 } })
              }
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="boutiqueId">Boutique</Label>
            <Select
              value={newProduct.boutiqueId.toString()}
              onValueChange={(value) =>
                handleFormChange({ target: { name: "boutiqueId", value: parseInt(value) || 0 } })
              }
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
            disabled={loading}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button onClick={handleAddProduct} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ajouter"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

const EditProductForm = ({ onClose, onEdit, categories, shops, currentProduct, setCurrentProduct, loading }) => {
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
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
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
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiredAt">Date d'expiration</Label>
            <Input
              type="date"
              id="expiredAt"
              name="expiredAt"
              value={formatDateForInput(currentProduct.expiredAt)}
              onChange={handleFormChange}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categorieId">Catégorie</Label>
            <Select
              value={currentProduct.categorieId.toString()}
              onValueChange={(value) =>
                handleFormChange({ target: { name: "categorieId", value: parseInt(value) || 0 } })
              }
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="boutiqueId">Boutique</Label>
            <Select
              value={currentProduct.boutiqueId.toString()}
              onValueChange={(value) =>
                handleFormChange({ target: { name: "boutiqueId", value: parseInt(value) || 0 } })
              }
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
            disabled={loading}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button onClick={handleEditProduct} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

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
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("all"); // Filtre: all, categorie, boutique, statut
  const [filterValue, setFilterValue] = useState(""); // Valeur du filtre
  const [sortField, setSortField] = useState("libelle"); // Champ de tri
  const [sortOrder, setSortOrder] = useState("asc"); // Ordre: asc, desc

  const fetchProducts = async () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    setLoading(true);
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
    } catch (err) {
      console.error("Error fetching products:", err.message);
      toast.error("Erreur lors de la récupération des produits");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchShops = async () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories(), fetchShops()]);
  }, []);

  // Filtrer et trier les produits
  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Filtrage par recherche
    filtered = filtered.filter(
      (product) =>
        product?.libelle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product?.categorieIntitule?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product?.boutiqueNom?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filtrage supplémentaire
    if (filterType === "categorie" && filterValue) {
      filtered = filtered.filter((product) => product.categorieId === parseInt(filterValue));
    } else if (filterType === "boutique" && filterValue) {
      filtered = filtered.filter((product) => product.boutiqueId === parseInt(filterValue));
    } else if (filterType === "statut" && filterValue) {
      filtered = filtered.filter((product) => {
        if (filterValue === "rupture") return product.quantite === 0;
        if (filterValue === "faible") return product.quantite <= 10 && product.quantite > 0;
        if (filterValue === "disponible") return product.quantite > 10;
        return true;
      });
    }

    // Tri
    filtered.sort((a, b) => {
      if (sortField === "libelle") {
        return sortOrder === "asc"
          ? a.libelle.localeCompare(b.libelle)
          : b.libelle.localeCompare(a.libelle);
      } else if (sortField === "prix") {
        return sortOrder === "asc" ? a.prix - b.prix : b.prix - a.prix;
      } else if (sortField === "quantite") {
        return sortOrder === "asc" ? a.quantite - b.quantite : b.quantite - a.quantite;
      }
      return 0;
    });

    return filtered;
  };

  const filteredProductsList = applyFiltersAndSort();

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
      expiredAt: formatDateForInput(product.expiredAt), // Convertir pour le date picker
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
    setLoading(true);
    try {
      const response = await fetch(
        `http://195.35.24.128:8081/api/products/delete/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      toast.success("Produit supprimé avec succès");
      await fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err.message);
      toast.error("Erreur lors de la suppression du produit");
      await fetchProducts();
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = (newProductData) => {
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
    fetchProducts();
  };

  const handleEditSuccess = (updatedProduct) => {
    setCurrentProduct(null);
    setIsEditProductOpen(false);
    fetchProducts();
  };

  return (
    <div className="container mx-auto py-6">
      <Toaster />
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            <span className="text-gray-600">Traitement en cours...</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-gray-500 mt-1">Gérez votre catalogue de produits et les stocks</p>
        </div>
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAddProduct} className="flex items-center gap-2" disabled={loading}>
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
            loading={loading}
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
            disabled={loading}
          />
        </div>
        <div className="flex gap-3">
          <Select value={filterType} onValueChange={setFilterType} disabled={loading}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="categorie">Catégorie</SelectItem>
              <SelectItem value="boutique">Boutique</SelectItem>
              <SelectItem value="statut">Statut</SelectItem>
            </SelectContent>
          </Select>
          {filterType !== "all" && (
            <Select value={filterValue} onValueChange={setFilterValue} disabled={loading}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={`Sélectionner ${filterType}`} />
              </SelectTrigger>
              <SelectContent>
                {filterType === "categorie" &&
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.intitule}
                    </SelectItem>
                  ))}
                {filterType === "boutique" &&
                  shops.map((shop) => (
                    <SelectItem key={shop.id} value={shop.id.toString()}>
                      {shop.nom}
                    </SelectItem>
                  ))}
                {filterType === "statut" && (
                  <>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="faible">Stock faible</SelectItem>
                    <SelectItem value="rupture">Rupture</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          )}
          <Select value={sortField} onValueChange={setSortField} disabled={loading}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="libelle">Nom</SelectItem>
              <SelectItem value="prix">Prix</SelectItem>
              <SelectItem value="quantite">Quantité</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            disabled={loading}
          >
            <ArrowUpDown size={16} />
            <span>{sortOrder === "asc" ? "Croissant" : "Décroissant"}</span>
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
                          disabled={loading}
                        >
                          <Edit size={16} className="text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={loading}
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </Button>
                        {/* <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toast.info(`Options pour ${product.libelle}`)}
                          disabled={loading}
                        >
                          <MoreHorizontal size={16} />
                        </Button> */}
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
            loading={loading}
          />
        )}
      </Dialog>
    </div>
  );
};

export default ProductManagement;