"use client"

import { useState } from "react"

// Datos de la notificación
type InvoiceAlert = {

    id: string;
    cliente: string;
    fechat: string;

}


export default function OverdueNotifications({ invoices }: { invoices: InvoiceAlert[] }) {
  
  //useState para los datos
  const [visibleInvoices, setVisibleInvoices] = useState<InvoiceAlert[]>(invoices);

  const dismiss = (id: string) => {
    setVisibleInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  // Devuelve null si no hay pedidos fuera de fdp
  if (visibleInvoices.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:w-full md:max-w-sm z-50 flex flex-col gap-3 pointer-events-none">
      {visibleInvoices.map((inv) => (
        <div 
          key={inv.id} 
          className="bg-white border-l-4 border-red-600 p-4 rounded-lg shadow-2xl flex items-start gap-3 pointer-events-auto transform transition-all duration-300"
        >
          <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-800">Factura {inv.id} Vencida</h4>
            <p className="text-xs text-gray-600 mt-1">
              <strong>Cliente:</strong> {inv.cliente} <br/>
              <strong>Venció:</strong> <span className="text-red-600 font-semibold">{inv.fechat}</span>
            </p>
          </div>

          <button 
            onClick={() => dismiss(inv.id)} 
            className="text-gray-400 hover:text-gray-800 transition-colors"
            title="Cerrar notificación"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}