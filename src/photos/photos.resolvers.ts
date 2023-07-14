// ./src/photos/photos.resolvers.ts
import { Hashtag, Photo, User, Comment } from ".prisma/client";
import { Context, Resolvers } from "../types";

const resolvers: Resolvers = {
  Photo: {
    user: async (
      parent: Photo,
      __,
      { prisma }: Context
    ): Promise<User | null> => {
      try {
        const foundUser: User | null = await prisma.user.findUnique({
          where: { id: parent.userId },
        });

        if (foundUser === null) {
          throw new Error();
        }

        return foundUser;
      } catch (error) {
        console.log("user error");
        return null;
      }
    },
    hashtags: async (
      parent: Photo,
      __,
      { prisma }: Context
    ): Promise<Hashtag[] | null> => {
      try {
        let foundHashtags: Hashtag[] = [];
        const photo = await prisma.photo.findUnique({
          where: { id: parent.id },
        });

        if (photo !== null) {
          foundHashtags = await prisma.hashtag.findMany({
            where: { photos: { some: { id: parent.id } } },
          });
        }

        return foundHashtags;
      } catch (error) {
        console.log("hashtags error");
        return null;
      }
    },
    comments: async (
      parent: Photo,
      __,
      { prisma }: Context
    ): Promise<Comment[] | null> => {
      try {
        let foundComments: Comment[] = [];
        const photo = await prisma.photo.findUnique({
          where: { id: parent.id },
        });

        if (photo !== null) {
          foundComments = await prisma.comment.findMany({
            where: { photoId: parent.id },
            include: { user: true },
          });
        }

        return foundComments;
      } catch (error) {
        console.log("comments error");
        return null;
      }
    },
    totalLikes: async (
      parent: Photo,
      __,
      { prisma }: Context
    ): Promise<number> => {
      try {
        const countedLikes: number = await prisma.like.count({
          where: { photoId: parent.id },
        });
        return countedLikes;
      } catch (error) {
        console.log("totalLikes error");
        return 0;
      }
    },
    totalComments: async (
      parent: Photo,
      __,
      { prisma }: Context
    ): Promise<number> => {
      try {
        const countedComments: number = await prisma.comment.count({
          where: { photoId: parent.id },
        });
        return countedComments;
      } catch (error) {
        console.log("totalComments error");
        return 0;
      }
    },
    isMe: (parent: Photo, __, { loggedInUser }: Context): boolean => {
      const isMe: boolean = parent.userId === loggedInUser?.id;

      if (isMe === false) {
        return false;
      }
      return true;
    },
    isLiked: async (
      parent: Photo,
      __,
      { prisma, loggedInUser }: Context
    ): Promise<boolean> => {
      try {
        if (loggedInUser === null) {
          return false;
        }

        const countedLike: number = await prisma.like.count({
          where: { photoId: parent.id, userId: loggedInUser.id },
        });

        if (countedLike === 0) {
          return false;
        }

        return true;
      } catch (error) {
        console.log("isLiked error");
        return false;
      }
    },
  },
  Mutation: {
    updateField: async (_, { id, input }, { prisma, loggedInUser }) => {
      try {
        // 로그인된 사용자가 있는지 확인
        if (!loggedInUser) {
          console.error("로그인하지 않은 유저입니다.");
          throw new Error("로그인하지 않은 유저입니다."); // 로그인하지 않은 사용자에게 에러 메시지를 던집니다.
        }

        // 해당 id를 가진 photo가 실제로 존재하는지 확인
        const photo = await prisma.photo.findUnique({
          where: { id },
        });

        if (!photo) {
          console.error("Record to update not found");
          throw new Error("Record to update not found"); // 존재하지 않는 레코드에 대한 업데이트 요청시 에러를 던집니다.
        }

        const updatedPhoto = await prisma.photo.update({
          where: { id },
          data: {
            ...(input.field === "likes" && {
              likes: {
                // 'likes' 관련 업데이트 로직을 여기에 작성하세요.
              },
            }),
          },
        });

        return updatedPhoto;
      } catch (error) {
        console.error(`Error updating field: ${(error as Error).message}`);
        return null;
      }
    },
  },
};

export default resolvers;
