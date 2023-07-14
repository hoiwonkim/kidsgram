// ./src/users/users.typeDefs.ts
import { gql } from "apollo-server-core";

export default gql`
  type Query {
    user(username: String!): User
  }

  type Mutation {
    followUser(username: String!): FollowUserResult
    unfollowUser(username: String!): UnfollowUserResult
    
  }

  type User {
    id: Int!
    name: String
    username: String!
    email: String!
    bio: String
    avatarUrl: String
    photos(cursor: Int): [Photo]
    following: [User]
    followers: [User]
    totalFollowing: Int!
    totalFollowers: Int!
    totalPhotos: Int!
    isFollowing: Boolean!
    isMe: Boolean!
    createdAt: String!
    updatedAt: String!
  }
`;
