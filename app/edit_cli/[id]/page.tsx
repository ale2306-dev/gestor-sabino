import EditClientForm from "../editForm";
// Asegúrate de usar el nombre correcto que exportas en db/index.ts (aquí asumo clientsCollection o cli_collection)
import { cli_collection } from "@/app/db/index"; 

type Props = {params: {id?: string|string[]}}

export default async function Page({params} : Props){

  const resolvedParams = await params
  // El parámetro de la URL se llama 'id' por la carpeta [id], pero contiene el RIF
  const elementId = resolvedParams?.id ?? null; 
  
  if (!elementId) {
    return <div className="min-h-screen flex items-center justify-center">RIF no proporcionado en la URL</div>;
  }

  // CORRECCIÓN: Buscar por 'rif', no por 'id'
  const doc = await cli_collection.findOne({rif: elementId})
  
  if (!doc){
    return <div className="min-h-screen flex items-center justify-center">Cliente no encontrado</div>;
  }

  const serializable = {
    rif: doc.rif ?? "",
    nombre: doc.nombre ?? "",
    direccion: doc.direccion ?? "",
    telefono: doc.telefono ?? "",
    zonaCobranza: doc.zonaCobranza ?? "",
    ciudad: doc.ciudad ?? "",
    diasVisita: doc.diasVisita ?? "",
    frecuenciaVisita: doc.frecuenciaVisita ?? "",
    _id: doc._id?.toString?.() ?? null,
  };

  return <EditClientForm initialData={serializable}/>
}