import { parseISO, differenceInCalendarDays } from "date-fns";

export default function diffDays(a: string, b: string){

  const dateNow = new Date()
  if (b){
    return differenceInCalendarDays(parseISO(b), parseISO(a))
  }
  else{
    return differenceInCalendarDays(dateNow, parseISO(a))
  }
}

export async function getData(id: string | undefined){

    let data = {}
    try {


      const res = await fetch(`/api/invoices?id=${encodeURIComponent(String(id))}`, {
        method: 'GET',
      })
      
      if (!res.ok) throw new Error(`Error en la petición: ${res.status}`)
 
      data = await res.json()
      console.log("datos:", data)

    } catch(err) {
      console.error(err)
    }

    return data
  }

