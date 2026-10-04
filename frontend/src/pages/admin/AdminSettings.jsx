import React, { useState, useEffect } from 'react';
import { Settings, Save, Clock, MapPin, Phone, Mail, MessageCircle, Globe, Shield, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { AdminNavTabs } from './AdminDashboard';
import { useToast } from '../../context/ToastContext';

export const AdminSettings = () => {
  const toast = useToast();
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    tagline: '',
    phone: '',
    emergencyPhone: '',
    email: '',
    whatsapp: '',
    aboutDescription: '',
    address: {
      building: '',
      street: '',
      area: '',
      city: '',
      state: '',
      pinCode: '',
      country: '',
      landmark: '',
    },
    coordinates: {
      lat: 12.9784,
      lng: 77.6408,
    },
    socialLinks: {
      instagram: '',
      facebook: '',
      youtube: '',
      linkedin: '',
      twitter: '',
    },
    openingHours: [],
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/clinic');
      if (res.success && res.settings) {
        setClinic(res.settings);
        setFormData({
          name: res.settings.name || '',
          shortName: res.settings.shortName || '',
          tagline: res.settings.tagline || '',
          phone: res.settings.phone || '',
          emergencyPhone: res.settings.emergencyPhone || '',
          email: res.settings.email || '',
          whatsapp: res.settings.whatsapp || '',
          aboutDescription: res.settings.aboutDescription || '',
          address: {
            building: res.settings.address?.building || '',
            street: res.settings.address?.street || '',
            area: res.settings.address?.area || '',
            city: res.settings.address?.city || '',
            state: res.settings.address?.state || '',
            pinCode: res.settings.address?.pinCode || '',
            country: res.settings.address?.country || '',
            landmark: res.settings.address?.landmark || '',
          },
          coordinates: {
            lat: res.settings.coordinates?.lat || 12.9784,
            lng: res.settings.coordinates?.lng || 77.6408,
          },
          socialLinks: {
            instagram: res.settings.socialLinks?.instagram || '',
            facebook: res.settings.socialLinks?.facebook || '',
            youtube: res.settings.socialLinks?.youtube || '',
            linkedin: res.settings.socialLinks?.linkedin || '',
            twitter: res.settings.socialLinks?.twitter || '',
          },
          openingHours: res.settings.openingHours || [],
        });
      }
    } catch (err) {
      toast.error('Failed to load clinic settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleOpeningHoursChange = (index, field, value) => {
    const updated = [...formData.openingHours];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, openingHours: updated });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/clinic', formData);
      if (res.success) {
        toast.success('Clinic settings and hours updated successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Clinic Configuration & Settings</h1>
        <p className="text-xs text-slate-500">Edit clinic contacts, operating hours, coordinates, and social media</p>
      </div>

      <AdminNavTabs />

      {loading ? (
        <p className="text-center text-xs text-slate-400 py-12">Loading settings...</p>
      ) : (
        <form onSubmit={handleSave} className="space-y-8 text-xs">
          {/* 1. General Info & Tagline */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              General Clinic Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinic Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Brand Name</label>
                <input
                  type="text"
                  value={formData.shortName}
                  onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Clinic Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">About Bio / Description</label>
                <textarea
                  rows={3}
                  value={formData.aboutDescription}
                  onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                ></textarea>
              </div>
            </div>
          </div>

          {/* 2. Contact Numbers & Emergency */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Communication & Emergency Channels
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Primary Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Emergency 24/7 Hotline</label>
                <input
                  type="text"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium text-rose-600 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium text-emerald-700 font-bold"
                />
              </div>
            </div>
          </div>

          {/* 3. Address & Maps Coordinates */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Clinic Physical Address & Coordinates
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Building Name & Floor</label>
                <input
                  type="text"
                  value={formData.address.building}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, building: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Area / Locality</label>
                <input
                  type="text"
                  value={formData.address.area}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, area: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">City & State</label>
                <input
                  type="text"
                  value={`${formData.address.city}, ${formData.address.state}`}
                  onChange={(e) => {
                    const [city, state] = e.target.value.split(',').map((s) => s.trim());
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: city || '', state: state || '' },
                    });
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">PIN Code</label>
                <input
                  type="text"
                  value={formData.address.pinCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, pinCode: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Landmark</label>
                <input
                  type="text"
                  value={formData.address.landmark}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, landmark: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.coordinates.lat}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coordinates: { ...formData.coordinates, lat: Number(e.target.value) },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.coordinates.lng}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coordinates: { ...formData.coordinates, lng: Number(e.target.value) },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>
            </div>
          </div>

          {/* 4. Opening Hours Schedule Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>Weekly Opening Hours & Availability</span>
            </h3>

            <div className="space-y-2">
              {formData.openingHours.map((sch, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <span className="w-28 font-bold text-slate-800">{sch.day}</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={sch.open}
                      disabled={sch.isClosed}
                      onChange={(e) => handleOpeningHoursChange(i, 'open', e.target.value)}
                      className="p-1.5 rounded-lg border border-slate-200 w-24 text-center font-bold"
                    />
                    <span>to</span>
                    <input
                      type="text"
                      value={sch.close}
                      disabled={sch.isClosed}
                      onChange={(e) => handleOpeningHoursChange(i, 'close', e.target.value)}
                      className="p-1.5 rounded-lg border border-slate-200 w-24 text-center font-bold"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sch.isClosed}
                      onChange={(e) => handleOpeningHoursChange(i, 'isClosed', e.target.checked)}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span className="font-semibold text-slate-600">Closed</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Social Media Profiles */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Social Media Links (Official Profiles)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={formData.socialLinks.instagram}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Facebook URL</label>
                <input
                  type="url"
                  value={formData.socialLinks.facebook}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">YouTube URL</label>
                <input
                  type="url"
                  value={formData.socialLinks.youtube}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, youtube: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="py-3.5 px-8 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-sm shadow-xl shadow-brand-500/25 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Settings...' : 'Save All Clinic Settings'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
