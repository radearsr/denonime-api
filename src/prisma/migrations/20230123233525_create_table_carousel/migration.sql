-- CreateTable
CREATE TABLE `carousel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `poster` VARCHAR(100) NOT NULL,
    `background` VARCHAR(100) NOT NULL,
    `episodes` INTEGER NOT NULL,
    `animeId` INTEGER NOT NULL,
    `published` ENUM('Publish', 'NonPublish') NOT NULL DEFAULT 'Publish',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
