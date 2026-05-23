import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext.jsx';

// Layout components
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import Layout from '@/components/Layout.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';

// Public pages
import HomePage from '@/pages/HomePage.jsx';
import HowItWorksPage from '@/pages/HowItWorksPage.jsx';
import Solar101Page from '@/pages/Solar101Page.jsx';
import GetAQuotePage from '@/pages/GetAQuotePage.jsx';
import ContactPage from '@/pages/ContactPage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import CallbackPage from '@/pages/CallbackPage.jsx';
import AboutPage from '@/pages/AboutPage.jsx';
import ServicesPage from '@/pages/ServicesPage.jsx';
import SignupPage from '@/pages/SignupPage.jsx';

// Dashboard pages (protected)
import DashboardPage from '@/pages/DashboardPage.jsx';
import PipelinePage from '@/pages/PipelinePage.jsx';
import TeamPage from '@/pages/TeamPage.jsx';
import AccountPage from '@/pages/AccountPage.jsx';
import AgentBrainPage from '@/pages/AgentBrainPage.jsx';
import ResourcesPage from '@/pages/ResourcesPage.jsx';

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/how-it-works" element={<PublicLayout><HowItWorksPage /></PublicLayout>} />
          <Route path="/solar-101" element={<PublicLayout><Solar101Page /></PublicLayout>} />
          <Route path="/get-quote" element={<PublicLayout><GetAQuotePage /></PublicLayout>} />
          <Route path="/get-a-quote" element={<PublicLayout><GetAQuotePage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

          {/* Login + OAuth2 callback — no header/footer */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/callback" element={<CallbackPage />} />

          {/* Protected dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout><DashboardPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pipeline"
            element={
              <ProtectedRoute>
                <Layout><PipelinePage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/team"
            element={
              <ProtectedRoute>
                <Layout><TeamPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Layout><AccountPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <Layout><ResourcesPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent-brain"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout><AgentBrainPage /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<PublicLayout><HomePage /></PublicLayout>} />
        </Routes>
        <Toaster position="top-right" richColors />
      </Router>
    </AuthProvider>
  );
}

export default App;
