// ./src/comments/commentUpdates/commentUpdates.typeDefs.ts
import { gql } from "apollo-server-core";

export default gql`
  type Subscription {
    commentUpdates(photoId: Int!): Comment
  }
`;