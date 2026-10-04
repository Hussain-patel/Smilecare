import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, EyeOff, Trash2, MessageSquare, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { AdminNavTabs } from './AdminDashboard';
import { useToast } from '../../context/ToastContext';

export const AdminReviews = () => {
  const toast = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reviews/admin/all');
      if (res.success) {
        setReviews(res.reviews || []);
      }
    } catch (err) {
      toast.error('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminReviews();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await api.put(`/reviews/admin/${id}`, { isApproved: !currentStatus });
      if (res.success) {
        toast.success(`Review ${!currentStatus ? 'Approved' : 'Hidden'}`);
        fetchAdminReviews();
      }
    } catch (err) {
      toast.error('Status update failed.');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await api.delete(`/reviews/admin/${id}`);
      if (res.success) {
        toast.success('Review deleted.');
        fetchAdminReviews();
      }
    } catch (err) {
      toast.error('Delete failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Patient Review Moderation</h1>
        <p className="text-xs text-slate-500">Approve, hide, or manage patient reviews and testimonials</p>
      </div>

      <AdminNavTabs />

      {/* Reviews Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-4 px-5">Patient Name</th>
                <th className="py-4 px-5">Rating</th>
                <th className="py-4 px-5">Review Feedback</th>
                <th className="py-4 px-5">Doctor / Service</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">Loading reviews...</td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">No reviews found.</td>
                </tr>
              ) : (
                reviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <p className="font-bold text-slate-900">{rev.patientName}</p>
                      <p className="text-[11px] text-slate-400">{rev.patientEmail || 'No email'}</p>
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>{rev.rating}</span>
                      </div>
                    </td>

                    <td className="py-4 px-5 max-w-xs">
                      {rev.title && <p className="font-bold text-slate-900 truncate">"{rev.title}"</p>}
                      <p className="text-slate-600 line-clamp-2 italic">{rev.comment}</p>
                    </td>

                    <td className="py-4 px-5">
                      <p className="font-bold text-slate-800">{rev.doctor?.name || 'Clinic'}</p>
                      <p className="text-[11px] text-slate-500">{rev.treatmentExperience || rev.service?.name}</p>
                    </td>

                    <td className="py-4 px-5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          rev.isApproved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {rev.isApproved ? 'Approved (Visible)' : 'Hidden'}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(rev._id, rev.isApproved)}
                          className={`p-1.5 rounded-lg border text-xs font-bold ${
                            rev.isApproved
                              ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                          title={rev.isApproved ? 'Hide from public' : 'Approve for public'}
                        >
                          {rev.isApproved ? <EyeOff className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleDeleteReview(rev._id)}
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
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
    </div>
  );
};
