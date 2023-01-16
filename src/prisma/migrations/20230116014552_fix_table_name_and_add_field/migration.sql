/*
  Warnings:

  - The values [OnGoing] on the enum `Anime_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `animegenres` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `animegenres` DROP FOREIGN KEY `AnimeGenres_animeId_fkey`;

-- AlterTable
ALTER TABLE `anime` ADD COLUMN `type` ENUM('Movie', 'Series') NOT NULL DEFAULT 'Series',
    MODIFY `status` ENUM('Ongoing', 'Completed') NOT NULL DEFAULT 'Completed';

-- AlterTable
ALTER TABLE `role` MODIFY `name` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `firstName` VARCHAR(255) NULL,
    MODIFY `lastName` VARCHAR(255) NULL,
    MODIFY `username` VARCHAR(255) NULL,
    MODIFY `password` TEXT NULL,
    MODIFY `email` VARCHAR(200) NULL;

-- DropTable
DROP TABLE `animegenres`;

-- CreateTable
CREATE TABLE `Anime_Genres` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `animeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Anime_Genres` ADD CONSTRAINT `Anime_Genres_animeId_fkey` FOREIGN KEY (`animeId`) REFERENCES `Genre`(`genreId`) ON DELETE RESTRICT ON UPDATE CASCADE;
