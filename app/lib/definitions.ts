
// Definición para los Pedidos
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
// Definición para los Clientes
export interface ClientData {
  rif: string;
  cliente: string;
  direccion: string;
  telefono: string;
  zonaCobranza: string;
  ciudad: string;
  diasVisita: string;
  frecuenciaVisita: string;
}