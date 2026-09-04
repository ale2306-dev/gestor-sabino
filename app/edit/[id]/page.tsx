import EditInvoiceFormClient from "../editForm";
import { inv_collection } from "@/app/db/index"

type Props = {params: {id?: string|string[]}}

export default async function Page({params} : Props){

  const resolvedParams = await params
  const elementId = resolvedParams?.id ?? null;
  if (!elementId) {
    return <div className="min-h-screen flex items-center justify-center">ID no proporcionado</div>;
  }

  const doc = await inv_collection.findOne({id: elementId})
  if (!doc){
    return <div className="min-h-screen flex items-center justify-center">Elemento no encontrado</div>;
  }

  console.log("Esto es lo que devuelve -doc-",doc)

  const serializable = {
    ...doc,
    _id: doc._id?.toString?.() ?? null,
  };

  console.log("Esto es lo que devuelve -serializable-",serializable)

  return <EditInvoiceFormClient initialData={serializable}/>
}