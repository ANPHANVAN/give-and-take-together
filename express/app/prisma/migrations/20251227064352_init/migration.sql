/*
  Warnings:

  - The values [POSTED,PENDING_MATCH,AWAITING_DELIVERY,CANCELED] on the enum `PostStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [REQUESTED,DELIVERED,CANCELED] on the enum `ProductStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [APPROVED,COMPLETED,CANCELED] on the enum `RequestStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `location` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `requireVerified` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryLocation` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryTime` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `requestId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `onTimeRate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `minTrustScore` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `title` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rate` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('READ', 'UNREAD');

-- AlterEnum
BEGIN;
CREATE TYPE "PostStatus_new" AS ENUM ('ACTIVE', 'INACTIVE', 'COMPLETED');
ALTER TABLE "public"."Post" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Post" ALTER COLUMN "status" TYPE "PostStatus_new" USING ("status"::text::"PostStatus_new");
ALTER TYPE "PostStatus" RENAME TO "PostStatus_old";
ALTER TYPE "PostStatus_new" RENAME TO "PostStatus";
DROP TYPE "public"."PostStatus_old";
ALTER TABLE "Post" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProductStatus_new" AS ENUM ('AVAILABLE', 'RESERVED', 'GIVEN');
ALTER TABLE "public"."Product" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "status" TYPE "ProductStatus_new" USING ("status"::text::"ProductStatus_new");
ALTER TYPE "ProductStatus" RENAME TO "ProductStatus_old";
ALTER TYPE "ProductStatus_new" RENAME TO "ProductStatus";
DROP TYPE "public"."ProductStatus_old";
ALTER TABLE "Product" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RequestStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
ALTER TABLE "public"."Request" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Request" ALTER COLUMN "status" TYPE "RequestStatus_new" USING ("status"::text::"RequestStatus_new");
ALTER TYPE "RequestStatus" RENAME TO "RequestStatus_old";
ALTER TYPE "RequestStatus_new" RENAME TO "RequestStatus";
DROP TYPE "public"."RequestStatus_old";
ALTER TABLE "Request" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_requestId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_user2Id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_productId_fkey";

-- DropIndex
DROP INDEX "Request_productId_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "location",
ADD COLUMN     "locationLat" DOUBLE PRECISION,
ADD COLUMN     "locationLong" DOUBLE PRECISION,
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "read",
ADD COLUMN     "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD';

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "requireVerified",
ADD COLUMN     "verified" TEXT[],
ALTER COLUMN "maxRequests" SET DEFAULT 1,
ALTER COLUMN "minTrustScore" SET NOT NULL,
ALTER COLUMN "minTrustScore" SET DEFAULT 0.0,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "name",
ADD COLUMN     "receivedAt" TIMESTAMP(3),
ADD COLUMN     "receiverId" INTEGER,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "deliveryLocation",
DROP COLUMN "deliveryTime",
DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "createdAt",
DROP COLUMN "rating",
DROP COLUMN "requestId",
ADD COLUMN     "imageUrl" TEXT[],
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "rate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "onTimeRate",
DROP COLUMN "username",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "fullname" TEXT NOT NULL,
ALTER COLUMN "socialLinks" SET DATA TYPE TEXT,
ALTER COLUMN "givenCount" SET DATA TYPE BIGINT,
ALTER COLUMN "receivedCount" SET DATA TYPE BIGINT;

-- DropTable
DROP TABLE "Chat";

-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestId" INTEGER NOT NULL,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToRequest" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductToRequest_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ChatRoomToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ChatRoomToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_requestId_key" ON "ChatRoom"("requestId");

-- CreateIndex
CREATE INDEX "_ProductToRequest_B_index" ON "_ProductToRequest"("B");

-- CreateIndex
CREATE INDEX "_ChatRoomToUser_B_index" ON "_ChatRoomToUser"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewedId_fkey" FOREIGN KEY ("reviewedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToRequest" ADD CONSTRAINT "_ProductToRequest_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToRequest" ADD CONSTRAINT "_ProductToRequest_B_fkey" FOREIGN KEY ("B") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatRoomToUser" ADD CONSTRAINT "_ChatRoomToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatRoomToUser" ADD CONSTRAINT "_ChatRoomToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
