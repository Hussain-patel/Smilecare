import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Camera, Sparkles, X, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import { AdminNavTabs } from './AdminDashboard';
import { useToast } from '../../context/ToastContext';

export const AdminGallery = () => {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [beforeAfter, setBeforeAfter] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('gallery');

  // New Item Modals
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoForm, setPhotoForm] = useState({
    title: '',
    category: 'Treatment Rooms',
    image: '',
    caption: '',
  });

  const [isBaModalOpen, setIsBaModalOpen] = useState(false);
  const [baForm, setBaForm] = useState({
    title: '',
    category: 'Teeth Whitening',
    beforeImage: '',
    afterImage: '',
    treatmentType: '',
    duration: '2 weeks',
    description: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gRes, baRes] = await Promise.all([
        api.get('/gallery'),
        api.get('/gallery/before-after'),
      ]);
      if (gRes.success) setItems(gRes.items || []);
      if (baRes.success) setBeforeAfter(baRes.cases || []);
    } catch (err) {
      toast.error('Failed to load gallery items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeletePhoto = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Photo removed.');
      fetchData();
    } catch (err) {
      toast.error('Delete failed.');
    }
  };

  const handleDeleteBa = async (id) => {
    if (!window.confirm('Delete this transformation case?')) return;
    try {
      await api.delete(`/gallery/before-after/${id}`);
      toast.success('Case removed.');
      fetchData();
    } catch (err) {
      toast.error('Delete failed.');
    }
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/gallery', photoForm);
      toast.success('Photo added to gallery.');
      setIsPhotoModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to add photo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddBa = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/gallery/before-after', baForm);
      toast.success('Before & After case added.');
      setIsBaModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to add case.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gallery & Visual Media Management</h1>
          <p className="text-xs text-slate-500">Manage clinic interior photos, equipment views, and before & after cases</p>
        </div>

        {activeTab === 'gallery' ? (
          <button
            onClick={() => setIsPhotoModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start"
          >
            <Camera className="w-4 h-4" />
            <span>Add Clinic Photo</span>
          </button>
        ) : (
          <button
            onClick={() => setIsBaModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start"
          >
            <Sparkles className="w-4 h-4" />
            <span>Add Before & After Case</span>
          </button>
        )}
      </div>

      <AdminNavTabs />

      {/* Sub Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('gallery')}
          className={`pb-2 border-b-2 transition-colors ${
            activeTab === 'gallery' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'
          }`}
        >
          Clinic Photo Gallery ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('before-after')}
          className={`pb-2 border-b-2 transition-colors ${
            activeTab === 'before-after' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'
          }`}
        >
          Before & After Cases ({beforeAfter.length})
        </button>
      </div>

      {/* Gallery Grid */}
      {activeTab === 'gallery' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-card flex flex-col justify-between group">
              <div className="relative h-48 bg-slate-100">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-slate-800">
                  {item.category}
                </span>
                <button
                  onClick={() => handleDeletePhoto(item._id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs truncate">{item.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beforeAfter.map((ba) => (
            <div key={ba._id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-card p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 h-36">
                <div className="relative rounded-2xl overflow-hidden bg-slate-900">
                  <img src={ba.beforeImage} alt="Before" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] text-white font-bold">
                    BEFORE
                  </span>
                </div>
                <div className="relative rounded-2xl overflow-hidden bg-slate-900">
                  <img src={ba.afterImage} alt="After" className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-600 text-[10px] text-white font-bold">
                    AFTER
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{ba.title}</h4>
                  <p className="text-[11px] text-brand-700 font-semibold">{ba.treatmentType}</p>
                </div>
                <button
                  onClick={() => handleDeleteBa(ba._id)}
                  className="p-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PHOTO MODAL */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">Add Clinic Photo</h3>
              <button onClick={() => setIsPhotoModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPhoto} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={photoForm.title}
                  onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                  placeholder="e.g. Modern Consultation Suite"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={photoForm.category}
                  onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium bg-white"
                >
                  <option value="Clinic Exterior">Clinic Exterior</option>
                  <option value="Reception & Lounge">Reception & Lounge</option>
                  <option value="Treatment Rooms">Treatment Rooms</option>
                  <option value="Sterilization Area">Sterilization Area</option>
                  <option value="Dental Equipment">Dental Equipment</option>
                  <option value="Doctors & Staff">Doctors & Staff</option>
                  <option value="Pediatric Corner">Pediatric Corner</option>
                  <option value="Clinic Events">Clinic Events</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Photo Image URL *</label>
                <input
                  type="url"
                  required
                  value={photoForm.image}
                  onChange={(e) => setPhotoForm({ ...photoForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Caption / Description</label>
                <input
                  type="text"
                  value={photoForm.caption}
                  onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
                  placeholder="Brief note about this clinic area..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md mt-2"
              >
                {submitting ? 'Adding...' : 'Add Photo to Gallery'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BEFORE & AFTER MODAL */}
      {isBaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">Add Before & After Case</h3>
              <button onClick={() => setIsBaModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBa} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Case Title *</label>
                <input
                  type="text"
                  required
                  value={baForm.title}
                  onChange={(e) => setBaForm({ ...baForm, title: e.target.value })}
                  placeholder="e.g. Laser Whitening 6 Shades Brighter"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Treatment Type</label>
                <input
                  type="text"
                  required
                  value={baForm.treatmentType}
                  onChange={(e) => setBaForm({ ...baForm, treatmentType: e.target.value })}
                  placeholder="e.g. Philips Zoom Laser Whitening"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Before Image URL *</label>
                <input
                  type="url"
                  required
                  value={baForm.beforeImage}
                  onChange={(e) => setBaForm({ ...baForm, beforeImage: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">After Image URL *</label>
                <input
                  type="url"
                  required
                  value={baForm.afterImage}
                  onChange={(e) => setBaForm({ ...baForm, afterImage: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md mt-2"
              >
                {submitting ? 'Adding...' : 'Save Transformation Case'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
