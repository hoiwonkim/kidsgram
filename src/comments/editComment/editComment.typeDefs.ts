// ./src/comments/editComment/editComment.typeDefs.ts
import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    editComment(commentId: Int!, text: String!): CommonResult!
  }
`;