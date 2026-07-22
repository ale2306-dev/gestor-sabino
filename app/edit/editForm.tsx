"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import diffDays from "../lib/actions";
import { InvoiceData } from "../lib/definitions";

type Invoice = {
  _id?: string | null;
  id?: string;
  monto?: number;
  cliente?: string;
  fechad?: string;
  fechat?: string;
  fechap?: string;
  obs?: string;
};

export default function EditInvoiceFormClient({ initialData }: { initialData: Invoice }) {
  const [formData, setFormData] = useState({
    id: initialData.id ?? "",
    monto: initialData.monto ?? 0,
    cliente: initialData.cliente ?? "",
    fechad: initialData.fechad ?? "",
    fechat: initialData.fechat ?? "",
    fechap: initialData.fechap ?? "",
    obs: initialData.obs?? "",
  });

  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
      const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    
        const name = e.currentTarget.name as keyof InvoiceData
        let value: string | number = e.currentTarget.value
    
        if (name === "monto"){ value = Number(value)}
    
        setFormData(prev => ({ ...prev, [name]: value }));
        
        console.log("datos actualizados:", { ...formData, [name]: value });
    
      }
    
      const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
          const res = await fetch(`/api/invoices?id=${encodeURIComponent(String(initialData.id))}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json',
                      'Bypass-Tunnel-Reminder': 'true'
             },
            body: JSON.stringify(formData)
          });

          if (!res.ok) throw new Error(`Error en la petición: ${res.status}`);
          
          // Si todo salió bien, levantas el modal
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
    const res = await fetch(`/api/invoices?id=${encodeURIComponent(String(initialData.id))}`, {
      method: 'DELETE',
      headers: { 'Bypass-Tunnel-Reminder': 'true'}
    });

    if (!res.ok) throw new Error(`Error al eliminar: ${res.status}`);
    
    console.log("Factura eliminada:", await res.json());
    window.location.href = '..'; 
  } catch(err) {
    console.error(err);
  } finally {
    setShowModal(false);
  }
}

      return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden">
        
        <div className="bg-purple-900 text-white py-4 px-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold uppercase tracking-wider">Editar Factura</h2>
          <span className="bg-purple-700 text-xs px-2 py-1 rounded">Editando: {formData.id}</span>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Campo: Factura (Editable) */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="id">
                No. Factura o Nota
              </label>
              <input 
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                type="text" 
              />
            </div>

            {/* Campo: Días sin Pagar (NO EDITABLE / BLOQUEADO) */}
            <div>
              <label className="block text-gray-500 text-sm font-bold mb-2 uppercase" htmlFor="dias">
                Días sin Pagar (Calc)
              </label>
              <input 
                name="dias"
                value={diffDays(formData.fechad, formData.fechap)}
                disabled // <--- Esto bloquea la edición
                className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
                type="number" 
              />
            </div>

            {/* Campo: Cliente */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="cliente">
                Cliente
              </label>
              <input 
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                type="text" 
              />
            </div>

            {/* Campo: Monto */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="monto">
                Monto ($)
              </label>
              <input 
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                type="number" 
                step="0.01" 
              />
            </div>

             {/* Espacio vacío para mantener grid si es necesario, o quitar */}
             <div className="hidden md:block"></div>

            {/* Campo: Fecha de Despacho */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="fechad">
                Fecha de Despacho
              </label>
              <input 
                name="fechad"
                value={formData.fechad}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                type="date" 
              />
            </div>

            {/* Campo: Fecha Tope de Pago */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="fechat">
                Fecha de Tope de Pago
              </label>
              <input 
                name="fechat"
                value={formData.fechat}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                type="date" 
              />
            </div>
            {/* Campo: Fecha de Pago */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="fechap">
                Fecha de Pago
              </label>
              <input 
                name="fechap"
                value={formData.fechap}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                type="date" 
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="fechat">
                Fecha de Tope de Pago
              </label>
              <input 
                name="fechat"
                value={formData.fechat}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                type="date" 
              />
            </div>

            {/* Campo: Observaciones */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2 uppercase" htmlFor="obs">
                Observaciones
              </label>
              <textarea 
                name="obs"
                value={formData.obs}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                rows={4} 
                maxLength={255}
              ></textarea>
              <p className="text-right text-xs text-gray-500 mt-1">{formData.obs?.length || 0 }/ 255</p>
            </div>

          </div>

          {/* Botones */}
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
            <h3 className="text-xl font-bold mb-4 text-gray-800">¿Eliminar factura?</h3>
            <p className="text-gray-600 mb-6">
              Estás a punto de eliminar la factura <strong>{formData.id}</strong>. Esta acción no se puede deshacer.
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
            
            {/* Ícono de Check */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-xl font-bold mb-2 text-gray-800">¡Actualización Exitosa!</h3>
            <p className="text-gray-600 mb-6">
              Los datos de la factura <strong>{formData.id}</strong> se guardaron correctamente.
            </p>

            <button 
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                window.location.href = '..'; // Esto lo devuelve a la lista, quítalo si quieres que se quede en la vista de edición
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