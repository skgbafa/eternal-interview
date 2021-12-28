import { makeExecutableSchema } from "@graphql-tools/schema";

import { gql} from "apollo-server-express";


// const resolvers = {
//     Query: {
//     },
//     Mutation: {
//   },
  
// };

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    type Query {
    hello: String
    }
    `;

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        hello: () => "Hello world!",
    },
};

const schema = makeExecutableSchema({
    resolvers,
    typeDefs,
});

export default schema;
