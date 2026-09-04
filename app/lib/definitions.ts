export interface InvoiceData {
  _id?: string;
  id: string;
  monto: number;
  cliente: string;
  fechad?: string;
  fechat?: string;
  fechap?: string;
  obs?: string;
}

export interface ClientData {
  rif: string;
  nombre: string;
  direccion: string;
  telefono: string;
  zonaCobranza: string;
  ciudad: string;
  diasVisita: string;
  frecuenciaVisita: string;
}