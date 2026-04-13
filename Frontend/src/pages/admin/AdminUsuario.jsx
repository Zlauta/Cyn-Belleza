import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Plus, Edit2, Trash2, Search, LayoutGrid, List } from "lucide-react";
import {
  obtenerUsuarios,
  registroService,
  actualizarUsuario,
  eliminarUsuario,
} from "../../services/auth.services.js";
import ModalUsuario from "../../components/admin/ModalUsuario.jsx";
import ModalConfirmacion from "../../components/admin/ModalConfirmacion.jsx";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("TODOS");
  const [vista, setVista] = useState("tarjetas");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      try {
        setUsuarioLogueado(JSON.parse(usuarioGuardado));
      } catch (e) {
        console.error("Error al leer el usuario");
      }
    }
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const data = await obtenerUsuarios();
      setUsuarios(data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleAbrirModal = (usuario = null) => {
    setUsuarioAEditar(usuario);
    setModalAbierto(true);
  };

  const onSubmitForm = async (data) => {
    const loadToast = toast.loading(
      usuarioAEditar ? "Actualizando..." : "Creando...",
    );
    try {
      if (usuarioAEditar) {
        if (!data.contrasenia || data.contrasenia.trim() === "") {
          delete data.contrasenia;
        }
        await actualizarUsuario(usuarioAEditar.id, data);
        toast.success("Usuario actualizado", { id: loadToast });
      } else {
        await registroService(data);
        toast.success("Usuario creado", { id: loadToast });
      }
      setModalAbierto(false);
      cargarDatos();
    } catch (error) {
      toast.error(error.message, { id: loadToast });
    }
  };

  const iniciarEliminacion = (usuario) => {
    setUsuarioAEliminar(usuario);
    setConfirmacionAbierta(true);
  };

  const ejecutarEliminacion = async () => {
    if (!usuarioAEliminar) return;
    const loadToast = toast.loading("Eliminando usuario...");
    try {
      await eliminarUsuario(usuarioAEliminar.id);
      toast.success("Usuario eliminado", { id: loadToast });
      setUsuarios((prev) => prev.filter((u) => u.id !== usuarioAEliminar.id));
      setConfirmacionAbierta(false);
      setUsuarioAEliminar(null);
    } catch (error) {
      toast.error(error.message, { id: loadToast });
      setConfirmacionAbierta(false);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideBusqueda =
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase());
    const coincideRol = filtroRol === "TODOS" || u.rol === filtroRol;
    return coincideBusqueda && coincideRol;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Equipo y Usuarios</h1>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row justify-between gap-4 items-center">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500 outline-none"
            />
          </div>

          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className="w-full sm:w-48 px-4 py-2 border border-gray-200 rounded-xl focus:ring-pink-500 focus:border-pink-500 outline-none bg-white"
          >
            <option value="TODOS">Todos los roles</option>
            <option value="ADMIN">Administradores</option>
            <option value="USER">Clientes</option>
          </select>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setVista("tarjetas")}
              className={`p-2 rounded-md transition-colors ${vista === "tarjetas" ? "bg-white shadow-sm text-pink-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setVista("tabla")}
              className={`p-2 rounded-md transition-colors ${vista === "tabla" ? "bg-white shadow-sm text-pink-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => handleAbrirModal()}
            className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium shadow-sm"
          >
            <Plus className="w-5 h-5" /> Agregar
          </button>
        </div>
      </div>

      {cargando ? (
        <div className="text-center py-12 text-gray-500">
          Cargando usuarios...
        </div>
      ) : usuariosFiltrados.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No se encontraron usuarios.
        </div>
      ) : (
        <>
          {vista === "tarjetas" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {usuariosFiltrados.map((u) => {
                const soyYo = usuarioLogueado?.id === u.id;
                const iniciales = u.nombre
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase();
                return (
                  <div
                    key={u.id}
                    className={`bg-white rounded-2xl p-6 border transition-all hover:shadow-md ${soyYo ? "border-pink-200 ring-1 ring-pink-50" : "border-gray-100"}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${soyYo ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-600"}`}
                      >
                        {iniciales}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          {u.nombre}
                          {soyYo && (
                            <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                              Tú
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${u.rol === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                      >
                        {u.rol}
                      </span>
                      <div className="flex gap-2">
                        {!soyYo ? (
                          <>
                            <button
                              onClick={() => handleAbrirModal(u)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => iniciarEliminacion(u)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            Protegido
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {vista === "tabla" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                    <th className="p-4 font-semibold">Nombre</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Rol</th>
                    <th className="p-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((u) => {
                    const soyYo = usuarioLogueado?.id === u.id;
                    return (
                      <tr
                        key={u.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50"
                      >
                        <td className="p-4 font-medium text-gray-800 flex items-center gap-2">
                          {u.nombre}{" "}
                          {soyYo && (
                            <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full uppercase font-bold">
                              Tú
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-gray-600">{u.email}</td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${u.rol === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                          >
                            {u.rol}
                          </span>
                        </td>
                        <td className="p-4 flex justify-end gap-2">
                          {!soyYo ? (
                            <>
                              <button
                                onClick={() => handleAbrirModal(u)}
                                className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => iniciarEliminacion(u)}
                                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400 italic py-2">
                              Protegido
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <ModalUsuario
        abierto={modalAbierto}
        cerrar={() => setModalAbierto(false)}
        usuarioAEditar={usuarioAEditar}
        onSubmitForm={onSubmitForm}
      />

      {/* Cuidado acá: asegurate que la prop onConfirmar coincida con el onClick de tu botón dentro de ConfirmacionModal */}
      <ModalConfirmacion
        abierto={confirmacionAbierta}
        cerrar={() => setConfirmacionAbierta(false)}
        confirmar={ejecutarEliminacion}
        mensaje={`¿Estás seguro que deseas eliminar a ${usuarioAEliminar?.nombre}? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};

export default AdminUsuarios;
