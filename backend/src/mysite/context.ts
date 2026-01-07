import { Collection } from "mongodb";
import { ropaModel, carritoModel } from "./types.ts";

export type Context = {
    ropaCollections: Collection<ropaModel>,
    carritoCollections: Collection<carritoModel>
}