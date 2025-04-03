
  // Dashboard.jsx
  "use client";
  import React, { useState, useEffect, } from 'react';
   
import { useRouter } from 'next/navigation'
  import jwt from 'jsonwebtoken'
  import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
  import { 
    Users, 
    ShoppingBag, 
    Truck, 
    Store, 
    CreditCard, 
    ArrowUpRight, 
    Clock, 
    CheckCircle,
    Loader2,
 
  } from 'lucide-react';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { cn } from '@/lib/utils';
  import { Toaster } from "@/components/ui/sonner";
import { toast } from 'sonner';

  // Stats Card Component
  const StatsCard = ({ 
    title, 
    value, 
    icon, 
    description, 
    trend, 
    trendLabel,
    className
  }) => (
    <Card className={cn("hover-scale", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
            {trend !== undefined && (
              <div className="flex items-center mt-2">
                <div className={cn(
                  "flex items-center text-xs font-medium",
                  trend >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  <ArrowUpRight className={cn(
                    "h-3 w-3 mr-1",
                    trend < 0 && "transform rotate-90"
                  )} />
                  {Math.abs(trend)}%
                </div>
                {trendLabel && (
                  <span className="text-xs text-gray-500 ml-1">{trendLabel}</span>
                )}
              </div>
            )}
          </div>
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Activity Item Component
  const ActivityItem = ({ type, message, time }) => {
    const getIcon = () => {
      switch (type) {
        case 'order':
          return <ShoppingBag className="h-5 w-5 text-blue-500" />;
        case 'user':
          return <Users className="h-5 w-5 text-green-500" />;
        case 'payment':
          return <CreditCard className="h-5 w-5 text-purple-500" />;
        case 'shop':
          return <Store className="h-5 w-5 text-orange-500" />;
        default:
          return <Clock className="h-5 w-5 text-gray-500" />;
      }
    };

    return (
      <div className="flex items-start space-x-3 py-3">
        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{message}</p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </div>
    );
  };

  // Custom Tooltip for Charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
          <p className="text-sm font-semibold">{`${label}`}</p>
          <p className="text-sm text-gray-600">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Main Dashboard Component
  export default function Dashboard() {
    
    const [dashboardStatsGlobal, setDashboardStatsGlobal] = useState({});
    const [dashboardStats, setDashboardStats] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const username = localStorage.getItem('username');
      const token = localStorage.getItem('token');
      const decoded = jwt.decode(token)
      if (decoded?.exp && Date.now() >= decoded?.exp * 1000) {
       Router.push('/')
      toast.error("Session expirée, veuillez vous reconnecter.");
      }

      const fetchStatsGlobal = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `http://195.35.24.128:8081/api/statistique/admin/global?username=${username}`,
            {
              method: 'GET',
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Dashboard Stats Global:', data);
          setDashboardStatsGlobal(data.data || {});
          toast.success("Statistiques globales chargées avec succès !");
        } catch (error) {
          console.error('Error fetching global stats:', error);
          toast.error("Erreur lors du chargement des statistiques globales.");
        } finally {
          setLoading(false);
        }
      };

      const fetchStatsDash = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `http://195.35.24.128:8081/api/statistique/admin/dashboard?username=${username}`,
            {
              method: 'GET',
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Dashboard Stats:', data);
          setDashboardStats(data.data || {});
        } catch (error) {
          console.error('Error fetching dashboard stats:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchStatsGlobal();
      fetchStatsDash();
    }, []);

    // Formatter pour les valeurs monétaires
    const formatter = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble de votre plateforme</p>
        </div>

        <Toaster />
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
              <span className="text-gray-600">Chargement des statistiques...</span>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Utilisateurs" 
            value={dashboardStatsGlobal.users || 0} 
            icon={<Users className="h-6 w-6" />}
            trend={8}
            trendLabel="vs mois précédent"
          />
          <StatsCard 
            title="Commandes" 
            value={dashboardStatsGlobal.commandes || 0} 
            icon={<ShoppingBag className="h-6 w-6" />}
            trend={12}
            trendLabel="vs mois précédent"
          />
          <StatsCard 
            title="Boutiques" 
            value={dashboardStatsGlobal.shops || 0} 
            icon={<Store className="h-6 w-6" />}
            trend={5}
            trendLabel="vs mois précédent"
          />
          <StatsCard 
            title="Revenu Mensuel" 
            value={formatter.format(dashboardStatsGlobal.revenu || 0)} 
            icon={<CreditCard className="h-6 w-6" />}
            trend={15}
            trendLabel="vs mois précédent"
          />
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          <StatsCard 
            title="Commandes en attente" 
            value={dashboardStats.commandesAttente || 0} 
            icon={<Clock className="h-6 w-6" />}
            className="bg-yellow-50 border-yellow-100"
          />
          <StatsCard 
            title="Commandes en cours" 
            value={dashboardStats.commandesEncours || 0} 
            icon={<Truck className="h-6 w-6" />}
            className="bg-blue-50 border-blue-100"
          />
          <StatsCard 
            title="Commandes livrées" 
            value={dashboardStats.commandesLivre || 0} 
            icon={<CheckCircle className="h-6 w-6" />}
            className="bg-green-50 border-green-100"
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Orders Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">Évolution des commandes</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardStats.monthlyOrdersData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="orders" name="Commandes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity (commenté, donc non modifié) */}
          {/* <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-[320px] overflow-y-auto pr-2">
                {dashboardStats.recentActivity.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    type={activity.type}
                    message={activity.message}
                    time={activity.time}
                  />
                ))}
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Revenue Chart */}
        <Card className="mt-6">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">Évolution des revenus</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardStats.monthlyRevenueData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Revenu (€)" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6, strokeWidth: 0 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
