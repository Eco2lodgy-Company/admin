"use client"
import React, { useEffect, useState } from 'react';
import { mockUsers } from '@/data/mockData';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  UserCircle,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function UserManagement() {
  
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({
    role: 'client',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    tel: '',
    address: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://192.168.1.156:8000/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
        console.log('Users fetched successfully:', data);
      } catch (err) {
        console.error('Error fetching users:', err.message);
        // Optionally fall back to mock data if API fails
        // setUsers(mockUsers);
        // setFilteredUsers(mockUsers);
      }
    };
    
    fetchUsers();
  }, []);
  // Handle search and filter
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterUsers(query, roleFilter);
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    filterUsers(searchQuery, role);
  };

  const filterUsers = (query, role) => {
    let filtered = users;
    
    if (query) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(query) || 
        user.first_name.toLowerCase().includes(query) || 
        user.last_name.toLowerCase().includes(query)
      );
    }
    
    if (role && role !== 'all') {
      filtered = filtered.filter(user => user.role === role);
    }
    
    setFilteredUsers(filtered);
  };

  // Add new user
  const handleAddUser = () => {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    
    const user = {
      id: uuid,
      ...newUser,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setUsers([...users, user]);
    setFilteredUsers([...filteredUsers, user]);
    setIsAddUserOpen(false);
    setNewUser({
      role: 'client',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      tel: '',
      address: ''
    });
    
    toast.success('Utilisateur ajouté avec succès');
  };

  // Edit user
  const handleEditUser = () => {
    if (!currentUser) return;
    
    const updatedUsers = users.map(user => 
      user.id === currentUser.id ? { ...currentUser, updated_at: new Date().toISOString() } : user
    );
    
    setUsers(updatedUsers);
    setFilteredUsers(
      filteredUsers.map(user => 
        user.id === currentUser.id ? { ...currentUser, updated_at: new Date().toISOString() } : user
      )
    );
    
    setIsEditUserOpen(false);
    setCurrentUser(null);
    toast.success('Utilisateur mis à jour avec succès');
  };

  // Delete user
  const handleDeleteUser = () => {
    if (!currentUser) return;
    
    const updatedUsers = users.filter(user => user.id !== currentUser.id);
    setUsers(updatedUsers);
    setFilteredUsers(filteredUsers.filter(user => user.id !== currentUser.id));
    
    setIsDeleteUserOpen(false);
    setCurrentUser(null);
    toast.success('Utilisateur supprimé avec succès');
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return 'Date invalide';
      console.error(e);
    }
  };

  // Get role badge style
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'seller':
        return 'bg-blue-100 text-blue-800';
      case 'deliverer':
        return 'bg-green-100 text-green-800';
      case 'client':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get translated role name
  const getRoleName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'seller':
        return 'Vendeur';
      case 'deliverer':
        return 'Livreur';
      case 'client':
        return 'Client';
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <p className="text-gray-500 mt-1">Ajouter, modifier ou supprimer des utilisateurs</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Liste des utilisateurs</CardTitle>
              <CardDescription>
                {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  type="search" 
                  placeholder="Rechercher..." 
                  className="pl-8 w-full sm:w-[260px]" 
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <Select value={roleFilter} onValueChange={handleRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="admin">Administrateurs</SelectItem>
                  <SelectItem value="seller">Vendeurs</SelectItem>
                  <SelectItem value="deliverer">Livreurs</SelectItem>
                  <SelectItem value="client">Clients</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Ajouter un utilisateur</DialogTitle>
                    <DialogDescription>
                      Créer un nouvel utilisateur dans le système
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">
                        Rôle
                      </Label>
                      <Select 
                        value={newUser.role} 
                        onValueChange={(value) => setNewUser({...newUser, role: value})}
                      >
                        <SelectTrigger id="role" className="col-span-3">
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrateur</SelectItem>
                          <SelectItem value="seller">Vendeur</SelectItem>
                          <SelectItem value="deliverer">Livreur</SelectItem>
                          <SelectItem value="client">Client</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="first_name" className="text-right">
                        Prénom
                      </Label>
                      <Input
                        id="first_name"
                        className="col-span-3"
                        value={newUser.first_name}
                        onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="last_name" className="text-right">
                        Nom
                      </Label>
                      <Input
                        id="last_name"
                        className="col-span-3"
                        value={newUser.last_name}
                        onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        className="col-span-3"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        Mot de passe
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        className="col-span-3"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tel" className="text-right">
                        Téléphone
                      </Label>
                      <Input
                        id="tel"
                        className="col-span-3"
                        value={newUser.tel}
                        onChange={(e) => setNewUser({...newUser, tel: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="address" className="text-right">
                        Adresse
                      </Label>
                      <Input
                        id="address"
                        className="col-span-3"
                        value={newUser.address}
                        onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddUser}>Ajouter</Button>
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
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-semibold",
                          getRoleBadge(user.role)
                        )}>
                          {getRoleName(user.role)}
                        </span>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.tel || "-"}</TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
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
                                setCurrentUser(user);
                                setIsEditUserOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentUser(user);
                                setIsDeleteUserOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Aucun utilisateur trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen && currentUser !== null} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Mettre à jour les informations de l'utilisateur
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Rôle
                </Label>
                <Select 
                  value={currentUser.role} 
                  onValueChange={(value) => setCurrentUser({...currentUser, role: value})}
                >
                  <SelectTrigger id="edit-role" className="col-span-3">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="seller">Vendeur</SelectItem>
                    <SelectItem value="deliverer">Livreur</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-first-name" className="text-right">
                  Prénom
                </Label>
                <Input
                  id="edit-first-name"
                  className="col-span-3"
                  value={currentUser.first_name || ''}
                  onChange={(e) => setCurrentUser({...currentUser, first_name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-last-name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="edit-last-name"
                  className="col-span-3"
                  value={currentUser.last_name || ''}
                  onChange={(e) => setCurrentUser({...currentUser, last_name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  className="col-span-3"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-tel" className="text-right">
                  Téléphone
                </Label>
                <Input
                  id="edit-tel"
                  className="col-span-3"
                  value={currentUser.tel || ''}
                  onChange={(e) => setCurrentUser({...currentUser, tel: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">
                  Adresse
                </Label>
                <Input
                  id="edit-address"
                  className="col-span-3"
                  value={currentUser.address || ''}
                  onChange={(e) => setCurrentUser({...currentUser, address: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditUser}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer l'utilisateur</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="py-4">
              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserCircle className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{currentUser.first_name} {currentUser.last_name}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-3 w-3 mr-1" />
                    {currentUser.email}
                  </div>
                  {currentUser.tel && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-3 w-3 mr-1" />
                      {currentUser.tel}
                    </div>
                  )}
                  {currentUser.address && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {currentUser.address}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}