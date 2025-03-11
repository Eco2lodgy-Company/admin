"use client"
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, AlertCircle, Clock, CheckCheck, User, Store, Truck, CreditCard } from 'lucide-react';
import { mockNotifications } from '@/data/mockData';

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  // Filtering notifications by read status
  const unreadNotifications = notifications.filter(notification => !notification.read);
  const readNotifications = notifications.filter(notification => notification.read);

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <CreditCard className="w-5 h-5 text-blue-500" />;
      case 'user':
        return <User className="w-5 h-5 text-green-500" />;
      case 'shop':
        return <Store className="w-5 h-5 text-purple-500" />;
      case 'delivery':
        return <Truck className="w-5 h-5 text-orange-500" />;
      case 'payment':
        return <CreditCard className="w-5 h-5 text-emerald-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unreadNotifications.length > 0 && (
          <Button onClick={markAllAsRead} variant="outline" className="gap-2">
            <CheckCheck size={16} />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <span>Centre de notifications</span>
              {unreadNotifications.length > 0 && (
                <Badge className="ml-2 bg-primary">{unreadNotifications.length}</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Suivez les activités importantes de votre plateforme.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Unread notifications */}
            {unreadNotifications.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500">Nouvelles notifications</h3>
                <div className="space-y-3">
                  {unreadNotifications.map((notification) => (
                    <div key={notification.id} className="flex p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="mr-4 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">{notification.message}</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 w-6"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Read notifications */}
            {readNotifications.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500">Notifications précédentes</h3>
                <div className="space-y-3">
                  {readNotifications.map((notification) => (
                    <div key={notification.id} className="flex p-3 bg-gray-50 rounded-lg">
                      <div className="mr-4 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Pas de notifications</h3>
                <p className="text-gray-500 mt-2">Vous n'avez aucune notification pour le moment.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques des notifications</CardTitle>
            <CardDescription>
              Résumé des activités récentes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">Activités utilisateurs</span>
                </div>
                <Badge variant="outline">
                  {notifications.filter(n => n.type === 'user').length}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Store className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-sm">Activités boutiques</span>
                </div>
                <Badge variant="outline">
                  {notifications.filter(n => n.type === 'shop').length}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-sm">Livraisons</span>
                </div>
                <Badge variant="outline">
                  {notifications.filter(n => n.type === 'delivery').length}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-emerald-500 mr-2" />
                  <span className="text-sm">Paiements</span>
                </div>
                <Badge variant="outline">
                  {notifications.filter(n => n.type === 'payment').length}
                </Badge>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm">Non lues</span>
                </div>
                <Badge variant="outline" className="bg-red-50 text-red-500">
                  {unreadNotifications.length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;