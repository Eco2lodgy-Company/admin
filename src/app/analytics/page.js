"use client"
import {React,useState,useEffect} from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { appStatistics } from '@/data/mockData';
import { 
  Users, 
  Store, 
  ShoppingBag, 
  DollarSign,
  Map, 
  Star, 
  TrendingUp,
  Activity
} from 'lucide-react';

// Helper function to ensure consistent number formatting
const formatNumber = (value) => {
  // Use a specific locale (e.g., 'en-US') for consistency between server and client
  return value?.toLocaleString('fr-FR');
};

const StatisticsPage = () => {
  const { 
    userStats, 
    shopStats, 
    orderStats, 
    revenueStats, 
    regionalStats, 
    customerStats, 
    marketingStats 
  } = appStatistics;
   const [dashboardStatsGlobal, setDashboardStatsGlobal] = useState([]);
    const [dashboardStats, setDashboardStats] = useState([]);
    useEffect(() => {
      const username = localStorage.getItem('username'); // Assuming username is stored in localStorage
      const token = localStorage.getItem('token'); // Assuming username is stored in localStorage
      const fetchStatsGlobal = async () => {
        try {
          const response = await fetch(`http://195.35.24.128:8081/api/statistique/admin/global?username=${username}`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          console.log('Dashboard Stats Global:', data);
          setDashboardStatsGlobal(data.data);
        } catch (error) {
          console.error('Error fetching dashboard stats:', error);
        }
      } 
  
      const fetchStatsDash = async () => {
        try {
          const response = await fetch(`http://195.35.24.128:8081/api/statistique/admin/dashboard?username=${username}`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          console.log('Dashboard Stats Global:', data);
          setDashboardStats(data.data);
        } catch (error) {
          console.error('Error fetching dashboard stats:', error);
        }
      } 
      fetchStatsGlobal();
      fetchStatsDash();
    }, []);

  // Couleurs pour les graphiques
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Données pour le graphique utilisateurs par rôle
  const userRoleData = [
    { name: 'Admin', value: dashboardStatsGlobal.administrateurs },
    { name: 'Vendeurs', value: dashboardStatsGlobal.vendeurs },
    { name: 'Livreurs', value: dashboardStatsGlobal.livreurs },
    { name: 'Clients', value:dashboardStatsGlobal.clients }
  ];

  // Données pour le graphique des sources de revenus
  const revenueSourceData = [
    { name: 'Commissions', value: revenueStats.revenueSources.commissions },
    { name: 'Abonnements', value: revenueStats.revenueSources.subscriptions },
  ];

  // Données pour le graphique des meilleures régions
  const topRegionsData = regionalStats.topRegions.map(region => ({
    name: region.name,
    commandes: region.orders,
    revenu: region.revenue
  }));

  // Données pour le graphique des meilleures catégories
  const topCategoriesData = shopStats.topPerformingCategories.map(category => ({
    name: category.name,
    ventes: category.sales
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Statistiques Globales</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Carte utilisateurs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStatsGlobal.users}</div>
            <p className="text-xs text-muted-foreground">
              +{userStats.newUsersThisMonth} ce mois-ci ({userStats.userGrowthRate}%)
            </p>
          </CardContent>
        </Card>

        {/* Carte boutiques */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Boutiques</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStatsGlobal.shops}</div>
            <p className="text-xs text-muted-foreground">
              +{shopStats.newShopsThisMonth} ce mois-ci ({shopStats.shopGrowthRate}%)
            </p>
          </CardContent>
        </Card>

        {/* Carte commandes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStatsGlobal.commandes}</div>
            <p className="text-xs text-muted-foreground">
              {orderStats.ordersThisMonth} ce mois-ci (Moy: {orderStats.averageOrderValue}€)
            </p>
          </CardContent>
        </Card>

        {/* Carte revenus */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardStatsGlobal.revenu)}€</div>
            <p className="text-xs text-muted-foreground">
              +{revenueStats.revenueGrowth.toString()}% de croissance
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Graphique utilisateurs par rôle */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Utilisateurs par rôle</CardTitle>
            <CardDescription>Distribution des utilisateurs par type de compte</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Graphique sources de revenus */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Sources de revenus</CardTitle>
            <CardDescription>Répartition des différentes sources de revenus</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueSourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {revenueSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${formatNumber(value)}€`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Graphique des meilleures régions */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              <span>Top 5 des Boutiques</span>
            </CardTitle>
            <CardDescription>Performance par Boutiques</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topRegionsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip formatter={(value) => formatNumber(value)} />
                <Legend />
                <Bar yAxisId="left" dataKey="commandes" fill="#8884d8" name="Commandes" />
                <Bar yAxisId="right" dataKey="revenu" fill="#82ca9d" name="Revenu (€)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Graphique des meilleures catégories */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span>Top Catégories</span>
            </CardTitle>
            <CardDescription>Meilleures catégories par ventes</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topCategoriesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => `${formatNumber(value)}€`} />
                <Legend />
                <Bar dataKey="ventes" fill="#8884d8" name="Ventes (€)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Carte satisfaction client */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <span>Satisfaction Client</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <span>Note moyenne:</span>
                <span className="font-bold">{customerStats.averageRating}/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Taux de satisfaction:</span>
                <span className="font-bold">{customerStats.satisfactionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Taux de retour:</span>
                <span className="font-bold">{customerStats.returnRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Taux de réclamation:</span>
                <span className="font-bold">{customerStats.complaintRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Temps de réponse moyen:</span>
                <span className="font-bold">{customerStats.responseTime}h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carte statuts des commandes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              <span>Statuts des Commandes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <span>En attente:</span>
                <span className="font-bold">{orderStats.orderStatuses.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>En cours:</span>
                <span className="font-bold">{orderStats.orderStatuses.inProgress}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Livrées:</span>
                <span className="font-bold">{orderStats.orderStatuses.delivered}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Taux de complétion:</span>
                <span className="font-bold">{orderStats.orderCompletionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Temps de livraison moyen:</span>
                <span className="font-bold">{orderStats.averageDeliveryTime} jours</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carte Marketing */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span>Performance Marketing</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <span>Taux de conversion:</span>
                <span className="font-bold">{marketingStats.conversionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Coût par acquisition:</span>
                <span className="font-bold">{marketingStats.costPerAcquisition}€</span>
              </div>
              <div className="flex justify-between items-center">
                <span>ROI Marketing:</span>
                <span className="font-bold">{marketingStats.marketingROI}%</span>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Principaux canaux:</p>
                <ul className="text-sm space-y-1">
                  {marketingStats.acquisitionChannels.slice(0, 3).map((channel, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{channel.name}</span>
                      <span>{channel.percentage}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default StatisticsPage;