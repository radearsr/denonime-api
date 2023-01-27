-- CreateTable
CREATE TABLE `Role` (
    `id_roles` INTEGER NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id_roles`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `roleId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Authentication` (
    `token` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Authentication_token_key`(`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id_roles`) ON DELETE RESTRICT ON UPDATE CASCADE;
