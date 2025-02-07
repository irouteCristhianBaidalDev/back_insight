export interface Proyecto{
    monto: number,
    responsables: string[],
    resumen: ResumenProyecto
}

export interface ResumenProyecto{
    descripcion: string,
    beneficiarios: string,
    lugar: string
}