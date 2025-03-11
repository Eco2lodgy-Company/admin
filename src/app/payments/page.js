"use client"
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Search, FileDown, Eye } from 'lucide-react';

// Mock data for payments
const mockPayments = [
  {
    id: 1,
    orderId: "ORD-2023-001",
    amount: 89.99,
    commission: 4.50,
    status: "completed",
    method: "card",
    customerName: "Jean Martin",
    date: "2023-06-15",
  },
  {
    id: 2,
    orderId: "ORD-2023-002",
    amount: 145.50,
    commission: 7.28,
    status: "pending",
    method: "paypal",
    customerName: "Sophie Dubois",
    date: "2023-06-16",
  },
  {
    id: 3,
    orderId: "ORD-2023-003",
    amount: 35.25,
    commission: 1.76,
    status: "failed",
    method: "bank_transfer",
    customerName: "Pierre Leroy",
    date: "2023-06-17",
  },
  {
    id: 4,
    orderId: "ORD-2023-004",
    amount: 210.75,
    commission: 10.54,
    status: "completed",
    method: "card",
    customerName: "Marie Durand",
    date: "2023-06-18",
  },
  {
    id: 5,
    orderId: "ORD-2023-005",
    amount: 55.00,
    commission: 2.75,
    status: "completed",
    method: "cash",
    customerName: "Thomas Bernard",
    date: "2023-06-19",
  },
];

const PaymentManagement = () => {
  const [payments] = useState(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Complété</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Échoué</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentMethod = (method) => {
    switch (method) {
      case 'card':
        return 'Carte bancaire';
      case 'paypal':
        return 'PayPal';
      case 'bank_transfer':
        return 'Virement bancaire';
      case 'cash':
        return 'Espèces';
      default:
        return method;
    }
  };

  const totalCommission = filteredPayments.reduce((sum, payment) => sum + payment.commission, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Paiements</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <FileDown size={16} /> Exporter
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total des paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredPayments.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)} €
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Commissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCommission.toFixed(2)} €
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Taux de commission moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredPayments.length ? (totalCommission * 100 / filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)).toFixed(1) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <span>Historique des paiements</span>
          </CardTitle>
          <CardDescription>
            Consultez tous les paiements effectués sur la plateforme.
          </CardDescription>
          
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par ID ou client..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="completed">Complété</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="failed">Échoué</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>N° Commande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.orderId}</TableCell>
                    <TableCell>{payment.customerName}</TableCell>
                    <TableCell>{payment.amount.toFixed(2)} €</TableCell>
                    <TableCell>{payment.commission.toFixed(2)} €</TableCell>
                    <TableCell>{getPaymentMethod(payment.method)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    Aucun paiement trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentManagement;