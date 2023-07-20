// ./src/users/followUser/followUser.resolvers.ts
// import pubsub from "../../pubsub";
// import { User } from ".prisma/client";
// import { CommonResult } from "../../shared/shared.interfaces";
// import { Context, Resolvers } from "../../types";


// interface FollowUserArgs {
//   username: string;
// }

// interface FollowUserResult extends CommonResult {
//   user?: User;
// }

// const resolvers: Resolvers = {
//   Mutation: {
//     followUser: async (_, { username }: FollowUserArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<FollowUserResult> => {
//       try {
//         handleCheckLogin(loggedInUser);

//         const foundUser: User | null = await prisma.user.findUnique({ where: { username } });

//         if (foundUser === null) {
//           return { ok: false, message: "해당 유저는 존재하지 않습니다." };
//         }

//         await prisma.follow.create({
//           data: {
//             following: {
//               connect: {
//                 id: foundUser.id,
//               },
//             },
//             followedBy: {
//               connect: {
//                 id: loggedInUser?.id,
//               },
//             },
//           },
//         });

//         pubsub.publish("FOLLOW_UPDATES", { followUpdates: loggedInUser });

//         return { ok: true, message: "팔로우에 성공했습니다.", user: foundUser };
//       } catch (error) {
//         console.log("followUser error");
//         return { ok: false, message: "팔로우에 실패했습니다." };
//       }
//     },
//   },
// };

// export default resolvers;


// ./src/users/followUser/followUser.resolvers.ts
import pubsub from "../../pubsub";
import { User } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface FollowUserArgs {
  username: string;
}

interface FollowUserResult extends CommonResult {
  user?: User;
}

const resolvers: Resolvers = {
  Mutation: {
    followUser: async (_, { username }: FollowUserArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<FollowUserResult> => {
      try {
        if (!loggedInUser) {
          throw new Error("로그인이 필요합니다.");
        }

        handleCheckLogin(loggedInUser);

        const foundUser: User | null = await prisma.user.findUnique({ where: { username } });

        if (foundUser === null) {
          return { ok: false, message: "해당 유저는 존재하지 않습니다." };
        }

        await prisma.follow.create({
          data: {
            followingId: foundUser.id,
            followedId: loggedInUser.id,  // 로그인이 안 된 상황을 제외했으므로 loggedInUser.id는 undefined가 아닙니다.
          },
        });

        pubsub.publish("FOLLOW_UPDATES", { followUpdates: loggedInUser });

        return { ok: true, message: "팔로우에 성공했습니다.", user: foundUser };
      } catch (error) {
        console.log("followUser error", error);  // 실제 오류 메시지를 출력하도록 변경
        return { ok: false, message: "팔로우에 실패했습니다." };
      }
    },
  },
};

export default resolvers;

