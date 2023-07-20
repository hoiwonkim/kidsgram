// ./src/users/seeFollowing/seeFollowing.resolvers.ts
// import { User } from ".prisma/client";
// import { CommonResult } from "../../shared/shared.interfaces";
// import { Context, Resolvers } from "../../types";

// interface SeeFollowingArgs {
//   username: string;
//   cursor?: number;
// }

// interface SeeFollowingResult extends CommonResult {
//   following?: User[];
// }

// const resolvers: Resolvers = {
//   Query: {
//     seeFollowing: async (_, { username, cursor }: SeeFollowingArgs, { prisma }: Context): Promise<SeeFollowingResult> => {
//       try {
//         const user = await prisma.user.findUnique({ where: { username } });

//         if (!user) {
//           return { ok: false, message: "해당 유저는 존재하지 않습니다." };
//         }

//         const following = await prisma.follow.findMany({
//           where: {
//             followedById: user.id
//           },
//           select: {
//             following: true
//           },
//           skip: cursor || 0,
//           take: 20,
//         });

//         return {
//           ok: true,
//           message: "팔로잉 조회에 성공했습니다.",
//           following: following.map(follow => follow.following),
//         };
//       } catch (error) {
//         console.log("seeFollowing error");
//         return { ok: false, message: "팔로잉 조회에 실패했습니다." };
//       }
//     },
//   },
// };

// export default resolvers;


// ./src/users/seeFollowing/seeFollowing.resolvers.ts
import { User, Follow } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeFollowingArgs {
  username: string;
  cursor?: number;
}

interface SeeFollowingResult extends CommonResult {
  following?: User[];
}

const resolvers: Resolvers = {
  Query: {
    seeFollowing: async (_, { username, cursor }: SeeFollowingArgs, { prisma }: Context): Promise<SeeFollowingResult> => {
      try {
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
          return { ok: false, message: "사용자가 존재하지 않습니다." };
        }

        const followRelations = await prisma.follow.findMany({
          where: {
            followedId: user.id
          },
          skip: cursor || 0,
          take: 20,
        });

        const following = await prisma.user.findMany({
          where: {
            id: {
              in: followRelations.map((relation) => relation.followingId)
            }
          }
        })

        return {
          ok: true,
          message: "팔로잉 조회가 성공적으로 완료되었습니다.",
          following: following,
        };
      } catch (error) {
        console.log("seeFollowing error");
        return { ok: false, message: "팔로잉 조회에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;

