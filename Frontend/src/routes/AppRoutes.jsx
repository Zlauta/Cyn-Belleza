import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import Reservar from "../pages/Reservar";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Servicios from "../pages/Servicios.jsx";
import AdminLayout from "../layout/AdminLayout.jsx";
import Dashboard from "../pages/admin/Dashboard.jsx";
import AdminServicios from "../pages/admin/AdminServicio.jsx";
import AdminTurnos from "../pages/admin/AdminTurnos.jsx";
import AdminUsuarios from "../pages/admin/AdminUsuario.jsx";
import MisTurnos from "../pages/MisTurnos.jsx";

const PublicLayout = ({ children }) => (
  <div>
    <Navbar />
    {children}
    <Footer />
  </div>
);
const RutaProtegida = ({ children, requiereAdmin = false }) => {
  const { token, esAdmin } = useAuth();
  const location = useLocation();

  // Si no hay token, redirigir al login guardando la ruta
  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Si la ruta es exclusiva de Admin y el usuario no es admin
  if (requiereAdmin && !esAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const location = useLocation(); // 👉 2. Detectamos en qué ruta estamos

  return (
    // 👉 3. Envolvemos las rutas. mode="wait" evita que se superpongan.
    <AnimatePresence mode="wait">
      {/* Es VITAL pasarle location y key para que AnimatePresence sepa cuándo animar */}
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/servicios"
          element={
            <PublicLayout>
              <Servicios />
            </PublicLayout>
          }
        />
        <Route
          path="/reservar"
          element={
            <PublicLayout>
              <Reservar />
            </PublicLayout>
          }
        />

        <Route
          path="/mis-turnos"
          element={
            <RutaProtegida requiereAdmin={false}>
              <PublicLayout>
                <MisTurnos />
              </PublicLayout>
            </RutaProtegida>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* 🔐 RUTAS PRIVADAS (Admin Cynthia) */}
        <Route
          path="/admin"
          element={
            <RutaProtegida requiereAdmin={true}>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/servicios"
          element={
            <RutaProtegida requiereAdmin={true}>
              <AdminLayout>
                <AdminServicios />
              </AdminLayout>
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <RutaProtegida requiereAdmin={true}>
              <AdminLayout>
                <AdminUsuarios />
              </AdminLayout>
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/turnos"
          element={
            <RutaProtegida requiereAdmin={true}>
              <AdminLayout>
                <AdminTurnos />
              </AdminLayout>
            </RutaProtegida>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
