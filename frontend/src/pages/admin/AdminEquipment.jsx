import React, { useState, useEffect } from 'react';
import { Cpu, Plus, Edit, Trash2, X, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { AdminNavTabs } from './AdminDashboard';
import { useToast } from '../../context/ToastContext';

export const AdminEquipment = () => {
  const toast = useToast();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brandModel: '',
    category: 'Imaging & Diagnostics',
    image: '',
    purpose: '',
    patientComfortImpact: '',
    benefits: 'Ultra-low radiation, sub-millimeter precision, zero pain',
    status: 'Active & In-Use',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const res = await api.get('/equipment');
      if (res.success) setEquipment(res.equipment || []);
    } catch (err) {
      toast.error('Failed to load equipment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      brandModel: '',
      category: 'Imaging & Diagnostics',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop',
      purpose: '',
      patientComfortImpact: '',
      benefits: 'Ultra-low radiation, sub-millimeter precision',
      status: 'Active & In-Use',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      brandModel: item.brandModel || '',
      category: item.category,
      image: item.image,
      purpose: item.purpose,
      patientComfortImpact: item.patientComfortImpact || '',
      benefits: item.benefits?.join(', ') || '',
      status: item.status || 'Active & In-Use',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this equipment?')) return;
    try {
      await api.delete(`/equipment/${id}`);
      toast.success('Equipment removed.');
      fetchEquipment();
    } catch (err) {
      toast.error('Delete failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        benefits: formData.benefits.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (editingItem) {
        await api.put(`/equipment/${editingItem._id}`, payload);
        toast.success('Equipment updated.');
      } else {
        await api.post('/equipment', payload);
        toast.success('New equipment added.');
      }

      setIsModalOpen(false);
      fetchEquipment();
    } catch (err) {
      toast.error(err.message || 'Failed to save equipment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dental Technology & Equipment</h1>
          <p className="text-xs text-slate-500">Add and configure machines used inside the clinic</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Equipment</span>
        </button>
      </div>

      <AdminNavTabs />

      {/* Grid */}
      {loading ? (
        <p className="text-center text-xs text-slate-400 py-12">Loading equipment...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-200" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.name}</h3>
                    <p className="text-[11px] text-brand-700 font-semibold">{item.category}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{item.purpose}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(item._id)} className="p-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">
                {editingItem ? 'Edit Equipment' : 'Add Dental Equipment'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Equipment Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Carestream CS 9600 CBCT Scanner"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand / Model</label>
                  <input
                    type="text"
                    value={formData.brandModel}
                    onChange={(e) => setFormData({ ...formData, brandModel: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium bg-white"
                  >
                    <option value="Imaging & Diagnostics">Imaging & Diagnostics</option>
                    <option value="Treatment & Surgery">Treatment & Surgery</option>
                    <option value="Sterilization & Safety">Sterilization & Safety</option>
                    <option value="Patient Comfort">Patient Comfort</option>
                    <option value="Digital Dentistry">Digital Dentistry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Purpose & Function *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                ></textarea>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Comfort Benefit</label>
                <input
                  type="text"
                  value={formData.patientComfortImpact}
                  onChange={(e) => setFormData({ ...formData, patientComfortImpact: e.target.value })}
                  placeholder="e.g. Fast, silent 12-second scan with zero claustrophobia..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md mt-2"
              >
                {submitting ? 'Saving...' : 'Save Equipment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
