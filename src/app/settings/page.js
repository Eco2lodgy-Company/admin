import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Lock, 
  Globe, 
  CreditCard,
  Percent,
  ShieldCheck
} from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Paramètres</h1>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 w-full">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Général</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="commissions" className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            <span className="hidden sm:inline">Commissions</span>
          </TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les paramètres de base de votre plateforme multivendeur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Nom de la plateforme</Label>
                <Input id="site-name" defaultValue="MultiVendor Market" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Description</Label>
                <Textarea 
                  id="site-description" 
                  defaultValue="Plateforme de vente multivendeur avec livraison" 
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email de contact</Label>
                <Input id="contact-email" type="email" defaultValue="contact@multivendor.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Téléphone de contact</Label>
                <Input id="contact-phone" defaultValue="+33 1 23 45 67 89" />
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <Switch id="maintenance-mode" />
                <Label htmlFor="maintenance-mode">Mode maintenance</Label>
              </div>
              <Button className="mt-4">Enregistrer les modifications</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Région et langue</CardTitle>
              <CardDescription>
                Configurez les paramètres régionaux de votre plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <Input id="timezone" defaultValue="Europe/Paris" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-format">Format de date</Label>
                <Input id="date-format" defaultValue="DD/MM/YYYY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Input id="currency" defaultValue="EUR" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Langue par défaut</Label>
                <Input id="language" defaultValue="Français" />
              </div>
              <Button className="mt-4">Enregistrer les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations de profil</CardTitle>
              <CardDescription>
                Mettez à jour vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">Prénom</Label>
                  <Input id="first-name" defaultValue="Admin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Nom</Label>
                  <Input id="last-name" defaultValue="User" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="admin@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" defaultValue="+33 6 12 34 56 78" />
              </div>
              <Button className="mt-4">Mettre à jour le profil</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du compte</CardTitle>
              <CardDescription>
                Gérez vos informations de sécurité et d'authentification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <Switch id="two-factor" />
                <Label htmlFor="two-factor">Activer l'authentification à deux facteurs</Label>
              </div>
              <Button className="mt-4">Mettre à jour le mot de passe</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sessions actives</CardTitle>
              <CardDescription>
                Gérez les appareils connectés à votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Chrome / Windows</p>
                    <p className="text-sm text-gray-500">Paris, France • Actif maintenant</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Actuel
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Safari / macOS</p>
                    <p className="text-sm text-gray-500">Lyon, France • Dernière activité: il y a 2 jours</p>
                  </div>
                  <Button variant="destructive" size="sm">Déconnecter</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notifications</CardTitle>
              <CardDescription>
                Configurez comment et quand vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nouvelles commandes</Label>
                    <p className="text-sm text-gray-500">Recevoir une notification lorsqu'une nouvelle commande est passée</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nouveaux utilisateurs</Label>
                    <p className="text-sm text-gray-500">Recevoir une notification lorsqu'un nouveau utilisateur s'inscrit</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nouvelles boutiques</Label>
                    <p className="text-sm text-gray-500">Recevoir une notification lorsqu'une nouvelle boutique est créée</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Paiements</Label>
                    <p className="text-sm text-gray-500">Recevoir une notification pour les transactions de paiement</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rapports hebdomadaires</Label>
                    <p className="text-sm text-gray-500">Recevoir un résumé hebdomadaire de l'activité</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>
              <Button className="mt-6">Enregistrer les préférences</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Commissions Settings */}
        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des commissions</CardTitle>
              <CardDescription>
                Définissez les taux de commission pour chaque type d'acteur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platform-commission">
                    Commission plateforme (%)
                  </Label>
                  <div className="flex gap-4 items-center">
                    <Input id="platform-commission" defaultValue="5" type="number" min="0" max="100" />
                    <p className="text-sm text-gray-500">Pourcentage prélevé par la plateforme sur chaque transaction</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="seller-commission">
                    Part vendeur (%)
                  </Label>
                  <div className="flex gap-4 items-center">
                    <Input id="seller-commission" defaultValue="85" type="number" min="0" max="100" />
                    <p className="text-sm text-gray-500">Pourcentage revenant au vendeur sur chaque vente</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deliverer-commission">
                    Part livreur (%)
                  </Label>
                  <div className="flex gap-4 items-center">
                    <Input id="deliverer-commission" defaultValue="10" type="number" min="0" max="100" />
                    <p className="text-sm text-gray-500">Pourcentage revenant au livreur sur chaque livraison</p>
                  </div>
                </div>
                
                <div className="rounded-lg bg-amber-50 p-4 border border-amber-200 mt-6">
                  <p className="text-sm text-amber-800">
                    Note: La somme des pourcentages doit être égale à 100%. Assurez-vous que la répartition est correcte.
                  </p>
                </div>
                
                <Button className="mt-4">Enregistrer les commissions</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Méthodes de paiement</CardTitle>
              <CardDescription>
                Gérez les options de paiement disponibles sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Carte bancaire</p>
                      <p className="text-sm text-gray-500">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-teal-500" />
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-gray-500">Paiement en ligne</p>
                    </div>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="font-medium">Virement bancaire</p>
                      <p className="text-sm text-gray-500">Paiement différé</p>
                    </div>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Espèces à la livraison</p>
                      <p className="text-sm text-gray-500">Paiement à la réception</p>
                    </div>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>
              <Button className="mt-6">Enregistrer les méthodes de paiement</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;