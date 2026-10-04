import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, Search, Sparkles } from 'lucide-react';
import api from '../services/api';

export const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedIndex, setExpandedIndex] = useState(0);

  const categories = [
    'All',
    'General & Appointments',
    'Treatments & Procedures',
    'Pricing & Insurance',
    'Emergency Care',
    'Post-Treatment Care',
  ];

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        let url = '/faqs';
        const params = [];
        if (activeCategory !== 'All') params.push(`category=${encodeURIComponent(activeCategory)}`);
        if (search.trim()) params.push(`search=${encodeURIComponent(search.trim())}`);
        if (params.length > 0) url += `?${params.join('&')}`;

        const res = await api.get(url);
        if (res.success) {
          setFaqs(res.faqs || []);
        }
      } catch (err) {
        console.error('FAQ error fetching:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, [activeCategory, search]);

  const toggleAccordion = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-brand-50/80 via-slate-50 to-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Patient Knowledge Base</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Find answers to common questions regarding dental appointments, root canal therapy, implants, payment options, and recovery.
          </p>
        </div>
      </section>

      {/* Category Pills & Search */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions (e.g. pain, root canal, cost)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-100">
            No FAQs match your search criteria.
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <div
                  key={faq._id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm hover:text-brand-600 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 text-brand-600' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-3 animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
