import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ApartmentListPage from './pages/ApartmentListPage';
import CreateApartmentPage from './pages/CreateApartmentPage';
import EditApartmentPage from './pages/EditApartmentPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import OwnerBookingsPage from './pages/OwnerBookingsPage';
import LeaveReviewPage from './pages/LeaveReviewPage';
import ApartmentDetailsPage from './pages/ApartmentDetailsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRoute from './components/AdminRoute';
import UserListPage from './pages/admin/UserListPage';
import AdminApartmentListPage from './pages/admin/ApartmentListPage';
import AdminReviewListPage from './pages/admin/ReviewListPage';
import AdminKYCListPage from './pages/admin/KYCListPage';
import KYCManagementPage from './pages/admin/KYCManagementPage';
import ReviewModerationPage from './pages/admin/ReviewModerationPage';
import CommissionPage from './pages/admin/CommissionPage';
import ProfilePage from './pages/ProfilePage';
import MyApartmentsPage from './pages/MyApartmentsPage';
import LoginSuccessPage from './pages/LoginSuccessPage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/login-success" element={<LoginSuccessPage />} />
            <Route path="/apartments" element={<ApartmentListPage />} />
            <Route path="/apartments/:id" element={<ApartmentDetailsPage />} />
            <Route
              path="/create-apartment"
              element={
                <ProtectedRoute roles={['owner', 'agent', 'admin']}>
                  <CreateApartmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apartments/:id/edit"
              element={
                <ProtectedRoute roles={['owner', 'agent', 'admin']}>
                  <EditApartmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/:id"
              element={
                <ProtectedRoute roles={['renter', 'admin']}>
                  <BookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner-bookings"
              element={
                <ProtectedRoute roles={['owner', 'agent', 'admin']}>
                  <OwnerBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/review/:apartmentId"
              element={
                <ProtectedRoute roles={['renter', 'admin']}>
                  <LeaveReviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-apartments"
              element={
                <ProtectedRoute roles={['owner', 'agent', 'admin']}>
                  <MyApartmentsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UserListPage /></AdminRoute>} />
            <Route path="/admin/apartments" element={<AdminRoute><AdminApartmentListPage /></AdminRoute>} />
            <Route path="/admin/reviews" element={<AdminRoute><AdminReviewListPage /></AdminRoute>} />
            <Route path="/admin/kyc" element={<AdminRoute><AdminKYCListPage /></AdminRoute>} />
            <Route path="/admin/kyc-management" element={<AdminRoute><KYCManagementPage /></AdminRoute>} />
            <Route path="/admin/review-moderation" element={<AdminRoute><ReviewModerationPage /></AdminRoute>} />
            <Route path="/admin/commission" element={<AdminRoute><CommissionPage /></AdminRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
    </Router>
  );
}

export default App;
