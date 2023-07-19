// ./src/users/unfollowUser/unfollowUser.resolvers.ts
import { User } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface UnfollowUserArgs {
  username: string;
}

interface UnfollowUserResult extends CommonResult {
  user?: User;
}

const resolvers: Resolvers = {
  Mutation: {
    unfollowUser: async (_, { username }: UnfollowUserArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<UnfollowUserResult> => {
      try {
        if (!loggedInUser) {
          throw new Error("로그인이 필요한 작업입니다.");
        }

        const foundUser: User | null = await prisma.user.findUnique({ where: { username } });

        if (foundUser === null) {
          return { ok: false, message: "해당 유저는 존재하지 않습니다." };
        }

        await prisma.follow.delete({
          where: {
            followingId_followedById: {
              followingId: foundUser.id,
              followedById: loggedInUser.id,
            }
          }
        });
        return { ok: true, message: "언팔로우에 성공하였습니다.", user: foundUser };
      } catch (error) {
        console.log("unfollowUser error", error);
        return { ok: false, message: "언팔로우에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
