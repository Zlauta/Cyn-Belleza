import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion"; 

import Home from "../pages/Home";
import Login from "../pages/Login";
import Registro from "../pages/Registro";

const PublicLayout = ({ children }) => (
  <div>[Navbar Pública] {children} [Footer]</div>
);
const AdminLayout = ({ children }) => (
  <div style={{ display: "flex" }}>
    [Sidebar Admin] <div style={{ flex: 1 }}>{children}</div>
  </div>
);

const ServiciosClie = () => <div>Nuestros Servicios (Vista Cliente)</div>;
const QuienesSomos = () => <div>Quiénes Somos</div>;
const Reservar = () => <div>Flujo de Reserva de Turno</div>;

const Dashboard = () => <div>Dashboard General</div>;
const AdminServicios = () => <div>Gestión de Servicios (CRUD)</div>;
const AdminUsuarios = () => <div>Gestión de Usuarios</div>;
const AdminTurnos = () => <div>Gestión de Turnos (Calendario)</div>;

const RutaProtegida = ({ children }) => {
  const estaLogueado = true;
  const esAdmin = true;

  if (!estaLogueado || !esAdmin) {
    return <Navigate to="/login" replace />;
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
              <ServiciosClie />
            </PublicLayout>
          }
        />
        <Route
          path="/nosotros"
          element={
            <PublicLayout>
              <QuienesSomos />
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

        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route
          path="/admin"
          element={
            <RutaProtegida>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/servicios"
          element={
            <RutaProtegida>
              <AdminLayout>
                <AdminServicios />
              </AdminLayout>
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <RutaProtegida>
              <AdminLayout>
                <AdminUsuarios />
              </AdminLayout>
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/turnos"
          element={
            <RutaProtegida>
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
