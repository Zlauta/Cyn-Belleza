import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home.jsx';
// Layouts (Estructura visual)
// Por ahora placeholders, los crearemos en el siguiente paso
const PublicLayout = ({ children }) => <div>[Navbar Pública] {children} [Footer]</div>;
const AdminLayout = ({ children }) => <div style={{display: 'flex'}}>[Sidebar Admin] <div style={{flex:1}}>{children}</div></div>;

// Páginas Públicas (Stubs)
const Login = () => <div>Página de Login</div>;
const Registro = () => <div>Página de Registro</div>;
const Servicios = () => <div>Nuestros Servicios (Vista Cliente)</div>;
const QuienesSomos = () => <div>Quiénes Somos</div>;
const Reservar = () => <div>Flujo de Reserva de Turno</div>;

// Páginas Admin (Stubs - Protegidas)
const Dashboard = () => <div>Dashboard General</div>;
const AdminServicios = () => <div>Gestión de Servicios (CRUD)</div>;
const AdminUsuarios = () => <div>Gestión de Usuarios</div>;
const AdminTurnos = () => <div>Gestión de Turnos (Calendario)</div>;

// 🔒 Placeholder para protección de rutas (luego integraremos el Token)
const RutaProtegida = ({ children }) => {
  const estaLogueado = true; // Simulación. Cambiar a 'false' para probar redirección.
  const esAdmin = true; // Simulación.

  if (!estaLogueado || !esAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌎 RUTAS PÚBLICAS (Cliente) */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/servicios" element={<PublicLayout><Servicios /></PublicLayout>} />
        <Route path="/nosotros" element={<PublicLayout><QuienesSomos /></PublicLayout>} />
        <Route path="/reservar" element={<PublicLayout><Reservar /></PublicLayout>} />
        
        {/* Rutas de autenticación (sin layout principal) */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* 🔐 RUTAS PRIVADAS (Admin Cynthia) */}
        <Route path="/admin" element={
          <RutaProtegida>
            <AdminLayout><Dashboard /></AdminLayout>
          </RutaProtegida>
        } />
        <Route path="/admin/servicios" element={
          <RutaProtegida>
            <AdminLayout><AdminServicios /></AdminLayout>
          </RutaProtegida>
        } />
        <Route path="/admin/usuarios" element={
          <RutaProtegida>
            <AdminLayout><AdminUsuarios /></AdminLayout>
          </RutaProtegida>
        } />
        <Route path="/admin/turnos" element={
          <RutaProtegida>
            <AdminLayout><AdminTurnos /></AdminLayout>
          </RutaProtegida>
        } />

        {/* Redirección por defecto si la ruta no existe */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;