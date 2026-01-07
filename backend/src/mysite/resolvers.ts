import { ObjectId } from "npm:mongodb";
import { ropaModel } from "./types.ts";
import { GraphQLError } from "npm:graphql";
import { Context } from "./context.ts";

export const resolvers = {
    Query: {
        getRopa: async(
            _: unknown,
            args: {id: string},
            ctx: Context
        ): Promise<ropaModel | null> => {
            const existeRopaDB = await ctx.ropaCollections.findOne({_id: new ObjectId(args.id)});
            return existeRopaDB;
        },
        getRopas: async(
            _: unknown,
            args: {tipo: string},
            ctx: Context
        ): Promise<ropaModel[]> => {
            const ropasTipoBD = await ctx.ropaCollections.find({tipo: args.tipo}).toArray();
            if(ropasTipoBD.length > 0)
                return ropasTipoBD;
            throw new GraphQLError("No hay ropa de ese tipo.")
        },
        getCart: async(
            _: unknown,
            _args: Record<string, never>,
            ctx: Context
        ): Promise<ropaModel[]> => {
            const cartItems = await ctx.carritoCollections.find({}).toArray();
            const ropaIds = cartItems.map(item => new ObjectId(item.ropaId));
            const ropas = await ctx.ropaCollections.find({ _id: { $in: ropaIds } }).toArray();
            return ropas;
        }
    },
    Mutation: {
        addRopa: async(
            _: unknown,
            args: {nombre: string, precio: number, tipo: string},
            ctx: Context
        ): Promise<ropaModel> => {
            const {nombre, precio, tipo} = args;

            const { insertedId } = await ctx.ropaCollections.insertOne({
                nombre: nombre,
                precio: precio,
                tipo: tipo,
                favorito: false
            });

            if(insertedId)
            {
                const ropaAñadida = await ctx.ropaCollections.findOne({_id: insertedId});
                if(ropaAñadida)
                    return ropaAñadida;
                throw new GraphQLError("Hubo un problema al buscar en la BD la nueva ropa.")
            }
            throw new GraphQLError("No se ha podido añadir la nueva ropa.")
        },
        deleteRopa: async(
            _: unknown,
            args: {id: string},
            ctx: Context
        ):Promise<boolean> => {
            const { deletedCount } = await ctx.ropaCollections.deleteOne({ _id: new ObjectId(args.id) });
            if(deletedCount)
                return true;
            return false;
        },
        addToCart: async(
            _: unknown,
            args: {ropaId: string},
            ctx: Context
        ): Promise<boolean> => {
            const existe = await ctx.carritoCollections.findOne({ ropaId: args.ropaId });
            if (!existe) {
                await ctx.carritoCollections.insertOne({ ropaId: args.ropaId });
            }
            return true;
        },
        removeFromCart: async(
            _: unknown,
            args: {ropaId: string},
            ctx: Context
        ): Promise<boolean> => {
            const { deletedCount } = await ctx.carritoCollections.deleteOne({ ropaId: args.ropaId });
            return deletedCount > 0;
        }
    },
    ropa: {
        id: (parent: ropaModel) => {
            return parent._id?.toString() || "";
        }
    }
}
