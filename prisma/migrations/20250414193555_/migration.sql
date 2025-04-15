-- AlterTable
ALTER TABLE `reservations` ADD COLUMN `reason` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
