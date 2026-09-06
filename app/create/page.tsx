"use client"

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { InvoiceData, ClientData } from "../lib/definitions";

export default function InvoiceForm(){

  //useState de datos del formulario
  const [datos, setDatos] = useState<InvoiceData>({id:"",cliente:"",fechad:"",fechat:"",fechap:"",monto:0,obs:""})
  //useState de clientes
  const [clientes, setClientes] = useState<ClientData[]>([]);
  //useState de modales
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buscar clientes en la DB
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch('/api/clients');
        if (!res.ok) throw new Error('Error al cargar clientes');
        const data = await res.json();
        setClientes(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClientes();
  }, []);

  // Rellenar formulario cada que se actualiza el valor del input
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e.currentTarget.name as keyof InvoiceData
    let value: string | number = e.currentTarget.value

    if (name === "monto"){ value = Number(value)}

    setDatos(prev => ({ ...prev, [name]: value }));
  }

  // Enviar datos a la DB
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) return; 

    setIsSubmitting(true); 

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
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
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gray-800 text-white py-4 px-6">
          <h2 className="text-xl font-semibold uppercase tracking-wider">Nueva Factura</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/*  Factura */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="factura">
                No. Factura o Nota
              </label>
              <input 
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                id="factura"
                name="id"
                type="text" 
                placeholder="Ej. FAC-001" 
                required
              />
            </div>

            {/* Monto */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="monto">
                Monto ($)
              </label>
              <input 
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                id="monto"
                name="monto"
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                required
              />
            </div>

            {/* Cliente  */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="cliente">
                Cliente
              </label>
              <select 
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all bg-white"
                id="cliente"
                name="cliente"
                value={datos.cliente}
                required
              >
                <option value="" disabled>-- Selecciona un cliente --</option>
                {clientes.map((cli) => (
                  <option key={cli.rif} value={cli.rif}>
                    {cli.cliente} (RIF: {cli.rif})
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha de Despacho */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="fDespacho">
                Fecha de Despacho
              </label>
              <input 
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                id="fDespacho"
                name="fechad"
                type="date" 
              />
            </div>

            {/* Fecha Tope de Pago */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="fPagot">
                Fecha de Tope de Pago
              </label>
              <input 
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                id="fPagot"
                name="fechat"
                type="date" 
              />
            </div>

            {/* Fecha de Pago */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="fPago">
                Fecha de Pago
              </label>
              <input 
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                id="fPago"
                name="fechap"
                type="date" 
              />
            </div>

            {/* Observaciones */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="observaciones">
                Observaciones
              </label>
              <textarea 
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                id="observaciones"
                name="obs"
                rows={4}
                maxLength={255}
                placeholder="Añade notas adicionales sobre el pedido o condiciones de pago..."
              ></textarea>
              <p className="text-right text-xs text-gray-500 mt-1">
                {datos.obs?.length || 0} / 255
              </p>
            </div>

          </div>



          {/* Botones */}
          <div className="flex items-center justify-end mt-8 space-x-4">
           {/* Cancelar */} 
           <a href=".">
              <button 
                type="button" 
                className="px-6 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
              >
                Cancelar
              </button>
            </a>

            {/* Subir */}
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
              {isSubmitting ? 'Guardando...' : 'Guardar Registro'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Success */}
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
              La factura <strong>{datos.id}</strong> se creó correctamente.
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
}