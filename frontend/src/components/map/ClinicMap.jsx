import React from 'react';
import { MapPin, Navigation, ExternalLink, Phone, MessageCircle, Car, Train, Building2 } from 'lucide-react';

export const ClinicMap = ({ clinic }) => {
  const lat = clinic?.coordinates?.lat || 12.9784;
  const lng = clinic?.coordinates?.lng || 77.6408;
  const address = clinic?.address || {
    building: 'SmileCare Towers, 2nd & 3rd Floor',
    street: '42 Health Avenue, 100 Feet Road, Metro Pillar 128',
    area: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560038',
    landmark: 'Opposite Central Park Metro Station Gate 2',
  };

  const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  const phone = clinic?.phone || '+91 98765 43210';
  const whatsapp = clinic?.whatsapp || '+919876543210';

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-card">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Interactive Location Details (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-slate-50/50">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Clinic Location</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Visit SmileCare Dental
            </h3>

            {/* Address Box */}
            <div className="space-y-1.5 text-sm text-slate-600">
              <p className="font-bold text-slate-900">{address.building}</p>
              <p>{address.street}</p>
              <p>{address.area}, {address.city}, {address.state} - {address.pinCode}</p>
              {address.landmark && (
                <p className="text-xs text-brand-700 font-semibold pt-1">
                  📍 Landmark: {address.landmark}
                </p>
              )}
            </div>

            {/* Nearby Transit & Amenities */}
            <div className="space-y-2 pt-3 border-t border-slate-200">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Nearby Transit & Amenities
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/60 shadow-sm">
                  <Train className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>Metro Gate 2 (2 min)</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/60 shadow-sm">
                  <Car className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Free Valet Parking</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/60 shadow-sm">
                  <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>24/7 Pharmacy On-site</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation CTAs */}
          <div className="space-y-2.5 pt-4">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={googleDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Google Maps</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="py-2.5 px-3 rounded-xl bg-slate-200/70 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-brand-600" />
                <span>Call Clinic</span>
              </a>

              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs border border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Embedded Map (7 cols) */}
        <div className="lg:col-span-7 h-80 lg:h-auto min-h-[360px] relative bg-slate-100">
          <iframe
            title="SmileCare Dental Clinic Location Map"
            src={`https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=16&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};
