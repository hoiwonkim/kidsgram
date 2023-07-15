// ./src/hashtags/hashtags.resolvers.ts
import { Hashtag, Photo } from ".prisma/client";
import { Context, Resolvers } from "../types";

interface HashtagsPhotosArgs {
  cursor?: number;
}

const resolvers: Resolvers = {
  Hashtag: {
    photos: async (
      parent: Hashtag,
      { cursor }: HashtagsPhotosArgs,
      { prisma }: Context
    ): Promise<Photo[] | null> => {
      try {
        const foundPhotos: Photo[] = await prisma.photo.findMany({
          where: { hashtags: { some: { name: parent.name } } },
          cursor: cursor === undefined ? undefined : { id: cursor },
          skip: cursor === undefined ? 0 : 1,
          take: 12,
        });
        return foundPhotos;
      } catch (error) {
        console.error("photos error:", error);
        return null;
      }
    },
    totalPhotos: async (parent: Hashtag, __, { prisma }: Context): Promise<number> => {
      try {
        const countedPhotos: number = await prisma.photo.count({
          where: { hashtags: { some: { name: parent.name } } },
        });
        return countedPhotos;
      } catch (error) {
        console.error("totalPhotos error:", error);
        return 0;
      }
    },
  },
};

export default resolvers;
