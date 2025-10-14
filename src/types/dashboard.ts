// src/types/index.ts
export interface MenuItem {
  id: string;
  label: string;
  icon: any;
  isActive?: boolean;
  section?: string;
}

export interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  trend: {
    value: string;
    isPositive: boolean;
  };
  description: string;
  color: 'blue' | 'green' | 'purple' | 'yellow';
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'yellow';
}

export interface Order {
  id: string;
  orderId: string;
  customer: string;
  date: string;
  amount: string;
  status: 'completed' | 'pending' | 'cancelled';
}