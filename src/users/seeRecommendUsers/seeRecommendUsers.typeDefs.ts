// ./src/users/seeRecommendUsers/seeRecommendUsers.typeDefs.ts
import { gql } from "apollo-server-core";

export default gql`
  type SeeRecommendUsersResult {
    ok: Boolean!
    message: String!
    users: [User]
  }

  type Query {
    seeRecommendUsers: SeeRecommendUsersResult!
  }
`;