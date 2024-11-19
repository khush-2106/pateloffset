import React from 'react';
import { useStore } from '../store';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';

export default function Analytics() {
  const { orders, clients } = useStore();

  const monthlyData = orders.reduce((acc: any[], order) => {
    const month = new Date(order.date).toLocaleString('default', {
      month: 'short',
    });
    const existingMonth = acc.find((item) => item.month === month);
    
    if (existingMonth) {
      existingMonth.revenue += order.totalAmount;
      existingMonth.profit += order.totalAmount - order.cost;
      existingMonth.orders += 1;
    } else {
      acc.push({
        month,
        revenue: order.totalAmount,
        profit: order.totalAmount - order.cost,
        orders: 1,
      });
    }
    return acc;
  }, []);

  const clientData = orders.reduce((acc: any[], order) => {
    const client = clients.find((c) => c.id === order.clientId);
    const existingClient = acc.find((item) => item.client === client?.name);
    
    if (existingClient) {
      existingClient.revenue += order.totalAmount;
      existingClient.orders += 1;
    } else if (client) {
      acc.push({
        client: client.name,
        revenue: order.totalAmount,
        orders: 1,
      });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Monthly Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#16a34a"
              name="Profit"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Client Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={clientData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="client" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#2563eb" name="Revenue" />
            <Bar dataKey="orders" fill="#16a34a" name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}