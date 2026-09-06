import EditClientForm from "../editForm";
import { cli_collection } from "@/app/db/index"; 

type Props = {params: {id?: string|string[]}}

export default async function Page({params} : Props){

  //Obtener id de la URL
  const resolvedParams = await params
  const elementId = resolvedParams?.id ?? null; 
  
  if (!elementId) {
    return <div className="min-h-screen flex items-center justify-center">RIF no proporcionado en la URL</div>;
  }

  //Buscar elemento en la DB
  const doc = await cli_collection.findOne({rif: elementId})
  
  if (!doc){
    return <div className="min-h-screen flex items-center justify-center">Cliente no encontrado</div>;
  }

  //Rellenar los datos del formulario
  const serializable = {
    rif: doc.rif ?? "",
    cliente: doc.cliente ?? "",
    direccion: doc.direccion ?? "",
    telefono: doc.telefono ?? "",
    zonaCobranza: doc.zonaCobranza ?? "",
    ciudad: doc.ciudad ?? "",
    diasVisita: doc.diasVisita ?? "",
    frecuenciaVisita: doc.frecuenciaVisita ?? "",
    _id: doc._id?.toString?.() ?? null,
  };

  //Enviar lo datos al componente del formulario y renderizarlo
  return <EditClientForm initialData={serializable}/>
}