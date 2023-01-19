-- AlterTable
ALTER TABLE `animes` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `publish` ENUM('Publish', 'NonPublish') NOT NULL DEFAULT 'Publish';

-- AlterTable
ALTER TABLE `users` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `episodes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numEpisode` INTEGER NOT NULL,
    `source360p` VARCHAR(200) NOT NULL,
    `source480p` VARCHAR(200) NOT NULL,
    `source720p` VARCHAR(200) NOT NULL,
    `animeId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `publish` ENUM('Publish', 'NonPublish') NOT NULL DEFAULT 'Publish',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `episodes` ADD CONSTRAINT `episodes_animeId_fkey` FOREIGN KEY (`animeId`) REFERENCES `animes`(`animeId`) ON DELETE RESTRICT ON UPDATE CASCADE;
