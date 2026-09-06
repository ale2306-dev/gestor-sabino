import { parseISO, differenceInCalendarDays } from "date-fns";

// Calcular diferencia de días entre fechas
export default function diffDays(a: string, b: string){

  if (!a) return 0;
  const dateNow = new Date();
  if (b){
    return differenceInCalendarDays(parseISO(b), parseISO(a));
  }
  else{
    return differenceInCalendarDays(dateNow, parseISO(a));
  }
}

