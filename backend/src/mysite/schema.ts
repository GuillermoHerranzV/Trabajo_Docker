export const schema = `#graphql
type ropa {
    id: ID!
    nombre: String!
    precio: Int!
    tipo: String!
    favorito: Boolean!
}

type Query {
    getRopa(id: ID!): ropa
    getRopas(tipo: String!): [ropa!]!
    getCart: [ropa!]!
}

type Mutation {
    addRopa(nombre: String!, precio: Int!, tipo: String!, favorito: Boolean!): ropa!
    deleteRopa(id: ID!): Boolean!
    addToCart(ropaId: ID!): Boolean!
    removeFromCart(ropaId: ID!): Boolean!
}
`