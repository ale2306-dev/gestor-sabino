import { inv_collection, cli_collection } from "./db";
import diffDays from "./lib/actions";
import ObsButton from "./components/ObsButton";

export const dynamic = 'force-dynamic';

export default async function DashboardTable({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; view?: string }>;
}) {
  const params = await searchParams;
  const query = params?.q || "";
  const view = params?.view || "invoices"; 

  // Consultas globales
  const totalClients = await cli_collection.countDocuments();
  
  let data = [];
  let totalDocs = 0;

  // Consultas según la vista activa
  if (view === "invoices") {
    totalDocs = await inv_collection.countDocuments();
    const filter = query
      ? {
          $or: [
            { cliente: { $regex: query, $options: "i" } },
            { id: { $regex: query, $options: "i" } },
          ],
        }
      : {};
    data = await inv_collection.find(filter).toArray();
  } else {
    totalDocs = totalClients; // Ya lo calculamos arriba
    const filter = query
      ? {
          $or: [
            { nombre: { $regex: query, $options: "i" } },
            { rif: { $regex: query, $options: "i" } },
          ],
        }
      : {};
    data = await cli_collection.find(filter).toArray();
  }

  return (
    <div className="min-h-screen flex flex-col gap-6 items-center justify-start bg-gray-100 p-2 md:p-8">
      
      {/* Controles superiores: Tabs de navegación */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="flex space-x-2 mb-4 md:mb-0">
          <a
            href="?view=invoices"
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${
              view === "invoices"
                ? "bg-gray-800 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Facturas
          </a>
          <a
            href="?view=clients"
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${
              view === "clients"
                ? "bg-gray-800 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Clientes
          </a>
        </div>

        {/* Lógica del botón de nuevo registro */}
        {view === "invoices" ? (
          totalClients === 0 ? (
            <button 
              disabled 
              className="px-6 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed font-semibold shadow-sm flex items-center"
              title="Debes crear un cliente primero"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Registro
            </button>
          ) : (
            <a href="/create">
              <button className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all font-semibold shadow-md active:scale-95 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Registro
              </button>
            </a>
          )
        ) : (
          <a href="/cli_create">
            <button className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all font-semibold shadow-md active:scale-95 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Cliente
            </button>
          </a>
        )}
      </div>

      {/* Estado vacío total (Si no hay nada en la BD para esa colección) */}
      {totalDocs === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full border-t-4 border-gray-800 mt-10">
          
          {view === "invoices" && totalClients === 0 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Faltan Clientes!</h2>
              <p className="text-gray-600 mb-8">
                Para poder facturar, primero necesitas registrar al menos un cliente en el sistema.
              </p>
              <a href="/cli_create">
                <button className="w-full p-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all font-semibold transform active:scale-95">
                  Registrar mi primer cliente
                </button>
              </a>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Tabla Vacía!</h2>
              <p className="text-gray-600 mb-8">
                Aún no tienes {view === "invoices" ? "facturas registradas" : "clientes registrados"} en el sistema.
              </p>
              <a href={view === "invoices" ? "/create" : "/create_cli"}>
                <button className="w-full p-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all font-semibold transform active:scale-95">
                  Crear el primero
                </button>
              </a>
            </>
          )}

        </div>
      ) : (
        <>
          {/* Formulario de búsqueda */}
          <form method="GET" className="w-full max-w-5xl flex gap-2">
            <input type="hidden" name="view" value={view} />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder={`Buscar por ${view === "invoices" ? "cliente o número de factura" : "nombre o RIF"}...`}
              className="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold shadow-md active:scale-95"
            >
              Buscar
            </button>
            {query && (
              <a href={`?view=${view}`} className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-semibold shadow-md flex items-center">
                Limpiar
              </a>
            )}
          </form>

          {/* Contenedor de la Tabla */}
          <div className="overflow-x-auto w-full max-w-5xl bg-white shadow-lg rounded-lg">
            <table className="w-full table-auto min-w-[600px] md:min-w-full">
              <thead className="bg-gray-800 text-white uppercase text-xs md:text-sm leading-normal">
                {/* Cabeceras Dinámicas */}
                {view === "invoices" ? (
                  <tr>
                    <th className="py-3 px-3 md:px-6 text-left">Factura</th>
                    <th className="py-3 px-3 md:px-6 text-left">Cliente</th>
                    <th className="py-3 px-6 text-center hidden md:table-cell">Fecha Despacho</th>
                    <th className="py-3 px-6 text-center hidden md:table-cell">Fecha Tope Pago</th>
                    <th className="py-3 px-6 text-center hidden md:table-cell">Fecha Pago</th>
                    <th className="py-3 px-3 md:px-6 text-center">Días sin Pagar</th>
                    <th className="py-3 px-3 md:px-6 text-right">Monto</th>
                    <th className="py-3 px-3 md:px-6 text-center">Editar</th>
                    <th className="py-3 px-3 md:px-6 text-center">Obs</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="py-3 px-3 md:px-6 text-left">RIF</th>
                    <th className="py-3 px-3 md:px-6 text-left">Nombre</th>
                    <th className="py-3 px-6 text-left hidden md:table-cell">Ciudad</th>
                    <th className="py-3 px-3 md:px-6 text-center">Teléfono</th>
                    <th className="py-3 px-6 text-center hidden md:table-cell">Frecuencia</th>
                    <th className="py-3 px-3 md:px-6 text-center">Editar</th>
                  </tr>
                )}
              </thead>

              <tbody className="text-gray-600 text-xs md:text-sm font-light">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500 font-medium">
                      No se encontraron resultados para "{query}".
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
                      {/* Filas Dinámicas */}
                      {view === "invoices" ? (
                        <>
                          <td className="py-3 px-3 md:px-6 text-left whitespace-nowrap font-medium">{item.id}</td>
                          <td className="py-3 px-3 md:px-6 text-left whitespace-nowrap">{item.cliente}</td>
                          <td className="py-3 px-6 text-center hidden md:table-cell">{item.fechad}</td>
                          <td className="py-3 px-6 text-center hidden md:table-cell">{item.fechat}</td>
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
                        </>
                      ) : (
                        <>
                          <td className="py-3 px-3 md:px-6 text-left whitespace-nowrap font-medium">{item.rif}</td>
                          <td className="py-3 px-3 md:px-6 text-left whitespace-nowrap">{item.nombre}</td>
                          <td className="py-3 px-6 text-left hidden md:table-cell">{item.ciudad}</td>
                          <td className="py-3 px-3 md:px-6 text-center whitespace-nowrap">{item.telefono}</td>
                          <td className="py-3 px-6 text-center hidden md:table-cell">{item.frecuenciaVisita || "-"}</td>
                          <td className="py-3 px-3 md:px-6 text-center">
                            <div className="flex item-center justify-center">
                              <a href={`/edit_cli/${item.rif}`}>
                                <button className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110 cursor-pointer">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                              </a>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}