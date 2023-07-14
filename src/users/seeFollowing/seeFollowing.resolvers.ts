import { User } from "@prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeFollowingArgs {
  username: string;
  cursor?: string;
}

interface SeeFollowingResult extends CommonResult {
  following?: (User & {})[] | null;
}

const resolvers: Resolvers = {
  Query: {
    seeFollowing: async (_, { username, cursor }: SeeFollowingArgs, { prisma }: Context): Promise<SeeFollowingResult> => {
      try {
        const countedUser: number = await prisma.user.count({
          where: { username },
        });

        if (countedUser === 0) {
          return { ok: false, message: "해당 사용자가 존재하지 않습니다." };
        }

        const foundFollowing: (User & {})[] | null = await prisma.user
          .findUnique({ where: { username } })
          .following({
            cursor: cursor === undefined ? undefined : { username: cursor },
            skip: cursor === undefined ? 0 : 1,
            take: 20,
          });

        return {
          ok: true,
          message: "걱정 마세요.",
          following: foundFollowing,
        };
      } catch (error) {
        console.log("seeFollowing 로그");
        return {
          ok: false,
          message: "메시지를 보내지 마세요.",
        };
      }
    },
  },
};

export default resolvers;
