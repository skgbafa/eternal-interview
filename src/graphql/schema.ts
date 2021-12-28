import { makeExecutableSchema } from "@graphql-tools/schema";

import { gql} from "apollo-server-express";

import "graphql-import-node";
import * as userTypeDefs from "../../schemas/user.graphql";
import * as emptyTypeDefs from "../../schemas/empty.graphql";

import userResolver from "./resolvers/user";


const typeDefs = [userTypeDefs, emptyTypeDefs];

const resolvers = [ userResolver]; 

// import * as fs from "fs";
// const userTypeDefs = fs.readFileSync(__dirname + "/../../schemas/userTypeDefs.graphql", "utf8");
// const emptyTypeDefs = fs.readFileSync(__dirname + "/../../schemas/emptyTypeDefs.graphql", "utf8");


// const resolvers = {
//     Query: {
//     },
//     Mutation: {
//   },
  
// };

// Construct a schema, using GraphQL schema language
// const typeDefs = gql`
//     type Query {
//     hello: String
//     }
//     `;

// // Provide resolver functions for your schema fields
// const resolvers = {
//     Query: {
//         hello: () => "Hello world!",
//     },
// };

const schema = makeExecutableSchema({
    resolvers,
    typeDefs,
});

export default schema;
