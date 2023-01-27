/*
  Warnings:

  - You are about to drop the `anime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `authentication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `genreId` to the `anime_genres` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `anime_genres` DROP FOREIGN KEY `Anime_Genres_animeId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_roleId_fkey`;

-- AlterTable
ALTER TABLE `anime_genres` ADD COLUMN `genreId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `anime`;

-- DropTable
DROP TABLE `authentication`;

-- DropTable
DROP TABLE `genre`;

-- DropTable
DROP TABLE `role`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `roles` (
    `roleId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NULL,

    PRIMARY KEY (`roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(255) NULL,
    `lastName` VARCHAR(255) NULL,
    `username` VARCHAR(255) NULL,
    `password` TEXT NULL,
    `email` VARCHAR(200) NULL,
    `roleId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `authentications` (
    `token` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `authentications_token_key`(`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `animes` (
    `animeId` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `poster` VARCHAR(100) NULL,
    `type` ENUM('Movie', 'Series') NOT NULL DEFAULT 'Series',
    `releaseDate` DATE NOT NULL,
    `status` ENUM('Ongoing', 'Completed') NOT NULL DEFAULT 'Completed',
    `slug` VARCHAR(100) NULL,

    PRIMARY KEY (`animeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `genres` (
    `genreId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NULL,

    PRIMARY KEY (`genreId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`roleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anime_genres` ADD CONSTRAINT `anime_genres_animeId_fkey` FOREIGN KEY (`animeId`) REFERENCES `animes`(`animeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anime_genres` ADD CONSTRAINT `anime_genres_genreId_fkey` FOREIGN KEY (`genreId`) REFERENCES `genres`(`genreId`) ON DELETE RESTRICT ON UPDATE CASCADE;
