import { create } from 'zustand';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from './lib/firebase';
import { Client, Order, Paper, AdditionalCost } from './types';
import toast from 'react-hot-toast';

interface StoreState {
  clients: Client[];
  orders: Order[];
  papers: Paper[];
  additionalCosts: AdditionalCost[];
  selectedMonth: string;
  loading: boolean;
  
  // Data fetching
  fetchClients: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchPapers: () => Promise<void>;
  fetchAdditionalCosts: () => Promise<void>;
  
  // Client operations
  addClient: (client: Client) => Promise<void>;
  updateClient: (client: Client) => Promise<void>;
  deleteClient: (clientId: string) => Promise<void>;
  
  // Order operations
  addOrder: (order: Order) => Promise<void>;
  updateOrder: (order: Order) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  
  // Paper operations
  updatePaper: (paper: Paper) => Promise<void>;
  
  // Additional cost operations
  addAdditionalCost: (cost: AdditionalCost) => Promise<void>;
  updateAdditionalCost: (index: number, cost: AdditionalCost) => Promise<void>;
  deleteAdditionalCost: (index: number) => Promise<void>;
  
  setSelectedMonth: (month: string) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  clients: [],
  orders: [],
  papers: [],
  additionalCosts: [],
  selectedMonth: new Date().toISOString().slice(0, 7),
  loading: false,

  fetchClients: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'clients'));
      const clients = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];
      set({ clients });
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to fetch clients');
    }
  },

  fetchOrders: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      set({ orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    }
  },

  fetchPapers: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'papers'));
      const papers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Paper[];
      set({ papers });
    } catch (error) {
      console.error('Error fetching papers:', error);
      toast.error('Failed to fetch papers');
    }
  },

  fetchAdditionalCosts: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'additionalCosts'));
      const costs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AdditionalCost[];
      set({ additionalCosts: costs });
    } catch (error) {
      console.error('Error fetching additional costs:', error);
      toast.error('Failed to fetch additional costs');
    }
  },

  addClient: async (client: Client) => {
    try {
      const docRef = await addDoc(collection(db, 'clients'), client);
      set(state => ({
        clients: [...state.clients, { ...client, id: docRef.id }]
      }));
      toast.success('Client added successfully');
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client');
    }
  },

  updateClient: async (client: Client) => {
    try {
      await updateDoc(doc(db, 'clients', client.id), client);
      set(state => ({
        clients: state.clients.map(c =>
          c.id === client.id ? client : c
        )
      }));
      toast.success('Client updated successfully');
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client');
    }
  },

  deleteClient: async (clientId: string) => {
    try {
      await deleteDoc(doc(db, 'clients', clientId));
      set(state => ({
        clients: state.clients.filter(c => c.id !== clientId)
      }));
      toast.success('Client deleted successfully');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
    }
  },

  addOrder: async (order: Order) => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), order);
      set(state => ({
        orders: [...state.orders, { ...order, id: docRef.id }]
      }));
      toast.success('Order added successfully');
    } catch (error) {
      console.error('Error adding order:', error);
      toast.error('Failed to add order');
    }
  },

  updateOrder: async (order: Order) => {
    try {
      await updateDoc(doc(db, 'orders', order.id), order);
      set(state => ({
        orders: state.orders.map(o =>
          o.id === order.id ? order : o
        )
      }));
      toast.success('Order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  },

  deleteOrder: async (orderId: string) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      set(state => ({
        orders: state.orders.filter(o => o.id !== orderId)
      }));
      toast.success('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  },

  updatePaper: async (paper: Paper) => {
    try {
      const docRef = await addDoc(collection(db, 'papers'), paper);
      set(state => ({
        papers: [...state.papers, { ...paper, id: docRef.id }]
      }));
      toast.success('Paper added successfully');
    } catch (error) {
      console.error('Error adding paper:', error);
      toast.error('Failed to add paper');
    }
  },

  addAdditionalCost: async (cost: AdditionalCost) => {
    try {
      const docRef = await addDoc(collection(db, 'additionalCosts'), cost);
      set(state => ({
        additionalCosts: [...state.additionalCosts, { ...cost, id: docRef.id }]
      }));
      toast.success('Additional cost added successfully');
    } catch (error) {
      console.error('Error adding additional cost:', error);
      toast.error('Failed to add additional cost');
    }
  },

  updateAdditionalCost: async (index: number, cost: AdditionalCost) => {
    try {
      await updateDoc(doc(db, 'additionalCosts', cost.id), cost);
      set(state => ({
        additionalCosts: state.additionalCosts.map((c, i) =>
          i === index ? cost : c
        )
      }));
      toast.success('Additional cost updated successfully');
    } catch (error) {
      console.error('Error updating additional cost:', error);
      toast.error('Failed to update additional cost');
    }
  },

  deleteAdditionalCost: async (index: number) => {
    try {
      const cost = get().additionalCosts[index];
      await deleteDoc(doc(db, 'additionalCosts', cost.id));
      set(state => ({
        additionalCosts: state.additionalCosts.filter((_, i) => i !== index)
      }));
      toast.success('Additional cost deleted successfully');
    } catch (error) {
      console.error('Error deleting additional cost:', error);
      toast.error('Failed to delete additional cost');
    }
  },

  setSelectedMonth: (month: string) => set({ selectedMonth: month }),
}));