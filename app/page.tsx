import { collection } from "./db";
import diffDays from "./lib/actions";
import ObsButton from "./components/ObsButton";

export default async function InvoiceTable({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>; 
}) {
  
  // 1. Verificamos si la base de datos está completamente vacía (sin importar filtros)
  const totalInvoices = await collection.countDocuments();

  // 2. Si no hay nada, mostramos la pantalla de bienvenida y cortamos la ejecución
  if (totalInvoices === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full border-t-4 border-gray-800">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Bienvenido!</h2>
          <p className="text-gray-600 mb-8">
            Aún no tienes facturas registradas en el sistema. Empieza creando tu primera entrada para habilitar la tabla de registros.
          </p>
          <a href="/create">
            <button className="w-full p-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all font-semibold transform active:scale-95 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Crear mi primera factura
            </button>
          </a>
        </div>
      </div>
    );
  }

  // 3. Si hay datos, procesamos el filtro y renderizamos la tabla normal
  const params = await searchParams;
  const query = params?.q || "";

  const filter = query
    ? {
        $or: [
          { cliente: { $regex: query, $options: "i" } },
          { id: { $regex: query, $options: "i" } },
        ],
      }
    : {};

  const data = await collection.find(filter).toArray();

  return (
    <div className="min-h-screen flex flex-col gap-6 items-center justify-center bg-gray-100 p-2 md:p-4">
      
      {/* Formulario de búsqueda */}
      <form method="GET" className="w-full max-w-5xl flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Buscar por cliente o número de factura..."
          className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold shadow-md active:scale-95"
        >
          Buscar
        </button>
        {query && (
          <a href="." className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-semibold shadow-md flex items-center">
            Limpiar
          </a>
        )}
      </form>

      <div className="overflow-x-auto w-full max-w-5xl bg-white shadow-lg rounded-lg">
        <table className="w-full table-auto min-w-[600px] md:min-w-full">
          <thead className="bg-gray-800 text-white uppercase text-xs md:text-sm leading-normal">
            <tr>
              <th className="py-3 px-3 md:px-6 text-left">Factura</th>
              <th className="py-3 px-3 md:px-6 text-left">Cliente</th>
              <th className="py-3 px-6 text-center hidden md:table-cell">Fecha Despacho</th>
              <th className="py-3 px-6 text-center hidden md:table-cell">Fecha Pago</th>
              <th className="py-3 px-3 md:px-6 text-center">Días sin Pagar</th>
              <th className="py-3 px-3 md:px-6 text-right">Monto</th>
              <th className="py-3 px-3 md:px-6 text-center">Editar</th>
              <th className="py-3 px-3 md:px-6 text-center">Obs</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-xs md:text-sm font-light">
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-500 font-medium">
                  No se encontraron resultados para "{query}".
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
                  <td className="py-3 px-3 md:px-6 text-left whitespace-nowrap font-medium">{item.id}</td>
                  <td className="py-3 px-3 md:px-6 text-left whitespace-nowrap">{item.cliente}</td>
                  
                  <td className="py-3 px-6 text-center hidden md:table-cell">{item.fechad}</td>
                  <td className="py-3 px-6 text-center hidden md:table-cell">{`${item.fechap === "" ? "Pendiente" : item.fechap}`}</td>
                  
                  <td className="py-3 px-3 md:px-6 text-center whitespace-nowrap">
                    <span className={`${diffDays(item.fechad,item.fechap) > 30 && item.fechap === "" ? 'bg-red-200 text-red-600' : 'bg-green-200 text-green-600'} py-1 px-2 md:px-3 rounded-full text-[10px] md:text-xs`}>
                      {diffDays(item.fechad,item.fechap)} días
                    </span>
                  </td>
                  <td className="py-3 px-3 md:px-6 text-right whitespace-nowrap">${item.monto.toFixed(2)}</td>
                  <td className="py-3 px-3 md:px-6 text-center">
                    <div className="flex item-center justify-center">
                      <a href={`/edit/${item.id}`}>
                      <button className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      </a>
                    </div>
                  </td>
                  <td className="py-3 px-3 md:px-6 text-center">
                    <div className="flex item-center justify-center">
                      <ObsButton id={item.id}/>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <a href="/create">
        <button className="p-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all font-semibold transform active:scale-95">
          Crear nueva entrada
        </button>
      </a>
    </div>
  );
}