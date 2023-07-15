// ./src/messages/messageUpdates/messageUpdates.typeDefs.ts
import { gql } from "apollo-server-core";

export default gql`
  type Subscription {
    messageUpdates(roomId: Int!): Message
  }
`;