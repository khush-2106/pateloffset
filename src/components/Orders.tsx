import React from 'react';
import NewOrderForm from './NewOrderForm';
import OrderHistory from './OrderHistory';
import { Toaster } from 'react-hot-toast';

export default function Orders() {
  return (
    <div>
      <Toaster position="top-right" />
      <NewOrderForm />
      <OrderHistory />
    </div>
  );
}