/*
  Warnings:

  - You are about to drop the column `day` on the `birthdays` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `birthdays` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `birthdays` table. All the data in the column will be lost.
  - Added the required column `birthday` to the `birthdays` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "birthdays" DROP COLUMN "day",
DROP COLUMN "month",
DROP COLUMN "year",
ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "hide_year" BOOLEAN NOT NULL DEFAULT false;
