import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Doctors } from './pages/Doctors';
import { DoctorDetail } from './pages/DoctorDetail';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { Pricing } from './pages/Pricing';
import { Technology } from './pages/Technology';
import { Gallery } from './pages/Gallery';
import { BeforeAfter } from './pages/BeforeAfter';
import { Reviews } from './pages/Reviews';
import { LocationContact } from './pages/LocationContact';
import { FAQ } from './pages/FAQ';
import { Booking } from './pages/Booking';
import { BookingSuccess } from './pages/BookingSuccess';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PatientDashboard } from './pages/PatientDashboard';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminAppointments } from './pages/admin/AdminAppointments';
import { AdminDoctors } from './pages/admin/AdminDoctors';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminEquipment } from './pages/admin/AdminEquipment';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminSettings } from './pages/admin/AdminSettings';

function App() {
  const { pathname } = useLocation();

  // Scroll to top automatically on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content View */}
      <main className="flex-1">
        <Routes>
          {/* Public Discovery Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:idOrSlug" element={<ServiceDetail />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/before-after" element={<BeforeAfter />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<LocationContact />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Booking & Auth Routes */}
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking-success/:idOrNumber" element={<BookingSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Patient Portal (Protected) */}
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Portal (Protected Role: ADMIN) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDoctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gallery"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminGallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/equipment"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminEquipment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminSettings />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
}

export default App;
