import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Minus, Edit2, Trash2 } from 'lucide-react';
import type { Paper, AdditionalCost } from '../types';
import toast from 'react-hot-toast';

export default function Settings() {
  const { papers, updatePaper, additionalCosts, addAdditionalCost, updateAdditionalCost, deleteAdditionalCost } = useStore();
  const [newPaper, setNewPaper] = useState<Paper>({
    size: '',
    thickness: 0,
    costPerUnit: 0
  });

  const [newCost, setNewCost] = useState<AdditionalCost>({
    name: '',
    costPerUnit: 0
  });

  const [editingCostIndex, setEditingCostIndex] = useState<number | null>(null);

  const handleAddPaper = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaper(newPaper);
    setNewPaper({ size: '', thickness: 0, costPerUnit: 0 });
    toast.success('Paper cost added successfully!');
  };

  const handleAddCost = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCostIndex !== null) {
      updateAdditionalCost(editingCostIndex, newCost);
      toast.success('Cost updated successfully!');
      setEditingCostIndex(null);
    } else {
      addAdditionalCost(newCost);
      toast.success('Additional cost added successfully!');
    }
    setNewCost({ name: '', costPerUnit: 0 });
  };

  const handleEditCost = (cost: AdditionalCost, index: number) => {
    setNewCost(cost);
    setEditingCostIndex(index);
  };

  const handleDeleteCost = (index: number) => {
    if (window.confirm('Are you sure you want to delete this cost?')) {
      deleteAdditionalCost(index);
      toast.success('Cost deleted successfully!');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Paper Cost Management</h2>
        <form onSubmit={handleAddPaper} className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paper Size
            </label>
            <input
              type="text"
              value={newPaper.size}
              onChange={(e) => setNewPaper({ ...newPaper, size: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thickness (gsm)
            </label>
            <input
              type="number"
              value={newPaper.thickness}
              onChange={(e) => setNewPaper({ ...newPaper, thickness: Number(e.target.value) })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost per Unit
            </label>
            <input
              type="number"
              step="0.01"
              value={newPaper.costPerUnit}
              onChange={(e) => setNewPaper({ ...newPaper, costPerUnit: Number(e.target.value) })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <button
            type="submit"
            className="col-span-3 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Paper
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thickness
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost per Unit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {papers.map((paper, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {paper.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {paper.thickness} gsm
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${paper.costPerUnit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Additional Costs per Print</h2>
        <form onSubmit={handleAddCost} className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost Name
            </label>
            <input
              type="text"
              value={newCost.name}
              onChange={(e) => setNewCost({ ...newCost, name: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., Ink, Chemicals, etc."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost per Unit
            </label>
            <input
              type="number"
              step="0.01"
              value={newCost.costPerUnit}
              onChange={(e) => setNewCost({ ...newCost, costPerUnit: Number(e.target.value) })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <button
            type="submit"
            className="col-span-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {editingCostIndex !== null ? 'Update Cost' : 'Add Cost'}
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost per Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {additionalCosts.map((cost, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cost.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${cost.costPerUnit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCost(cost, index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCost(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}