// ./src/users/followUpdates/followUpdates.resolvers.ts
import { withFilter } from "graphql-subscriptions";
import { User } from "@prisma/client";
import prisma from "../../prisma";
import pubsub from "../../pubsub";

interface FollowUpdatesPayload {
  followUpdates: {
    ok: boolean;
    error: string;
  };
}

interface FollowUpdatesArgs {
  userId: number;
}

interface FollowUpdatesContext {
  loggedInUser?: User;
}

const resolvers = {
  Subscription: {
    followUpdates: {
      subscribe: async (parent: any, args: FollowUpdatesArgs, context: FollowUpdatesContext, info: any) => {
        const foundUser: User | null = await prisma.user.findFirst({
          where: { id: args.userId }, // 조건에서 username을 제거했습니다.
        });

        if (foundUser === null) {
          throw new Error("존재하지 않거나 구독할 수 없는 유저입니다.");
        }

        return withFilter(
          () => pubsub.asyncIterator(["FOLLOW_UPDATES"]),
          (payload: FollowUpdatesPayload, args: FollowUpdatesArgs): boolean => {
            return payload.followUpdates.ok;
          }
        )(parent, args, context, info);
      },
    },
  },
};

export default resolvers;
