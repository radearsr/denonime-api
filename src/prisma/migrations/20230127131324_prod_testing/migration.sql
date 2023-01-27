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
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

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
    `publish` ENUM('Publish', 'NonPublish') NOT NULL DEFAULT 'Publish',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`animeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `genres` (
    `genreId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NULL,

    PRIMARY KEY (`genreId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anime_genres` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `animeId` INTEGER NOT NULL,
    `genreId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `carousel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `type` ENUM('Movie', 'Series') NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `poster` VARCHAR(100) NOT NULL,
    `background` VARCHAR(100) NOT NULL,
    `episodes` INTEGER NOT NULL,
    `releaseDate` DATE NOT NULL,
    `animeId` INTEGER NOT NULL,
    `published` ENUM('Publish', 'NonPublish') NOT NULL DEFAULT 'Publish',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`roleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anime_genres` ADD CONSTRAINT `anime_genres_animeId_fkey` FOREIGN KEY (`animeId`) REFERENCES `animes`(`animeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anime_genres` ADD CONSTRAINT `anime_genres_genreId_fkey` FOREIGN KEY (`genreId`) REFERENCES `genres`(`genreId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `episodes` ADD CONSTRAINT `episodes_animeId_fkey` FOREIGN KEY (`animeId`) REFERENCES `animes`(`animeId`) ON DELETE RESTRICT ON UPDATE CASCADE;
