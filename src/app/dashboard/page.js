"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  Users, 
  ShoppingBag, 
  Truck, 
  Store, 
  CreditCard, 
  ArrowUpRight, 
  Clock, 
  CheckCircle
} from 'lucide-react';
import { dashboardStats } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Utilisateurs" 
          value={dashboardStats.totalUsers} 
          icon={<Users className="h-6 w-6" />}
          trend={8}
          trendLabel="vs mois précédent"
        />
        <StatsCard 
          title="Commandes" 
          value={dashboardStats.totalOrders} 
          icon={<ShoppingBag className="h-6 w-6" />}
          trend={12}
          trendLabel="vs mois précédent"
        />
        <StatsCard 
          title="Boutiques" 
          value={dashboardStats.totalSellers} 
          icon={<Store className="h-6 w-6" />}
          trend={5}
          trendLabel="vs mois précédent"
        />
        <StatsCard 
          title="Revenu Mensuel" 
          value={formatter.format(dashboardStats.monthlyRevenue)} 
          icon={<CreditCard className="h-6 w-6" />}
          trend={15}
          trendLabel="vs mois précédent"
        />
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <StatsCard 
          title="Commandes en attente" 
          value={dashboardStats.pendingOrders} 
          icon={<Clock className="h-6 w-6" />}
          className="bg-yellow-50 border-yellow-100"
        />
        <StatsCard 
          title="Commandes en cours" 
          value={dashboardStats.inProgressOrders} 
          icon={<Truck className="h-6 w-6" />}
          className="bg-blue-50 border-blue-100"
        />
        <StatsCard 
          title="Commandes livrées" 
          value={dashboardStats.deliveredOrders} 
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
                <BarChart data={dashboardStats.monthlyOrdersData}>
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

        {/* Recent Activity */}
        <Card>
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
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="mt-6">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Évolution des revenus</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardStats.monthlyRevenueData}>
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