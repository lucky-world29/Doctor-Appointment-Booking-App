import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// =========================================
// COMPONENTS
// =========================================

import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// =========================================
// PAGES
// =========================================

import Home from "./pages/Home/Home";
import Doctors from "./pages/Doctors/Doctors";
import DoctorDetails from "./pages/DoctorDetails/DoctorDetails";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import BookAppointment from "./pages/BookAppointment/BookAppointment";
import Contact from "./pages/Contact/Contact";
import Profile from "./pages/Profile/Profile";

// =========================================
// COMMON PAGES
// =========================================

import Terms from "./common/Terms";
import PrivacyPolicy from "./common/PrivacyPolicy";

// =========================================
// ERROR PAGES
// =========================================

import Error400 from "./common/Error400";
import Error401 from "./common/Error401";
import Error403 from "./common/Error403";
import Error404 from "./common/Error404";
import Error500 from "./common/Error500";

//=========================================
// TOAST CONTEXT
//=========================================


import { Toaster } from "react-hot-toast";

// =========================================
// APP CONTENT
// =========================================

function AppContent() {
  const location = useLocation();

  // =========================================
  // HIDE NAVBAR ON AUTH PAGES
  // =========================================

  const authPages = ["/login", "/register"];

  const hideNavbar = authPages.includes(location.pathname);

  return (
    <>
      {/* =========================================
                NAVBAR
            ========================================== */}

      {!hideNavbar && <Navbar />}

      {/* =========================================
                APPLICATION ROUTES
            ========================================== */}

      <Routes>
        {/* =========================================
                    PUBLIC PAGES
                ========================================== */}

        <Route path="/" element={<Home />} />

        <Route path="/doctors" element={<Doctors />} />

        <Route path="/doctors/:id" element={<DoctorDetails />} />

        <Route path="/contact" element={<Contact />} />

        {/* =========================================
                    AUTHENTICATION
                ========================================== */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* =========================================
                    PROTECTED PROFILE
                ========================================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* =========================================
                    PROTECTED BOOKING
                ========================================== */}

        <Route
          path="/book/:id"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        {/* =========================================
                    LEGAL PAGES
                ========================================== */}

        <Route path="/terms" element={<Terms />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* =========================================
                    ERROR / SYSTEM PAGES
                ========================================== */}

        <Route path="/400" element={<Error400 />} />

        <Route path="/401" element={<Error401 />} />

        <Route path="/403" element={<Error403 />} />

        <Route path="/404" element={<Error404 />} />

        <Route path="/500" element={<Error500 />} />

        {/* =========================================
                    UNKNOWN ROUTE
                ========================================== */}

        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
}

// =========================================
// APP
// =========================================

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />

      <AppContent />
    </BrowserRouter>
  );
}

export default App;
