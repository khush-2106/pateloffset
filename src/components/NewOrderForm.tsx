import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function NewOrderForm() {
  const { clients, addOrder, additionalCosts } = useStore();
  const [clientId, setClientId] = useState('');
  const [jobs, setJobs] = useState([{
    paperSize: '',
    paperThickness: '',
    quantity: 0
  }]);

  const selectedClient = clients.find(c => c.id === clientId);

  const handleAddJob = () => {
    setJobs([...jobs, { paperSize: '', paperThickness: '', quantity: 0 }]);
  };

  const handleRemoveJob = (index: number) => {
    setJobs(jobs.filter((_, i) => i !== index));
  };

  const calculatePrice = (job: typeof jobs[0]) => {
    if (!selectedClient || !job.paperSize || !job.paperThickness) return 0;
    
    const rate = selectedClient.priceRates.find(
      r => r.paperSize === job.paperSize && r.paperThickness.toString() === job.paperThickness
    );
    
    if (!rate) return 0;
    
    const quantityBreak = rate.quantityBreaks
      .sort((a, b) => b.minQuantity - a.minQuantity)
      .find(qb => job.quantity >= qb.minQuantity);
      
    return (quantityBreak?.price || rate.pricePerUnit) * job.quantity;
  };

  const calculateJobCost = (job: typeof jobs[0]) => {
    const additionalCostsPerUnit = additionalCosts.reduce((sum, cost) => sum + cost.costPerUnit, 0);
    return (job.quantity * additionalCostsPerUnit) + 290; // 290 is the plate charge per job
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalAmount = jobs.reduce((sum, job) => sum + calculatePrice(job), 0);
    const totalCost = jobs.reduce((sum, job) => sum + calculateJobCost(job), 0);
    
    const newOrder = {
      id: Date.now().toString(),
      clientId,
      date: new Date().toISOString(),
      jobs: jobs.map(job => ({
        ...job,
        id: Math.random().toString(36).substr(2, 9)
      })),
      totalAmount,
      cost: totalCost
    };

    addOrder(newOrder);
    toast.success('Order created successfully!');
    
    // Reset form
    setClientId('');
    setJobs([{ paperSize: '', paperThickness: '', quantity: 0 }]);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6">New Order</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Client
        </label>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {jobs.map((job, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 border rounded-md bg-gray-50"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Job {index + 1}</h3>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveJob(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Minus className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paper Size
                </label>
                <select
                  value={job.paperSize}
                  onChange={(e) =>
                    setJobs(
                      jobs.map((j, i) =>
                        i === index ? { ...j, paperSize: e.target.value } : j
                      )
                    )
                  }
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select size</option>
                  {selectedClient?.priceRates
                    .map(rate => rate.paperSize)
                    .filter((value, index, self) => self.indexOf(value) === index)
                    .map(size => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))
                  }
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GSM
                </label>
                <select
                  value={job.paperThickness}
                  onChange={(e) =>
                    setJobs(
                      jobs.map((j, i) =>
                        i === index ? { ...j, paperThickness: e.target.value } : j
                      )
                    )
                  }
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select GSM</option>
                  {selectedClient?.priceRates
                    .filter(rate => rate.paperSize === job.paperSize)
                    .map(rate => rate.paperThickness)
                    .map(gsm => (
                      <option key={gsm} value={gsm}>
                        {gsm}
                      </option>
                    ))
                  }
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={job.quantity}
                  onChange={(e) =>
                    setJobs(
                      jobs.map((j, i) =>
                        i === index
                          ? { ...j, quantity: Number(e.target.value) }
                          : j
                      )
                    )
                  }
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>
            
            {job.paperSize && job.paperThickness && job.quantity > 0 && (
              <div className="mt-4 text-right">
                <p className="text-sm font-medium text-gray-700">
                  Price: ${calculatePrice(job).toFixed(2)}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex justify-between">
        <button
          type="button"
          onClick={handleAddJob}
          className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Job
        </button>
        
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Order
        </button>
      </div>
    </motion.form>
  );
}