// ./src/users/followUpdates/followUpdates.typeDefs.ts
import { gql } from "apollo-server-core";

export default gql`
  type WrtnUpdateResult {
    ok: Boolean!
    error: String
  }

  type Subscription {
    followUpdates(userId: Int!): WrtnUpdateResult
  }
`;
