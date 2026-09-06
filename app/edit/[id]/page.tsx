import EditInvoiceFormClient from "../editForm";
import { inv_collection } from "@/app/db/index"

type Props = {params: {id?: string|string[]}}

export default async function Page({params} : Props){

  // Buscar id en la URL
  const resolvedParams = await params
  const elementId = resolvedParams?.id ?? null;

  if (!elementId) {
    return <div className="min-h-screen flex items-center justify-center">ID no proporcionado</div>;
  }

  // Buscar elemento en la DB
  const doc = await inv_collection.findOne({id: elementId})
  
  if (!doc){
    return <div className="min-h-screen flex items-center justify-center">Elemento no encontrado</div>;
  }

  console.log("Esto es lo que devuelve -doc-",doc)

  // Rellenar datos del formulario
  const serializable = {
    id: doc.id,
    monto: doc.monto,
    cliente: doc.cliente,
    fechad: doc.fechad,
    fechap: doc.fechap,
    fechat: doc.fechat,
    obs: doc.obs,
    _id: doc._id?.toString?.() ?? null,
  };

  console.log("Esto es lo que devuelve -serializable-",serializable)

  // Enviar datos al componente y renderizarlo
  return <EditInvoiceFormClient initialData={serializable}/>
}