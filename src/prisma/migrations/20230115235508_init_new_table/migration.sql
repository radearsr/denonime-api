/*
  Warnings:

  - The primary key for the `role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_roles` on the `role` table. All the data in the column will be lost.
  - You are about to drop the column `role_name` on the `role` table. All the data in the column will be lost.
  - Added the required column `name` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_roleId_fkey`;

-- AlterTable
ALTER TABLE `role` DROP PRIMARY KEY,
    DROP COLUMN `id_roles`,
    DROP COLUMN `role_name`,
    ADD COLUMN `name` VARCHAR(50) NOT NULL,
    ADD COLUMN `roleId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`roleId`);

-- CreateTable
CREATE TABLE `Anime` (
    `animeId` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `poster` VARCHAR(100) NULL,
    `releaseDate` DATE NOT NULL,
    `status` ENUM('OnGoing', 'Completed') NOT NULL DEFAULT 'Completed',
    `slug` VARCHAR(100) NULL,

    PRIMARY KEY (`animeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Genre` (
    `genreId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NULL,

    PRIMARY KEY (`genreId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnimeGenres` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `animeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`roleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnimeGenres` ADD CONSTRAINT `AnimeGenres_animeId_fkey` FOREIGN KEY (`animeId`) REFERENCES `Genre`(`genreId`) ON DELETE RESTRICT ON UPDATE CASCADE;
