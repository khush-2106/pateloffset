import React, { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Clients from './components/Clients';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import { useStore } from './store';
import { Toaster } from 'react-hot-toast';

function App() {
  const [currentView, setCurrentView] = React.useState('dashboard');
  const { fetchClients, fetchOrders, fetchPapers, fetchAdditionalCosts } = useStore();

  useEffect(() => {
    // Fetch initial data
    fetchClients();
    fetchOrders();
    fetchPapers();
    fetchAdditionalCosts();
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <Orders />;
      case 'clients':
        return <Clients />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <main className="flex-1 p-8 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
}

export default App;