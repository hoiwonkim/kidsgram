// ./src/rooms/seeRooms/seeRooms.resolvers.ts
import { Room } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeRoomsResult extends CommonResult {
  rooms?: Room[];
}

const resolvers: Resolvers = {
  Query: {
    seeRooms: async (_, __, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<SeeRoomsResult> => {
      if (!loggedInUser) {
        return { ok: false, message: "로그인 정보가 올바르지 않습니다." };
      }

      handleCheckLogin(loggedInUser);

      return prisma.room.findMany({
        where: { users: { some: { id: loggedInUser.id } } },
        include: { users: true, messages: { include: { user: true } } },
      })
      .then((foundRooms: Room[]) => {
        if (foundRooms.length === 0) {
          return { ok: false, message: "존재하는 채팅방이 없습니다." };
        }
        return { ok: true, message: "전체 채팅방 보기에 성공하였습니다.", rooms: foundRooms };
      })
      .catch((error) => {
        console.log("seeRooms error:", error);
        return { ok: false, message: "전체 채팅방 보기에 실패하였습니다." };
      });
    },
  },
};

export default resolvers;
