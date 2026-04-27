import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al montar: leer desde localStorage
  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");
    const usuarioGuardado = localStorage.getItem("usuario");

    if (tokenGuardado) {
      setToken(tokenGuardado);
    }

    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (err) {
        console.error("Error parseando usuario:", err);
        localStorage.removeItem("usuario");
      }
    }

    setCargando(false);
  }, []);

  // Login: guardar en state y localStorage
  const login = (tokenNuevo, usuarioNuevo) => {
    setToken(tokenNuevo);
    setUsuario(usuarioNuevo);
    localStorage.setItem("token", tokenNuevo);
    localStorage.setItem("usuario", JSON.stringify(usuarioNuevo));
  };

  // Logout: limpiar state y localStorage, redirigir
  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  };

  const value = {
    usuario,
    token,
    cargando,
    login,
    logout,
    estaAutenticado: !!token,
    esAdmin: usuario?.rol === "ADMIN",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
