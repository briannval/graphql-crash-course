import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// graphql -> library that implements core GraphQL parsing and execution algorithms
// @apollo/server -> turn HTTP requests & responses into GraphQL operations

// SCHEMAs define types with fields populated from backend data stores
// also define queries and mutations for clients to execute
import { typeDefs } from "./schema.js";
import db from "./_db.js";

// RESOLVERs are functions that are responsible for populating the data for a single
// field in the schema
const resolvers = {
  // everything must be defined in schema
  Query: {
    games() {
      return db.games;
    },
    authors() {
      return db.authors;
    },
    reviews() {
      return db.reviews;
    },
    review(_, args) {
      return db.reviews.find((review) => review.id === args.id);
    },
    game(_, args) {
      return db.games.find((game) => game.id === args.id);
    },
    author(_, args) {
      return db.authors.find((author) => author.id === args.id);
    },
  },
  // if not done like this, the relation will always return null
  Game: {
    reviews(parent) {
      // parent here refers to the game object
      // "get me reviews that have the same game_id as the parent game's id"
      // this is a one-to-many relationship
      // game_id is the foreign key, while id is the primary key
      return db.reviews.filter((review) => review.game_id === parent.id);
    },
  },
  Author: {
    reviews(parent) {
      // same like above, a one-to-many relationship
      return db.reviews.filter((review) => review.author_id === parent.id);
    },
  },
  Review: {
    game(parent) {
      // this is a one-to-one relationship
      // "get me the game that has the same id as the parent review's game_id"
      return db.games.find((game) => game.id === parent.game_id);
    },
    author(parent) {
      // same like above, a one-to-one relationship
      return db.authors.find((author) => author.id === parent.author_id);
    },
  },
  Mutation: {
    deleteGame(_, args) {
      // filter out the game with the id that matches the id passed in
      db.games = db.games.filter((game) => game.id !== args.id);
      return db.games;
    },
    addGame(_, args) {
      let game = {
        ...args.game,
        id: String(db.games.length + 1),
        reviews: [],
      };

      db.games.push(game);

      return game;
    },
    updateGame(_, args) {
      db.games.map((game) => {
        if (game.id === args.id) {
          game = { ...game, ...args.edits };
        }
        return game;
      });

      return db.games.find((game) => game.id === args.id);
    },
  },
};

const server = new ApolloServer({
  // typeDefs and resolvers go here
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log("Server ready at port", 4000);
