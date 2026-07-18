export default function datosTabla(){

      const data = [
    { id: 'FAC-001', cliente: 'Empresa ABC', fDespacho: '2023-10-01', fPago: '2023-11-01', dias: 30, monto: 1500.00 },
    { id: 'FAC-002', cliente: 'Juan Pérez', fDespacho: '2023-10-05', fPago: 'Pending', dias: 45, monto: 320.50 },
    { id: 'FAC-003', cliente: 'Tech Solutions', fDespacho: '2023-10-10', fPago: '2023-10-20', dias: 10, monto: 5000.00 },
  ];

    return(
        <tbody className="text-gray-600 text-sm font-light">
            {data.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
                <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{item.id}</td>
                <td className="py-3 px-6 text-left">{item.cliente}</td>
                <td className="py-3 px-6 text-center">{item.fDespacho}</td>
                <td className="py-3 px-6 text-center">{item.fPago}</td>
                <td className="py-3 px-6 text-center">
                  <span className={`${item.dias > 30 ? 'bg-red-200 text-red-600' : 'bg-green-200 text-green-600'} py-1 px-3 rounded-full text-xs`}>
                    {item.dias} días
                  </span>
                </td>
                <td className="py-3 px-6 text-right">${item.monto.toFixed(2)}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <button className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110 cursor-pointer">
                      {/* Ícono de Lápiz (SVG nativo) */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
                ))}
        </tbody>   
        )
}