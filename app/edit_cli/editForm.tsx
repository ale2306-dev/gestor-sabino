"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { ClientData } from "../lib/definitions";

type ClientType = ClientData & {
  _id?: string | null;
};

export default function EditClientForm({ initialData }: { initialData: ClientType }) {
  const [formData, setFormData] = useState({
    rif: initialData.rif ?? "",
    nombre: initialData.nombre ?? "",
    direccion: initialData.direccion ?? "",
    telefono: initialData.telefono ?? "",
    zonaCobranza: initialData.zonaCobranza ?? "",
    ciudad: initialData.ciudad ?? "",
    diasVisita: initialData.diasVisita ?? "",
    frecuenciaVisita: initialData.frecuenciaVisita ?? ""
  });

  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.currentTarget.name as keyof ClientData;
    const value = e.currentTarget.value;
    
    setFormData(prev => ({ ...prev, [name]: value }));
  }
    
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/clients?rif=${encodeURIComponent(String(initialData.rif))}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error(`Error en la petición: ${res.status}`);
      
      setShowSuccessModal(true);

    } catch(err) {
      console.error(err);
    }
  } 

  const handleDeleteClick = () => {
    setShowModal(true);
  }

  const confirmDelete = async () => {
    try {
      const res = await fetch(`/api/clients?rif=${encodeURIComponent(String(initialData.rif))}`, {
        method: 'DELETE',
        headers: { 'Bypass-Tunnel-Reminder': 'true'}
      });

      if (!res.ok) throw new Error(`Error al eliminar: ${res.status}`);
      
      window.location.href = '..'; 
    } catch(err) {
      console.error(err);
    } finally {
      setShowModal(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden">
        
        <div className="bg-purple-900 text-white py-4 px-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold uppercase tracking-wider">Editar Cliente</h2>
          <span className="bg-purple-700 text-xs px-2 py-1 rounded">Editando: {initialData.rif}</span>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* RIF */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="rif">
                RIF
              </label>
              <input 
                name="rif"
                value={formData.rif}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                type="text" 
                required
              />
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="nombre">
                Nombre / Razón Social
              </label>
              <input 
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                type="text" 
                required
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="telefono">
                Teléfono
              </label>
              <input 
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                type="text" 
                required
              />
            </div>

            {/* Ciudad */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="ciudad">
                Ciudad
              </label>
              <input 
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                type="text" 
                required
              />
            </div>

            {/* Zona de Cobranza */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="zonaCobranza">
                Zona de Cobranza
              </label>
              <input 
                name="zonaCobranza"
                value={formData.zonaCobranza}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                type="text" 
              />
            </div>

            {/* Frecuencia de Visita */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="frecuenciaVisita">
                Frecuencia de Visita
              </label>
              <input 
                name="frecuenciaVisita"
                value={formData.frecuenciaVisita}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                type="text" 
              />
            </div>

            {/* Días de Visita */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="diasVisita">
                Días de Visita
              </label>
              <input 
                name="diasVisita"
                value={formData.diasVisita}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                type="text" 
              />
            </div>

            {/* Dirección */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="direccion">
                Dirección
              </label>
              <textarea 
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                rows={3} 
                required
              ></textarea>
            </div>

          </div>

          {/* Botones */}
          <div className="flex flex-col-reverse md:flex-row items-stretch md:items-center justify-end mt-8 gap-4">
            
            <button 
              type="button"
              onClick={handleDeleteClick} 
              className="w-full md:w-auto px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-800 font-semibold shadow-md transform active:scale-95 transition-all flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash mr-2" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
              Eliminar
            </button>

            <a href=".." className="w-full md:w-auto">
              <button 
                type="button" 
                className="w-full px-6 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
              >
                Cancelar
              </button>
            </a>
            
            <button 
              type="submit" 
              className="w-full md:w-auto px-6 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-800 font-semibold shadow-md transform active:scale-95 transition-all flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Actualizar Datos
            </button>
          </div>

        </form>
      </div>
      
      {/* Modal de Confirmación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">¿Eliminar cliente?</h3>
            <p className="text-gray-600 mb-6">
              Estás a punto de eliminar al cliente <strong>{formData.nombre}</strong>. Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                type="button"
                onClick={() => setShowModal(false)} 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={confirmDelete} 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 font-semibold transition-colors"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito al Actualizar */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
            
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-xl font-bold mb-2 text-gray-800">¡Actualización Exitosa!</h3>
            <p className="text-gray-600 mb-6">
              Los datos de <strong>{formData.nombre}</strong> se guardaron correctamente.
            </p>

            <button 
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                window.location.href = '..'; 
              }} 
              className="w-full px-4 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-800 font-semibold transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}