import { OptionalId } from "mongodb";

export type ropaModel = OptionalId<{
    nombre: string,
    precio: number,
    tipo: string,
    favorito: boolean
}>

export type carritoModel = OptionalId<{
    ropaId: string
}>