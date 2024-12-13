"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  userId: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'completed';
  createdAt: {
    toDate: () => Date;
  };
  userEmail: string;
  customerName?: string;
}

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        console.log('Raw snapshot:', querySnapshot.docs.length);

        const fetchedOrders = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          console.log('Order data:', data);
          
          const total = data.items.reduce((sum: number, item: any) => 
            sum + (item.price * item.quantity), 0);
          
          const userRef = doc(db, 'users', data.userId);
          const userDoc = await getDoc(userRef);
          const userProfileRef = doc(db, 'userProfiles', data.userId);
          const userProfileDoc = await getDoc(userProfileRef);
          
          const userData = {
            displayName: userProfileDoc.exists() ? userProfileDoc.data()?.displayName : null,
            email: userDoc.exists() ? userDoc.data()?.email : data.userEmail
          };
          
          return {
            id: docSnapshot.id,
            ...data,
            total,
            customerName: userData.displayName || userData.email || 'Unknown Customer'
          };
        })) as Order[];
        
        console.log('Processed orders:', fetchedOrders);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Order History</h3>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono">{order.id.slice(0, 8)}</TableCell>
              <TableCell>{order.customerName || order.userEmail}</TableCell>
              <TableCell>
                <ul className="list-disc list-inside">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.quantity}x {item.name} (${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'})
                    </li>
                  ))}
                </ul>
              </TableCell>
              <TableCell>${typeof order.total === 'number' ? order.total.toFixed(2) : '0.00'}</TableCell>
              <TableCell>
                <Badge className={cn(
                  "bg-green-100 text-green-800 hover:bg-green-100",
                  "border-0"
                )}>
                  completed
                </Badge>
              </TableCell>
              <TableCell>
                {formatDistance(order.createdAt.toDate(), new Date(), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 