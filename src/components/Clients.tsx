import React, { useState } from 'react';
import ClientForm from './ClientForm';
import ClientList from './ClientList';

export default function Clients() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Client Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'View Client List' : 'Add New Client'}
        </button>
      </div>
      
      {showForm ? <ClientForm /> : <ClientList />}
    </div>
  );
}