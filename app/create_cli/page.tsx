"use client"

import { useState, ChangeEvent, FormEvent } from "react";
import { ClientData } from "../lib/definitions";

export default function ClientForm() {

  const [datos, setDatos] = useState<ClientData>({
    rif: "",
    nombre: "",
    direccion: "",
    telefono: "",
    zonaCobranza: "",
    ciudad: "",
    diasVisita: "",
    frecuenciaVisita: ""
  });
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.currentTarget.name as keyof ClientData;
    const value = e.currentTarget.value;

    setDatos(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) return; 

    setIsSubmitting(true); 

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true'
        },
        body: JSON.stringify(datos)
      });

      if (!res.ok) throw new Error(`Error en la petición: ${res.status}`);
      
      setShowSuccessModal(true);

    } catch(err) {
      console.error(err);
      setIsSubmitting(false); 
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden">
        
        <div className="bg-gray-800 text-white py-4 px-6">
          <h2 className="text-xl font-semibold uppercase tracking-wider">Nuevo Cliente</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* RIF */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="rif">
                RIF
              </label>
              <input 
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                id="rif"
                name="rif"
                type="text" 
                placeholder="Ej. J-12345678-9" 
                required
              />
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="nombre">
                Nombre / Razón Social
              </label>
              <input 
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                id="nombre"
                name="nombre"
                type="text" 
                placeholder="Nombre del cliente o empresa"
                required 
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="telefono">
                Teléfono
              </label>
              <input 
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                id="telefono"
                name="telefono"
                type="text" 
                placeholder="Ej. 0414-1234567" 
                required
              />
            </div>

            {/* Ciudad */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="ciudad">
                Ciudad
              </label>
              <input 
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                id="ciudad"
                name="ciudad"
                type="text" 
                placeholder="Ej. Caracas" 
                required
              />
            </div>

            {/* Zona de Cobranza */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="zonaCobranza">
                Zona de Cobranza
              </label>
              <input 
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                id="zonaCobranza"
                name="zonaCobranza"
                type="text" 
                placeholder="Ej. Centro, Este, Zona Industrial" 
              />
            </div>

            {/* Frecuencia de Visita */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="frecuenciaVisita">
                Frecuencia de Visita
              </label>
              <input 
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                id="frecuenciaVisita"
                name="frecuenciaVisita"
                type="text" 
                placeholder="Ej. Semanal, Quincenal" 
              />
            </div>

            {/* Días de Visita */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="diasVisita">
                Días de Visita
              </label>
              <input 
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                id="diasVisita"
                name="diasVisita"
                type="text" 
                placeholder="Ej. Lunes y Miércoles por la mañana" 
              />
            </div>

            {/* Dirección */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="direccion">
                Dirección
              </label>
              <textarea 
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                id="direccion"
                name="direccion"
                rows={3}
                placeholder="Dirección exacta del local o vivienda..."
                required
              ></textarea>
            </div>

          </div>

          <div className="flex items-center justify-end mt-8 space-x-4">
            <a href=".">
              <button 
              type="button" 
              className="px-6 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
            >
              Cancelar
            </button>
            </a>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-6 py-2 text-white rounded-lg font-semibold shadow-md flex items-center transition-all ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gray-800 hover:bg-gray-900 transform active:scale-95'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              {isSubmitting ? 'Guardando...' : 'Guardar Cliente'}
            </button>
          </div>

        </form>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
            
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-xl font-bold mb-2 text-gray-800">¡Registro Exitoso!</h3>
            <p className="text-gray-600 mb-6">
              El cliente <strong>{datos.nombre}</strong> se creó correctamente.
            </p>

            <button 
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                window.location.href = '.'; 
              }} 
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-semibold transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};