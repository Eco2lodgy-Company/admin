
export const mockUsers = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    role: 'admin',
    email: 'admin@example.com',
    password: 'hashed_password',
    first_name: 'Admin',
    last_name: 'User',
    tel: '+33600000000',
    address: '123 Admin Street, Paris',
    created_at: '2023-01-01T08:30:00',
    updated_at: '2023-01-01T08:30:00',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    role: 'seller',
    email: 'seller1@example.com',
    password: 'hashed_password',
    first_name: 'Jean',
    last_name: 'Dupont',
    tel: '+33600000001',
    address: '456 Seller Avenue, Lyon',
    created_at: '2023-01-02T10:15:00',
    updated_at: '2023-01-02T10:15:00',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    role: 'deliverer',
    email: 'deliverer1@example.com',
    password: 'hashed_password',
    first_name: 'Marie',
    last_name: 'Laurent',
    tel: '+33600000002',
    address: '789 Delivery Road, Marseille',
    created_at: '2023-01-03T09:45:00',
    updated_at: '2023-01-03T09:45:00',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    role: 'client',
    email: 'client1@example.com',
    password: 'hashed_password',
    first_name: 'Sophie',
    last_name: 'Martin',
    tel: '+33600000003',
    address: '101 Client Boulevard, Bordeaux',
    created_at: '2023-01-04T14:20:00',
    updated_at: '2023-01-04T14:20:00',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    role: 'seller',
    email: 'seller2@example.com',
    password: 'hashed_password',
    first_name: 'Pierre',
    last_name: 'Leclerc',
    tel: '+33600000004',
    address: '202 Market Street, Toulouse',
    created_at: '2023-01-05T11:30:00',
    updated_at: '2023-01-05T11:30:00',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    role: 'deliverer',
    email: 'deliverer2@example.com',
    password: 'hashed_password',
    first_name: 'Lucas',
    last_name: 'Petit',
    tel: '+33600000005',
    address: '303 Delivery Lane, Lille',
    created_at: '2023-01-06T13:10:00',
    updated_at: '2023-01-06T13:10:00',
  }
];

export const mockShops = [
  {
    id: 1,
    seller_id: '550e8400-e29b-41d4-a716-446655440001',
    shop_name: 'Épicerie Bio',
    description: 'Produits bio et locaux pour toute la famille',
    tel: '+33600000011',
    address: '111 Organic Street, Lyon',
    latitude: 45.7484,
    longitude: 4.8467,
    created_at: '2023-01-10T09:00:00',
    profile_image_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    banner_image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    seller_id: '550e8400-e29b-41d4-a716-446655440004',
    shop_name: 'Tech Store',
    description: 'Les dernières innovations technologiques',
    tel: '+33600000012',
    address: '222 Tech Avenue, Toulouse',
    latitude: 43.6045,
    longitude: 1.4442,
    created_at: '2023-01-15T10:30:00',
    profile_image_url: 'https://images.unsplash.com/photo-1563770660941-10a2b3961f93?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    banner_image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    seller_id: '550e8400-e29b-41d4-a716-446655440001',
    shop_name: 'Café Parisien',
    description: 'Cafés de spécialité et pâtisseries artisanales',
    tel: '+33600000013',
    address: '333 Coffee Street, Lyon',
    latitude: 45.7580,
    longitude: 4.8320,
    created_at: '2023-02-01T11:15:00',
    profile_image_url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    banner_image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  }
];

export const mockOrders = [
  {
    id: 1,
    client_id: '550e8400-e29b-41d4-a716-446655440003',
    shop_id: 1,
    deliver_id: '550e8400-e29b-41d4-a716-446655440002',
    status: 'delivered',
    delivery_address: '101 Client Boulevard, Bordeaux',
    delivery_latitude: 44.8378,
    delivery_longitude: -0.5792,
    total_amount: 49.99,
  },
  {
    id: 2,
    client_id: '550e8400-e29b-41d4-a716-446655440003',
    shop_id: 2,
    deliver_id: '550e8400-e29b-41d4-a716-446655440005',
    status: 'in_progress',
    delivery_address: '101 Client Boulevard, Bordeaux',
    delivery_latitude: 44.8378,
    delivery_longitude: -0.5792,
    total_amount: 199.99,
  },
  {
    id: 3,
    client_id: '550e8400-e29b-41d4-a716-446655440003',
    shop_id: 3,
    deliver_id: null,
    status: 'pending',
    delivery_address: '101 Client Boulevard, Bordeaux',
    delivery_latitude: 44.8378,
    delivery_longitude: -0.5792,
    total_amount: 24.50,
  }
];

export const mockPayments = [
  {
    id: 1,
    order_id: 1,
    amount: 49.99,
    status: 'completed',
    user_id: '550e8400-e29b-41d4-a716-446655440003',
    payment_method: 'credit_card',
  },
  {
    id: 2,
    order_id: 2,
    amount: 199.99,
    status: 'completed',
    user_id: '550e8400-e29b-41d4-a716-446655440003',
    payment_method: 'paypal',
  },
  {
    id: 3,
    order_id: 3,
    amount: 24.50,
    status: 'pending',
    user_id: '550e8400-e29b-41d4-a716-446655440003',
    payment_method: 'credit_card',
  }
];

export const mockCommissions = [
  {
    id: 1,
    order_id: 1,
    order_amount: 49.99,
    deliverer_amount: 5.00,
    seller_amount: 39.99,
    platform_amount: 5.00,
  },
  {
    id: 2,
    order_id: 2,
    order_amount: 199.99,
    deliverer_amount: 10.00,
    seller_amount: 169.99,
    platform_amount: 20.00,
  }
];

export const mockNotifications = [
  {
    id: 1,
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    message: 'Nouvelle commande #1245 à valider',
    type: 'order',
    created_at: '2023-06-10T14:25:00',
    read: false,
  },
  {
    id: 2,
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    message: 'Nouveau vendeur à approuver',
    type: 'user',
    created_at: '2023-06-09T11:30:00',
    read: true,
  },
  {
    id: 3,
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    message: 'Rapport hebdomadaire disponible',
    type: 'system',
    created_at: '2023-06-08T09:15:00',
    read: false,
  },
  {
    id: 4,
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    message: 'Mise à jour de la plateforme prévue pour demain à 2h00',
    type: 'system',
    created_at: '2023-06-07T16:45:00',
    read: true,
  },
  {
    id: 5,
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    message: 'Réclamation client concernant la commande #1242',
    type: 'support',
    created_at: '2023-06-06T13:20:00',
    read: false,
  }
];

export const dashboardStats = {
  totalUsers: 126,
  totalSellers: 42,
  totalDeliverers: 28,
  totalClients: 56,
  totalOrders: 284,
  pendingOrders: 15,
  inProgressOrders: 32,
  deliveredOrders: 237,
  totalRevenue: 28549.99,
  monthlyRevenue: 5625.75,
  weeklyRevenue: 1325.50,
  recentActivity: [
    { id: 1, type: "order", message: "Nouvelle commande #1248", time: "Il y a 5 minutes" },
    { id: 2, type: "user", message: "Nouveau vendeur inscrit", time: "Il y a 30 minutes" },
    { id: 3, type: "payment", message: "Paiement reçu pour commande #1247", time: "Il y a 45 minutes" },
    { id: 4, type: "order", message: "Commande #1246 livrée", time: "Il y a 1 heure" },
    { id: 5, type: "shop", message: "Nouvelle boutique créée", time: "Il y a 2 heures" }
  ],
  monthlyOrdersData: [
    { month: 'Jan', orders: 18 },
    { month: 'Fév', orders: 22 },
    { month: 'Mar', orders: 25 },
    { month: 'Avr', orders: 30 },
    { month: 'Mai', orders: 28 },
    { month: 'Juin', orders: 32 },
    { month: 'Juil', orders: 35 },
    { month: 'Août', orders: 37 },
    { month: 'Sep', orders: 28 },
    { month: 'Oct', orders: 29 },
    { month: 'Nov', orders: 0 },
    { month: 'Déc', orders: 0 }
  ],
  monthlyRevenueData: [
    { month: 'Jan', revenue: 1850.25 },
    { month: 'Fév', revenue: 2120.50 },
    { month: 'Mar', revenue: 2540.75 },
    { month: 'Avr', revenue: 2980.30 },
    { month: 'Mai', revenue: 2780.15 },
    { month: 'Juin', revenue: 3250.80 },
    { month: 'Juil', revenue: 3520.45 },
    { month: 'Août', revenue: 3780.90 },
    { month: 'Sep', revenue: 2850.30 },
    { month: 'Oct', revenue: 2875.60 },
    { month: 'Nov', revenue: 0 },
    { month: 'Déc', revenue: 0 }
  ]
};

export const appStatistics = {
  // Utilisateurs et croissance
  userStats: {
    totalUsers: 126,
    newUsersThisMonth: 18,
    userGrowthRate: 12.5, // pourcentage
    activeUsers: 95,
    usersByRole: {
      admin: 4,
      seller: 42,
      deliverer: 28, 
      client: 52
    },
    userRetentionRate: 78.4, // pourcentage
  },
  
  // Boutiques et vendeurs
  shopStats: {
    totalShops: 35,
    activeShops: 32,
    newShopsThisMonth: 4,
    averageProductsPerShop: 48,
    topPerformingCategories: [
      { name: "Électronique", sales: 42500 },
      { name: "Mode", sales: 38200 },
      { name: "Alimentation", sales: 29800 },
      { name: "Maison", sales: 27500 },
      { name: "Beauté", sales: 25200 }
    ],
    shopGrowthRate: 9.2, // pourcentage
  },
  
  // Commandes et livraisons
  orderStats: {
    totalOrders: 284,
    ordersThisMonth: 64,
    averageOrderValue: 95.25,
    orderStatuses: {
      pending: 15,
      inProgress: 32,
      delivered: 237
    },
    orderCompletionRate: 92.3, // pourcentage
    averageDeliveryTime: 2.4, // en jours
  },
  
  // Revenus et finances
  revenueStats: {
    totalRevenue: 28549.99,
    revenueThisMonth: 5625.75,
    revenueGrowth: 14.2, // pourcentage
    averageCommissionRate: 10.5, // pourcentage
    revenueSources: {
      commissions: 21500.45,
      subscriptions: 4800.00,
      premiumServices: 2249.54
    },
    projectedRevenueNextMonth: 6250.00
  },
  
  // Performances par région
  regionalStats: {
    topRegions: [
      { name: "Paris", orders: 95, revenue: 9540.25 },
      { name: "Lyon", orders: 52, revenue: 5120.75 },
      { name: "Marseille", orders: 43, revenue: 4325.50 },
      { name: "Bordeaux", orders: 31, revenue: 3050.80 },
      { name: "Lille", orders: 25, revenue: 2450.30 }
    ],
    growingRegions: [
      { name: "Toulouse", growthRate: 24.5 },
      { name: "Nantes", growthRate: 21.8 },
      { name: "Strasbourg", growthRate: 19.2 }
    ]
  },
  
  // Satisfaction et retours clients
  customerStats: {
    averageRating: 4.7, // sur 5
    satisfactionRate: 92.8, // pourcentage
    returnRate: 3.2, // pourcentage
    complaintRate: 1.8, // pourcentage
    responseTime: 2.5, // heures
  },
  
  // Performance marketing
  marketingStats: {
    acquisitionChannels: [
      { name: "Recherche organique", users: 42, percentage: 31.5 },
      { name: "Réseaux sociaux", users: 35, percentage: 26.2 },
      { name: "Référencement payant", users: 22, percentage: 16.5 },
      { name: "Emails", users: 18, percentage: 13.5 },
      { name: "Recommandation", users: 16, percentage: 12.3 }
    ],
    conversionRate: 4.2, // pourcentage
    costPerAcquisition: 8.75, // euros
    marketingROI: 320, // pourcentage
  }
};
