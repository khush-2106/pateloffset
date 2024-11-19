import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Minus } from 'lucide-react';
import type { PriceRate, Client, QuantityBreak } from '../types';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ClientFormProps {
  editingClient?: Client;
  onSubmit?: () => void;
}

export default function ClientForm({ editingClient, onSubmit }: ClientFormProps) {
  const { addClient, updateClient, papers } = useStore();
  const [formData, setFormData] = useState({
    name: editingClient?.name || '',
    email: editingClient?.email || '',
    phone: editingClient?.phone || '',
  });
  
  const [priceRates, setPriceRates] = useState<PriceRate[]>(
    editingClient?.priceRates || []
  );

  const handleAddRate = () => {
    setPriceRates([...priceRates, {
      paperSize: papers[0]?.size || '',
      paperThickness: papers[0]?.thickness || 0,
      pricePerUnit: 0,
      quantityBreaks: [{ minQuantity: 0, price: 0 }]
    }]);
  };

  const handleRemoveRate = (index: number) => {
    setPriceRates(priceRates.filter((_, i) => i !== index));
  };

  const handleAddQuantityBreak = (rateIndex: number) => {
    const updatedRates = [...priceRates];
    updatedRates[rateIndex].quantityBreaks.push({ minQuantity: 0, price: 0 });
    setPriceRates(updatedRates);
  };

  const handleRemoveQuantityBreak = (rateIndex: number, breakIndex: number) => {
    const updatedRates = [...priceRates];
    updatedRates[rateIndex].quantityBreaks = updatedRates[rateIndex].quantityBreaks.filter(
      (_, i) => i !== breakIndex
    );
    setPriceRates(updatedRates);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clientData = {
      id: editingClient?.id || Date.now().toString(),
      ...formData,
      priceRates
    };
    
    if (editingClient) {
      updateClient(clientData);
      toast.success('Client updated successfully!');
    } else {
      addClient(clientData);
      toast.success('Client added successfully!');
    }
    
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6">
        {editingClient ? 'Edit Client' : 'Add New Client'}
      </h2>
      
      <div className="space-y-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </motion.div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Price Rates</h3>
        <AnimatePresence>
          {priceRates.map((rate, rateIndex) => (
            <motion.div
              key={rateIndex}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 border rounded-md bg-gray-50 mb-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Rate {rateIndex + 1}</h4>
                <button
                  type="button"
                  onClick={() => handleRemoveRate(rateIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Minus className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paper Size
                  </label>
                  <select
                    value={rate.paperSize}
                    onChange={(e) =>
                      setPriceRates(
                        priceRates.map((r, i) =>
                          i === rateIndex ? { ...r, paperSize: e.target.value } : r
                        )
                      )
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select size</option>
                    {papers
                      .map(p => p.size)
                      .filter((value, index, self) => self.indexOf(value) === index)
                      .map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))
                    }
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thickness (gsm)
                  </label>
                  <select
                    value={rate.paperThickness}
                    onChange={(e) =>
                      setPriceRates(
                        priceRates.map((r, i) =>
                          i === rateIndex ? { ...r, paperThickness: Number(e.target.value) } : r
                        )
                      )
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select thickness</option>
                    {papers
                      .filter(p => p.size === rate.paperSize)
                      .map(p => p.thickness)
                      .filter((value, index, self) => self.indexOf(value) === index)
                      .map(thickness => (
                        <option key={thickness} value={thickness}>{thickness}</option>
                      ))
                    }
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Price per Unit
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={rate.pricePerUnit}
                    onChange={(e) =>
                      setPriceRates(
                        priceRates.map((r, i) =>
                          i === rateIndex ? { ...r, pricePerUnit: Number(e.target.value) } : r
                        )
                      )
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              <AnimatePresence>
                {rate.quantityBreaks.map((qBreak, breakIndex) => (
                  <motion.div
                    key={breakIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="grid grid-cols-2 gap-4 items-end mb-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Quantity
                      </label>
                      <input
                        type="number"
                        value={qBreak.minQuantity}
                        onChange={(e) => {
                          const updatedRates = [...priceRates];
                          updatedRates[rateIndex].quantityBreaks[breakIndex].minQuantity = Number(e.target.value);
                          setPriceRates(updatedRates);
                        }}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price at this Quantity
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={qBreak.price}
                          onChange={(e) => {
                            const updatedRates = [...priceRates];
                            updatedRates[rateIndex].quantityBreaks[breakIndex].price = Number(e.target.value);
                            setPriceRates(updatedRates);
                          }}
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>
                      {breakIndex > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuantityBreak(rateIndex, breakIndex)}
                          className="text-red-600 hover:text-red-800 self-center"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <button
                type="button"
                onClick={() => handleAddQuantityBreak(rateIndex)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Quantity Break
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleAddRate}
          className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Price Rate
        </button>
        
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {editingClient ? 'Update Client' : 'Add Client'}
        </button>
      </div>
    </motion.form>
  );
}