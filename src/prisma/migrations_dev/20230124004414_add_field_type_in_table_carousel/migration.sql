/*
  Warnings:

  - Added the required column `type` to the `carousel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `carousel` ADD COLUMN `type` ENUM('Movie', 'Series') NOT NULL;
