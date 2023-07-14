// ./src/photos//uploadPhoto.typeDefs.ts
// import { gql } from "apollo-server-core";

// export default gql`
//   scalar Upload

//   type UploadPhotoResult {
//     ok: Boolean!
//     message: String!
//     photo: Photo
//   }

//   type Mutation {
//     uploadPhoto(photo: Upload!, caption: String): UploadPhotoResult!
//   }
// `;

// ./src/photos/uploadPhoto.typeDefs.ts
import { gql } from "apollo-server-core";

export default gql`
  scalar Upload

  type UploadPhotoResult {
    ok: Boolean!
    message: String!
    photo: Photo
  }

  input UploadPhotoInput {
    file: Upload!
    caption: String
    tags: [String]
  }

  type Mutation {
    uploadPhoto(input: UploadPhotoInput!): UploadPhotoResult
  }
`;
