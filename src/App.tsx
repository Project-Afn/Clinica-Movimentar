
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientDetail from "./pages/PatientDetail";
import Records from "./pages/Records";
import PatientForm from "./components/PatientForm";
import RecordForm from "./components/RecordForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/new" element={
            <div className="min-h-screen flex flex-col bg-gray-50">
              <main className="flex-grow p-4 sm:p-6">
                <div className="app-container max-w-3xl mx-auto">
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold">Novo Paciente</h1>
                  </div>
                  <PatientForm />
                </div>
              </main>
            </div>
          } />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/records" element={<Records />} />
          <Route path="/records/new/:patientId" element={
            <div className="min-h-screen flex flex-col bg-gray-50">
              <main className="flex-grow p-4 sm:p-6">
                <div className="app-container max-w-3xl mx-auto">
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold">Novo Prontuário</h1>
                  </div>
                  {/* Note: This route requires patientId and current user */}
                  {/* These will be handled in the component itself */}
                  <RecordForm 
                    patientId="placeholder" 
                    patientName="placeholder" 
                    currentUser={{
                      id: 'placeholder',
                      name: 'placeholder',
                      email: 'placeholder',
                      role: 'physiotherapist'
                    }}
                  />
                </div>
              </main>
            </div>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
