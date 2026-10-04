import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Edit,
  Trash2,
  Star,
  Award,
  Clock,
  Languages,
  X,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import api from '../../services/api';
import { AdminNavTabs } from './AdminDashboard';
import { useToast } from '../../context/ToastContext';

export const AdminDoctors = () => {
  const toast = useToast();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Doctor Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    qualification: '',
    designation: 'Senior Dental Consultant',
    specialization: '',
    experienceYears: 10,
    registrationNumber: '',
    consultationFee: 600,
    photo: '',
    about: '',
    languages: 'English, Hindi',
    availableDays: 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/doctors');
      if (res.success) {
        setDoctors(res.doctors || []);
      }
    } catch (err) {
      toast.error('Failed to load doctors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleOpenAdd = () => {
    setEditingDoctor(null);
    setFormData({
      name: '',
      qualification: '',
      designation: 'Senior Dental Consultant',
      specialization: '',
      experienceYears: 10,
      registrationNumber: '',
      consultationFee: 600,
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop',
      about: '',
      languages: 'English, Hindi',
      availableDays: 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc) => {
    setEditingDoctor(doc);
    setFormData({
      name: doc.name,
      qualification: doc.qualification,
      designation: doc.designation || 'Senior Consultant',
      specialization: doc.specialization?.join(', ') || '',
      experienceYears: doc.experienceYears,
      registrationNumber: doc.registrationNumber || '',
      consultationFee: doc.consultationFee,
      photo: doc.photo,
      about: doc.about,
      languages: doc.languages?.join(', ') || 'English, Hindi',
      availableDays: doc.availableDays?.join(', ') || 'Monday, Tuesday, Wednesday, Thursday, Friday',
    });
    setIsModalOpen(true);
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      const res = await api.delete(`/doctors/${id}`);
      if (res.success) {
        toast.success('Doctor removed successfully.');
        fetchDoctors();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete doctor.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        qualification: formData.qualification,
        designation: formData.designation,
        specialization: formData.specialization.split(',').map((s) => s.trim()).filter(Boolean),
        experienceYears: Number(formData.experienceYears),
        registrationNumber: formData.registrationNumber,
        consultationFee: Number(formData.consultationFee),
        photo: formData.photo,
        about: formData.about,
        languages: formData.languages.split(',').map((s) => s.trim()).filter(Boolean),
        availableDays: formData.availableDays.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (editingDoctor) {
        await api.put(`/doctors/${editingDoctor._id}`, payload);
        toast.success('Doctor details updated successfully.');
      } else {
        await api.post('/doctors', payload);
        toast.success('New doctor profile added successfully.');
      }

      setIsModalOpen(false);
      fetchDoctors();
    } catch (err) {
      toast.error(err.message || 'Failed to save doctor.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Doctor & Specialist Management</h1>
          <p className="text-xs text-slate-500">Add dental specialists, configure consultation fees, and manage availability</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Doctor</span>
        </button>
      </div>

      <AdminNavTabs />

      {/* Doctor Cards Grid */}
      {loading ? (
        <p className="text-center text-xs text-slate-400 py-12">Loading doctors...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={doc.photo}
                    alt={doc.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                  />
                  <div className="space-y-0.5">
                    <h3 className="font-black text-slate-900 text-base">{doc.name}</h3>
                    <p className="text-xs text-brand-700 font-bold">{doc.qualification}</p>
                    <p className="text-[11px] text-slate-400">{doc.designation}</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Experience</span>
                    <strong className="text-slate-800">{doc.experienceYears}+ Years</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Fee</span>
                    <strong className="text-brand-700">₹{doc.consultationFee}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">{doc.about}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(doc)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDeleteDoctor(doc._id)}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT DOCTOR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg">
                {editingDoctor ? 'Edit Doctor Profile' : 'Add New Dental Specialist'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Doctor Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. A. Sharma"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Qualifications *</label>
                  <input
                    type="text"
                    required
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g. BDS, MDS (Orthodontics)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Specializations (comma separated)</label>
                  <input
                    type="text"
                    required
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="e.g. Dental Implants, Oral Surgery"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      required
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Fee (₹)</label>
                    <input
                      type="number"
                      required
                      value={formData.consultationFee}
                      onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Photo Image URL</label>
                  <input
                    type="url"
                    required
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Doctor Bio / Background</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    placeholder="Provide detailed biography and surgical highlights..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500"
                  ></textarea>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Available Working Days</label>
                  <input
                    type="text"
                    value={formData.availableDays}
                    onChange={(e) => setFormData({ ...formData, availableDays: e.target.value })}
                    placeholder="Monday, Tuesday, Wednesday..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500"
                  />
                </div>
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
                  {submitting ? 'Saving...' : 'Save Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
