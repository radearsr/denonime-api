/*
  Warnings:

  - Added the required column `releaseDate` to the `carousel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `carousel` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `releaseDate` DATE NOT NULL;
