/*
  Warnings:

  - You are about to drop the column `totalSeconds` on the `pomodoro_round` table. All the data in the column will be lost.
  - Added the required column `total_seconds` to the `pomodoro_round` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `pomodoro_round` DROP FOREIGN KEY `pomodoro_round_pomodoro_session_id_fkey`;

-- AlterTable
ALTER TABLE `pomodoro_round` DROP COLUMN `totalSeconds`,
    ADD COLUMN `total_seconds` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `pomodoro_round` ADD CONSTRAINT `pomodoro_round_pomodoro_session_id_fkey` FOREIGN KEY (`pomodoro_session_id`) REFERENCES `pomodoro_session`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
