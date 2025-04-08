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
import { useState, useEffect } from 'react';
import { getPatientById } from '@/services/patientService';
import { Patient } from '@/lib/types';

const queryClient = new QueryClient();

const RecordFormWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      
      try {
        const data = await getPatientById(id);
        setPatient(data);
      } catch (error) {
        console.error('Erro ao buscar paciente:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (!user || !id || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow p-4 sm:p-6">
          <div className="app-container">
            <div className="text-center p-8">
              <p>Carregando...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow p-4 sm:p-6">
          <div className="app-container">
            <div className="text-center p-8">
              <p>Paciente não encontrado</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <RecordForm
      patientId={id}
      patientName={patient.name}
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
