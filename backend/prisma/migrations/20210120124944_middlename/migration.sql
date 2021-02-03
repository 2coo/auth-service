-- AlterTable
ALTER TABLE `Profile` ADD COLUMN     `middleName` VARCHAR(191),
    ADD COLUMN     `nickName` VARCHAR(191),
    ALTER COLUMN `firstName` DROP DEFAULT,
    ALTER COLUMN `lastName` DROP DEFAULT;
