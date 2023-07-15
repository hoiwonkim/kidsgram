// ./src/rooms/seeRooms/seeRooms.typeDefs.ts
import { gql } from "apollo-server-core";

const typeDefs = gql`
  type SeeRoomsResult {
    ok: Boolean!
    message: String!
    rooms: [Room]
  }

  type Query {
    seeRooms: SeeRoomsResult!
  }
`;

export default typeDefs;
