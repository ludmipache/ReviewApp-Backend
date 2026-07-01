import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRouter.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import ItemsList from './pages/ItemList.jsx';
import ItemDetail from './pages/ItemDetail.jsx';
import ItemForm from './pages/ItemForm.jsx';
import MyReviews from './pages/MyReview.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<ItemsList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/verificar-email" element={<VerifyEmail />} />
          <Route path="/items/:item_id" element={<ItemDetail />} />

          <Route
            path="/items/nuevo"
            element={
              <ProtectedRoute>
                <ItemForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/items/:item_id/editar"
            element={
              <ProtectedRoute>
                <ItemForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-resenas"
            element={
              <ProtectedRoute>
                <MyReviews />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="page container">
      <div className="empty-state">
        <h2>Página no encontrada</h2>
        <p>La sección que buscás no existe.</p>
      </div>
    </div>
  );
}