/*
  Warnings:

  - You are about to drop the `found-item-categories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contactNo` to the `user-profiles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "found-items" DROP CONSTRAINT "found-items_categoryId_fkey";

-- AlterTable
ALTER TABLE "found-items" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "claimProcess" TEXT,
ADD COLUMN     "contactNo" TEXT,
ADD COLUMN     "foundDate" TEXT,
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "user-profiles" ADD COLUMN     "contactNo" TEXT NOT NULL,
ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "age" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropTable
DROP TABLE "found-item-categories";

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lost-items" (
    "id" TEXT NOT NULL,
    "lostItemName" TEXT NOT NULL,
    "brand" TEXT,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "contactNo" TEXT,
    "lostDate" TEXT,
    "image" TEXT,
    "found" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lost-items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- AddForeignKey
ALTER TABLE "found-items" ADD CONSTRAINT "found-items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lost-items" ADD CONSTRAINT "lost-items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lost-items" ADD CONSTRAINT "lost-items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
