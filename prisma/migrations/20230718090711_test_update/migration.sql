/*
  Warnings:

  - You are about to drop the `_FollowRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FollowRelation" DROP CONSTRAINT "_FollowRelation_A_fkey";

-- DropForeignKey
ALTER TABLE "_FollowRelation" DROP CONSTRAINT "_FollowRelation_B_fkey";

-- DropTable
DROP TABLE "_FollowRelation";

-- CreateTable
CREATE TABLE "Follow" (
    "id" SERIAL NOT NULL,
    "followingId" INTEGER NOT NULL,
    "followedById" INTEGER NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followingId_followedById_key" ON "Follow"("followingId", "followedById");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followedById_fkey" FOREIGN KEY ("followedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
