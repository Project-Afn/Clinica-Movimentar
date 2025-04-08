import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Patients from '@/pages/Patients';
import PatientForm from '@/components/PatientForm';
import PatientDetails from '@/pages/PatientDetails';
import Records from '@/pages/Records';
import RecordForm from '@/components/RecordForm';
import RecordDetails from '@/pages/RecordDetails';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/AuthContext';

const queryClient = new QueryClient();

const RecordFormWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  if (!user || !id) {
    return null;
  }

  return (
    <RecordForm
      patientId={id}
      patientName=""
      currentUser={user}
    />
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients"
                element={
                  <ProtectedRoute>
                    <Patients />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/new"
                element={
                  <ProtectedRoute>
                    <PatientForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/:id"
                element={
                  <ProtectedRoute>
                    <PatientDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/records"
                element={
                  <ProtectedRoute>
                    <Records />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/records/new/:id"
                element={
                  <ProtectedRoute>
                    <RecordFormWrapper />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/records/:id"
                element={
                  <ProtectedRoute>
                    <RecordDetails />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
