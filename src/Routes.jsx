import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ProposalSubmission from './pages/proposal-submission';
import LoginPage from './pages/login';
import AdminConfiguration from './pages/admin-configuration';
import UserRegistration from './pages/user-registration';
import CitizenDashboard from './pages/citizen-dashboard';
import ProposalVoting from './pages/proposal-voting';
import ManagerAnalysis from './pages/manager-analysis';
import ProposalTrackingCitizenView from './pages/proposal-tracking-citizen-view';
import ManagerTrackingDashboard from './pages/manager-tracking-dashboard';

// Import Advanced RBAC Components
import AdvancedAuthGuard from './components/ui/AdvancedAuthGuard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <AdvancedAuthGuard requireAuth={false} logActivity={true}>
                <LoginPage />
              </AdvancedAuthGuard>
            } 
          />
          <Route 
            path="/user-registration" 
            element={
              <AdvancedAuthGuard requireAuth={false} logActivity={true}>
                <UserRegistration />
              </AdvancedAuthGuard>
            } 
          />

          {/* Admin/Manager Only Routes */}
          <Route 
            path="/admin-configuration" 
            element={
              <AdvancedAuthGuard 
                allowedRoles={['admin', 'gestor']}
                logActivity={true}
                rateLimitAction="admin_access"
                checkRateLimit={true}
              >
                <AdminConfiguration />
              </AdvancedAuthGuard>
            } 
          />
          <Route 
            path="/manager-analysis" 
            element={
              <AdvancedAuthGuard 
                allowedRoles={['admin', 'gestor']}
                logActivity={true}
                rateLimitAction="manager_analysis"
                checkRateLimit={true}
              >
                <ManagerAnalysis />
              </AdvancedAuthGuard>
            } 
          />
          <Route 
            path="/manager-tracking-dashboard" 
            element={
              <AdvancedAuthGuard 
                allowedRoles={['admin', 'gestor']}
                logActivity={true}
                rateLimitAction="manager_tracking"
                checkRateLimit={true}
              >
                <ManagerTrackingDashboard />
              </AdvancedAuthGuard>
            } 
          />

          {/* Citizen/Entity Only Routes */}
          <Route 
            path="/citizen-dashboard" 
            element={
              <AdvancedAuthGuard 
                allowedRoles={['citizen', 'entity']}
                logActivity={true}
              >
                <CitizenDashboard />
              </AdvancedAuthGuard>
            } 
          />
          <Route 
            path="/proposal-submission" 
            element={
              <AdvancedAuthGuard 
                allowedRoles={['citizen', 'entity']}
                logActivity={true}
                rateLimitAction="proposal_creation"
                checkRateLimit={true}
              >
                <ProposalSubmission />
              </AdvancedAuthGuard>
            } 
          />

          {/* Mixed Access Routes */}
          <Route 
            path="/proposal-voting" 
            element={
              <AdvancedAuthGuard 
                allowedRoles={['citizen', 'entity', 'gestor']}
                logActivity={true}
                rateLimitAction="voting_access"
                checkRateLimit={true}
              >
                <ProposalVoting />
              </AdvancedAuthGuard>
            } 
          />

          {/* Public Read Routes (Authentication Required) */}
          <Route 
            path="/proposal-tracking-citizen-view" 
            element={
              <AdvancedAuthGuard 
                requireAuth={true}
                logActivity={true}
              >
                <ProposalTrackingCitizenView />
              </AdvancedAuthGuard>
            } 
          />

          {/* Default Route - Role-based redirect */}
          <Route 
            path="/" 
            element={
              <AdvancedAuthGuard 
                requireAuth={true}
                logActivity={true}
                fallbackComponent={<AdminConfiguration />}
              >
                <AdminConfiguration />
              </AdvancedAuthGuard>
            } 
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;