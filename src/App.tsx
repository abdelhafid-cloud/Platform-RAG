import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FilialeProvider } from './contexts/FilialeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Filiale from './pages/Filiale';
import Utilisateurs from './pages/Utilisateurs';
import AccederAssistant from './pages/AccederAssistant';
import AssistantPage from './pages/AssistantPage';
import BaseDocumentaire from './pages/BaseDocumentaire';
import Conversations from './pages/Conversations';
import Notifications from './pages/Notifications';
import Facturation from './pages/Facturation';
import Tickets from './pages/Tickets';
import Parametres from './pages/Parametres';

function LoginRedirect() {
  const { isAuthenticated, isLoading, userType } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Login />;
  }

  // Rediriger selon le type d'utilisateur
  if (userType === 'user') {
    return <Navigate to="/acceder-assistant" replace />;
  }

  return <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRedirect />} />
      
      {/* Route séparée pour l'interface de chat (sans Layout) */}
      <Route
        path="/acceder-assistant"
        element={
          <ProtectedRoute allowedRoles={['admin', 'user']}>
            <AccederAssistant />
          </ProtectedRoute>
        }
      />
      
      {/* Routes principales avec Layout - réservées à l'admin */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/filiale" element={<Filiale />} />
        <Route path="/utilisateurs" element={<Utilisateurs />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/base-documentaire" element={<BaseDocumentaire />} />
        <Route path="/conversations" element={<Conversations />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/facturation" element={<Facturation />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/parametres" element={<Parametres />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <FilialeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </FilialeProvider>
    </AuthProvider>
  );
}

export default App;
