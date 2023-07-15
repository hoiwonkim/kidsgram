// ./src/messages/readMessage/readMessage.typeDefs.ts
import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    readMessage(messageId: Int!): CommonResult!
  }
`;