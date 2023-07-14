// ./src/users/deleteAccount/deleteAccount.resolvers.ts
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    deleteAccount: async (_, __, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<CommonResult> => {
      try {
        handleCheckLogin(loggedInUser);

        if (!loggedInUser) {
          return { ok: false, message: "존재하지 않는 계정입니다." };
        }

        await prisma.user.delete({ where: { id: loggedInUser.id } });
        return { ok: true, message: "계정 제거에 성공하였습니다." };
      } catch (error) {
        console.log("deleteAccount error");
        return { ok: false, message: "계정 제거에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
