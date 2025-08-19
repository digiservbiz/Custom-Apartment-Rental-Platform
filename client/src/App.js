import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ApartmentListPage from './pages/ApartmentListPage';
import CreateApartmentPage from './pages/CreateApartmentPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import LeaveReviewPage from './pages/LeaveReviewPage';
import ApartmentDetailsPage from './pages/ApartmentDetailsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRoute from './components/AdminRoute';
import UserListPage from './pages/admin/UserListPage';
import AdminApartmentListPage from './pages/admin/ApartmentListPage';
import AdminReviewListPage from './pages/admin/ReviewListPage';
import AdminKYCListPage from './pages/admin/KYCListPage';
import MyApartmentsPage from './pages/MyApartmentsPage';
import LoginSuccessPage from './pages/LoginSuccessPage';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// It's recommended to load Stripe outside of a component's render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <Elements stripe={stripePromise}>
      <Router>
        <Header />
        <main className="py-3">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login-success" element={<LoginSuccessPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/apartments" element={<ApartmentListPage />} />
          <Route path="/apartments/:id" element={<ApartmentDetailsPage />} />
          <Route path="/create-apartment" element={<CreateApartmentPage />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/review/:apartmentId" element={<LeaveReviewPage />} />
          <Route
            path="/my-apartments"
            element={
              <ProtectedRoute roles={['owner', 'agent', 'admin']}>
                <MyApartmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserListPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/apartments"
            element={
              <AdminRoute>
                <AdminApartmentListPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <AdminRoute>
                <AdminReviewListPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/kyc"
            element={
              <AdminRoute>
                <AdminKYCListPage />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
      </main>
    </Router>
  </Elements>
  );
}

export default App;
