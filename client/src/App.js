import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ApartmentListPage from './pages/ApartmentListPage';
import CreateApartmentPage from './pages/CreateApartmentPage';
import BookingPage from './pages/BookingPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/apartments" element={<ApartmentListPage />} />
          <Route path="/create-apartment" element={<CreateApartmentPage />} />
          <Route path="/booking/:id" element={<BookingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
