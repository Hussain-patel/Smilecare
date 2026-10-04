import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Stethoscope, Clock, CheckCircle2, X } from 'lucide-react';
import api from '../../services/api';
import { AdminNavTabs } from './AdminDashboard';
import { useToast } from '../../context/ToastContext';

export const AdminServices = () => {
  const toast = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Preventive Dentistry',
    shortDescription: '',
    fullDescription: '',
    startingPrice: 1500,
    durationMinutes: '30-45 min',
    visitsRequired: '1 visit',
    image: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/services');
      if (res.success) {
        setServices(res.services || []);
      }
    } catch (err) {
      toast.error('Failed to load services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      name: '',
      category: 'Preventive Dentistry',
      shortDescription: '',
      fullDescription: '',
      startingPrice: 1500,
      durationMinutes: '30-45 min',
      visitsRequired: '1 visit',
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (svc) => {
    setEditingService(svc);
    setFormData({
      name: svc.name,
      category: svc.category,
      shortDescription: svc.shortDescription,
      fullDescription: svc.fullDescription,
      startingPrice: svc.startingPrice,
      durationMinutes: svc.durationMinutes,
      visitsRequired: svc.visitsRequired,
      image: svc.image,
    });
    setIsModalOpen(true);
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await api.delete(`/services/${id}`);
      if (res.success) {
        toast.success('Service removed successfully.');
        fetchServices();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete service.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        startingPrice: Number(formData.startingPrice),
      };

      if (editingService) {
        await api.put(`/services/${editingService._id}`, payload);
        toast.success('Service updated successfully.');
      } else {
        await api.post('/services', payload);
        toast.success('New dental service created.');
      }

      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      toast.error(err.message || 'Failed to save service.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dental Service Management</h1>
          <p className="text-xs text-slate-500">Configure treatment prices, categories, and duration details</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <AdminNavTabs />

      {/* Services Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-4 px-5">Treatment Name</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5">Starting Price</th>
                <th className="py-4 px-5">Duration</th>
                <th className="py-4 px-5">Visits</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">Loading services...</td>
                </tr>
              ) : (
                services.map((svc) => (
                  <tr key={svc._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-900">{svc.name}</td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 font-semibold">{svc.category}</span>
                    </td>
                    <td className="py-4 px-5 font-black text-brand-700 text-sm">
                      ₹{svc.startingPrice?.toLocaleString()}
                    </td>
                    <td className="py-4 px-5">{svc.durationMinutes}</td>
                    <td className="py-4 px-5">{svc.visitsRequired}</td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(svc)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(svc._id)}
                          className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SERVICE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg">
                {editingService ? 'Edit Dental Service' : 'Add New Dental Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Service / Treatment Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Laser Teeth Whitening"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="Preventive Dentistry">Preventive Dentistry</option>
                    <option value="Cosmetic Dentistry">Cosmetic Dentistry</option>
                    <option value="Restorative Dentistry">Restorative Dentistry</option>
                    <option value="Orthodontics">Orthodontics</option>
                    <option value="Endodontics">Endodontics</option>
                    <option value="Periodontics">Periodontics</option>
                    <option value="Oral Surgery">Oral Surgery</option>
                    <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                    <option value="Emergency Care">Emergency Care</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Starting Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                    placeholder="e.g. 45 min"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Visits Required</label>
                  <input
                    type="text"
                    value={formData.visitsRequired}
                    onChange={(e) => setFormData({ ...formData, visitsRequired: e.target.value })}
                    placeholder="e.g. 1 visit"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Summary *</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="One-liner summary for cards..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500"
                ></textarea>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md"
                >
                  {submitting ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
