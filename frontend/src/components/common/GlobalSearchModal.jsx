import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Stethoscope, User, Cpu, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import api from '../../services/api';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ services: [], doctors: [], equipment: [], faqs: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults({ services: [], doctors: [], equipment: [], faqs: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ services: [], doctors: [], equipment: [], faqs: [] });
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/clinic/search?q=${encodeURIComponent(query.trim())}`);
        if (res.success && res.results) {
          setResults(res.results);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  const totalHits =
    results.services.length +
    results.doctors.length +
    results.equipment.length +
    results.faqs.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-brand-600 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search treatments, doctors, technology, FAQs..."
            className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-base font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-slate-500 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-6 flex-1">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
              <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm">Searching SmileCare database...</p>
            </div>
          )}

          {!loading && query && totalHits === 0 && (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Sparkles className="w-8 h-8 text-brand-400 mx-auto" />
              <p className="font-semibold text-slate-700">No matching dental services or doctors found</p>
              <p className="text-sm text-slate-400">Try searching for "Root Canal", "Implants", "Whitening", or "Dr. Ahmed"</p>
            </div>
          )}

          {!loading && !query && (
            <div className="py-8 px-4 text-slate-500 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick suggestions</p>
              <div className="flex flex-wrap gap-2">
                {['Root Canal', 'Teeth Whitening', 'Dental Implants', 'Invisalign', 'Dr. Mohammed Ahmed', 'Emergency Care'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && totalHits > 0 && (
            <div className="space-y-5">
              {/* Services */}
              {results.services.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 mb-2">
                    <Stethoscope className="w-3.5 h-3.5" />
                    Dental Treatments & Services ({results.services.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.services.map((svc) => (
                      <div
                        key={svc._id}
                        onClick={() => handleSelect(`/services/${svc.slug || svc._id}`)}
                        className="p-3 rounded-xl hover:bg-brand-50/70 border border-transparent hover:border-brand-200 cursor-pointer flex items-center justify-between transition-all group"
                      >
                        <div>
                          <div className="font-semibold text-slate-800 text-sm group-hover:text-brand-700">
                            {svc.name}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1">
                            {svc.shortDescription}
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                            Starts ₹{svc.startingPrice?.toLocaleString()}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctors */}
              {results.doctors.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-700 mb-2">
                    <User className="w-3.5 h-3.5" />
                    Specialist Doctors ({results.doctors.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.doctors.map((doc) => (
                      <div
                        key={doc._id}
                        onClick={() => handleSelect(`/doctors/${doc._id}`)}
                        className="p-3 rounded-xl hover:bg-accent-50/70 border border-transparent hover:border-accent-200 cursor-pointer flex items-center justify-between transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={doc.photo}
                            alt={doc.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-semibold text-slate-800 text-sm group-hover:text-accent-700">
                              {doc.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {doc.qualification} • {doc.specialization?.[0]}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-accent-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment */}
              {results.equipment.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 mb-2">
                    <Cpu className="w-3.5 h-3.5" />
                    Technology & Machines ({results.equipment.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.equipment.map((eq) => (
                      <div
                        key={eq._id}
                        onClick={() => handleSelect('/technology')}
                        className="p-3 rounded-xl hover:bg-purple-50/70 border border-transparent hover:border-purple-200 cursor-pointer flex items-center justify-between transition-all group"
                      >
                        <div>
                          <div className="font-semibold text-slate-800 text-sm group-hover:text-purple-700">
                            {eq.name}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1">{eq.purpose}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {results.faqs.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Related FAQs ({results.faqs.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.faqs.map((faq) => (
                      <div
                        key={faq._id}
                        onClick={() => handleSelect('/faq')}
                        className="p-3 rounded-xl hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200 cursor-pointer flex items-center justify-between transition-all group"
                      >
                        <div>
                          <div className="font-semibold text-slate-800 text-sm group-hover:text-emerald-700">
                            {faq.question}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1">{faq.answer}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
