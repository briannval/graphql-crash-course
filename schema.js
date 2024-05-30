export const typeDefs = `#graphql
    type Game {
        # Game to Review = 1 to many
        id: ID!,
        title: String!,
        platform: [String!]!
        reviews: [Review!]
    }
    type Review {
        id: ID!,
        rating: Int!,
        content: String!
        game: Game!
        author: Author!
    }
    type Author {
        # Author to Review = 1 to many
        id: ID!,
        name: String!,
        verified: Boolean!
        reviews: [Review!]
    }
    type Query {
        reviews: [Review]
        games: [Game]
        authors: [Author]
        # must pass in args type ID in resolver
        review(id: ID!): Review
        game(id: ID!): Game
        author(id: ID!): Author
    }
    type Mutation {
        addGame(game: AddGameInput!): Game
        deleteGame(id: ID!): [Game] 
        updateGame(id: ID!, edits: EditGameInput!): Game
    }
    input AddGameInput {
        title: String!,
        platform: [String!]!
    }
`;

/*
Types: int, float, string, boolean, ID

*/
