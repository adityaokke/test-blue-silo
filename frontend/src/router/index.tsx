import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import NotFoundPage from "../pages/auth/NotFoundPage";
import TicketListPage from "../pages/tickets/TicketListPage";
import ProtectedRoute from "../layout/ProtectedRoute";
import SignupPage from "../pages/auth/SignupPage";
import CreateTicketPage from "../pages/tickets/CreateTicketPage";
import TicketDetailPage from "../pages/tickets/TicketDetailPage";
import UpdateTicketL1Page from "../pages/tickets/UpdateTicketL1Page";
import UpdateTicketL2Page from "../pages/tickets/UpdateTicketL2Page";
import UpdateTicketL3Page from "../pages/tickets/UpdateTicketL3Page";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected */}
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <TicketListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/create"
          element={
            <ProtectedRoute>
              <CreateTicketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute>
              <TicketDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/:id/update/l1"
          element={
            <ProtectedRoute>
              <UpdateTicketL1Page />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/:id/update/l2"
          element={
            <ProtectedRoute>
              <UpdateTicketL2Page />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/:id/update/l3"
          element={
            <ProtectedRoute>
              <UpdateTicketL3Page />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="/" element={<Navigate to="/tickets" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
