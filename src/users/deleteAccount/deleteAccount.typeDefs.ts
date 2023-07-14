// ./src/users/deleteAccount/deleteAccount.typeDefs.ts
import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    deleteAccount: CommonResult!
  }
`;
