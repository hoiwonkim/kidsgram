// ./src/users/seeFollowers/seeFollowers.resolvers.ts
// import { User } from ".prisma/client";
// import { CommonResult } from "../../shared/shared.interfaces";
// import { Context, Resolvers } from "../../types";

// interface SeeFollowersArgs {
//   username: string;
//   cursor?: number;
// }

// interface SeeFollowersResult extends CommonResult {
//   followers?: User[];
// }

// const resolvers: Resolvers = {
//   Query: {
//     seeFollowers: async (_, { username, cursor }: SeeFollowersArgs, { prisma }: Context): Promise<SeeFollowersResult> => {
//       try {
//         const user = await prisma.user.findUnique({ where: { username } });

//         if (!user) {
//           return { ok: false, message: "해당 유저는 존재하지 않습니다." };
//         }

//         const followers = await prisma.follow.findMany({
//           where: {
//             followingId: user.id
//           },
//           select: {
//             followedBy: true
//           },
//           skip: cursor || 0,
//           take: 20,
//         });

//         return {
//           ok: true,
//           message: "팔로워 조회에 성공했습니다.",
//           followers: followers.map(follow => follow.followedBy),
//         };
//       } catch (error) {
//         console.log("seeFollowers error");
//         return { ok: false, message: "팔로워 조회에 실패했습니다." };
//       }
//     },
//   },
// };

// export default resolvers;

// ./src/users/seeFollowers/seeFollowers.resolvers.ts
import { User, Follow } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeFollowersArgs {
  username: string;
  cursor?: number;
}

interface SeeFollowersResult extends CommonResult {
  followers?: User[];
}

const resolvers: Resolvers = {
  Query: {
    seeFollowers: async (_, { username, cursor }: SeeFollowersArgs, { prisma }: Context): Promise<SeeFollowersResult> => {
      try {
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
          return { ok: false, message: "해당 사용자가 존재하지 않습니다." };
        }

        const followers = await prisma.follow.findMany({ // "Follow" 대신 "follow"를 사용
          where: {
            followingId: user.id
          },
          select: {
            followed: true
          },
          skip: cursor || 0,
          take: 20,
        });

        return {
          ok: true,
          message: "팔로워 조회 성공",
          followers: followers.map((follow: { followed: User; }) => follow.followed), // "follow"의 타입을 정확하게 지정하고 "followed" 대신 "followedId"를 사용
        };
      } catch (error) {
        console.log("seeFollowers error");
        return { ok: false, message: "팔로워 조회 실패." };
      }
    },
  },
};

export default resolvers;

