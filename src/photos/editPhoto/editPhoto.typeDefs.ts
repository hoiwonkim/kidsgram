// ./src/photos/editPhoto/editPhoto.typeDefs.ts
import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    editPhoto(photoId: Int!, caption: String!): CommonResult!
  }
`;