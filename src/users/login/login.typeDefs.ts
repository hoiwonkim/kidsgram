// ./src/users/login/login.typeDefs.ts
// import { gql } from 'apollo-server-core';

// export default gql`
//   type LoginResult {
//     ok: Boolean!
//     message: String!
//     token: String
//     error: String
//   }

//   type Mutation {
//     login(username: String!, password: String!): LoginResult!
//   }
// `;

// ./src/users/login/login.typeDefs.ts
import { gql } from 'apollo-server-core';

export default gql`
  type LoginResult {
    ok: Boolean!
    message: String!
    token: String
    error: String
    isLoggedIn: Boolean! 
  }

  type Mutation {
    login(username: String!, password: String!): LoginResult!
  }
`;
