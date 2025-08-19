import React from "react";
import { Routes, Route } from "react-router-dom";
import LegalTerms from "../pages/LegalTerms";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import CookiePolicy from "../pages/CookiePolicy";
import Landing from "../pages/Landing";
import VerifyEmail from "../pages/VerifyEmail";

const AppRoutes = () => {

  return (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/legal-terms" element={<LegalTerms />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/cookies" element={<CookiePolicy />} />
    <Route path="/verify-email/:token" element={<VerifyEmail />} />
  </Routes>)
};

export default AppRoutes;