import React from 'react';
import { useStore } from '../store';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Printer, Users, DollarSign, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { orders, clients, selectedMonth } = useStore();

  // Filter orders for selected month
  const monthlyOrders = orders.filter(order => 
    order.date.startsWith(selectedMonth)
  );

  const stats = {
    totalOrders: monthlyOrders.length,
    totalClients: clients.length,
    totalRevenue: monthlyOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    totalProfit: monthlyOrders.reduce((sum, order) => sum + (order.totalAmount - order.cost), 0),
  };

  // Daily analytics for the selected month
  const dailyData = monthlyOrders.reduce((acc: any[], order) => {
    const date = order.date.split('T')[0];
    const existingDate = acc.find(item => item.date === date);
    
    if (existingDate) {
      existingDate.orders += 1;
      existingDate.revenue += order.totalAmount;
      existingDate.jobs += order.jobs.length;
    } else {
      acc.push({
        date,
        orders: 1,
        revenue: order.totalAmount,
        jobs: order.jobs.length
      });
    }
    return acc;
  }, []).sort((a, b) => a.date.localeCompare(b.date));

  // Monthly performance data
  const monthlyPerformance = orders.reduce((acc: any[], order) => {
    const month = new Date(order.date).toLocaleString('default', { month: 'short' });
    const existingMonth = acc.find(item => item.month === month);
    
    if (existingMonth) {
      existingMonth.revenue += order.totalAmount;
      existingMonth.profit += order.totalAmount - order.cost;
      existingMonth.orders += 1;
    } else {
      acc.push({
        month,
        revenue: order.totalAmount,
        profit: order.totalAmount - order.cost,
        orders: 1
      });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => useStore.getState().setSelectedMonth(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Monthly Orders</p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            </div>
            <Printer className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Active Clients</p>
              <h3 className="text-2xl font-bold">{stats.totalClients}</h3>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Monthly Revenue</p>
              <h3 className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</h3>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Monthly Profit</p>
              <h3 className="text-2xl font-bold">${stats.totalProfit.toFixed(2)}</h3>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Daily Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#2563eb" name="Revenue" />
              <Line yAxisId="right" type="monotone" dataKey="jobs" stroke="#16a34a" name="Jobs" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Monthly Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#2563eb" fill="#3b82f6" name="Revenue" />
              <Area type="monotone" dataKey="profit" stackId="2" stroke="#16a34a" fill="#22c55e" name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyOrders.slice(0, 5).map((order) => {
                  const client = clients.find((c) => c.id === order.clientId);
                  return (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}