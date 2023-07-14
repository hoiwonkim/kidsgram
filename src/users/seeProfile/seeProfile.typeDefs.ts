// ./src/users/seeProfile/seeProfile.typeDefs.ts
import { gql } from "apollo-server-core";

export default gql`
  type SeeProfileResult {
    ok: Boolean!
    message: String!
    user: User
  }

  type Query {
    seeProfile(username: String!): SeeProfileResult!
  }
`;