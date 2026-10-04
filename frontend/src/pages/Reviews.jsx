import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, CheckCircle, X, Sparkles, Filter } from 'lucide-react';
import api from '../services/api';
import { ReviewCard } from '../components/cards/ReviewCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Reviews = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 4.9,
    totalReviews: 0,
    distributionPercentages: { 5: 90, 4: 8, 3: 2, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [ratingInput, setRatingInput] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    patientName: user?.name || '',
    patientEmail: user?.email || '',
    title: '',
    comment: '',
    doctorId: '',
    serviceId: '',
    treatmentExperience: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await api.get('/reviews');
        if (res.success) {
          setReviews(res.reviews || []);
          if (res.stats) setStats(res.stats);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Fetch doctors & services for review dropdowns
  useEffect(() => {
    const fetchHelpers = async () => {
      try {
        const [dRes, sRes] = await Promise.all([api.get('/doctors'), api.get('/services')]);
        if (dRes.success) setDoctors(dRes.doctors || []);
        if (sRes.success) setServices(sRes.services || []);
      } catch (err) {}
    };
    fetchHelpers();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!formData.patientName.trim() || !formData.comment.trim()) {
      toast.error('Please provide your name and review feedback.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        patientName: formData.patientName,
        patientEmail: formData.patientEmail,
        rating: ratingInput,
        title: formData.title,
        comment: formData.comment,
        doctorId: formData.doctorId || null,
        serviceId: formData.serviceId || null,
        treatmentExperience: formData.treatmentExperience,
      };

      const res = await api.post('/reviews', payload);
      if (res.success && res.review) {
        toast.success('Thank you! Your verified review has been posted.');
        setReviews([res.review, ...reviews]);
        setIsModalOpen(false);
        setFormData({
          patientName: user?.name || '',
          patientEmail: user?.email || '',
          title: '',
          comment: '',
          doctorId: '',
          serviceId: '',
          treatmentExperience: '',
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-brand-50/80 via-slate-50 to-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Verified Patient Experiences</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Patient Ratings & Reviews
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Read transparent reviews from patients treated by our dental team, or share your own clinic experience.
          </p>
        </div>
      </section>

      {/* Aggregate Rating Breakdown & Submit CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Average Score (4 cols) */}
          <div className="lg:col-span-4 text-center lg:text-left space-y-3 lg:border-r border-slate-100 lg:pr-8">
            <div className="flex items-baseline justify-center lg:justify-start gap-2">
              <span className="text-5xl sm:text-6xl font-black text-slate-900">
                {stats.averageRating || '4.9'}
              </span>
              <span className="text-lg text-slate-400 font-bold">/ 5.0</span>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-amber-400" />
              ))}
            </div>

            <p className="text-xs font-bold text-slate-500">
              Based on {stats.totalReviews || reviews.length} Verified Patient Reviews
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 w-full py-3 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Patient Review</span>
            </button>
          </div>

          {/* Right Distribution Bars (8 cols) */}
          <div className="lg:col-span-8 space-y-2.5">
            {[5, 4, 3, 2, 1].map((stars) => {
              const pct = stats.distributionPercentages?.[stars] || 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                  <span className="w-12 text-slate-800">{stars} Stars</span>
                  <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <span className="w-10 text-right text-slate-400">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Patient Feedback</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-100">
            No patient reviews yet. Be the first to share your experience!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <ReviewCard key={rev._id} review={rev} />
            ))}
          </div>
        )}
      </section>

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="space-y-0.5">
                <h3 className="font-black text-slate-900 text-lg">Share Your Experience</h3>
                <p className="text-xs text-slate-500">Your review helps other patients make informed choices</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Star Selector */}
              <div className="space-y-1.5 text-center py-2 bg-amber-50/60 rounded-2xl border border-amber-100">
                <span className="font-bold text-slate-800 text-xs block">Overall Rating *</span>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRatingInput(star)}
                      className="p-1 text-2xl transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating || ratingInput) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="e.g. Anjali Verma"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={formData.patientEmail}
                    onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                    placeholder="e.g. anjali@gmail.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>
              </div>

              {/* Doctor & Service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dentist Seen (Optional)</label>
                  <select
                    value={formData.doctorId}
                    onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 font-medium bg-white"
                  >
                    <option value="">-- Select Dentist --</option>
                    {doctors.map((d) => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Treatment Taken</label>
                  <input
                    type="text"
                    value={formData.treatmentExperience}
                    onChange={(e) => setFormData({ ...formData, treatmentExperience: e.target.value })}
                    placeholder="e.g. Teeth Whitening / RCT"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>
              </div>

              {/* Title & Comment */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Review Headline</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Extremely gentle and painless root canal!"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Detailed Feedback *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Tell us about the clinic cleanliness, doctor explanations, pain levels, and staff warmth..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 font-medium"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                {submitting ? 'Submitting Review...' : 'Publish Verified Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
