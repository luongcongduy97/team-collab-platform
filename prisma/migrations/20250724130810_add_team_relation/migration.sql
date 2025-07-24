-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "teamId" TEXT;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Update existing messages to link to first team (dummy data). This step may fail if no team exists.
-- Since this migration is create-only, adjust as needed when applying.

ALTER TABLE "Message" ALTER COLUMN "teamId" SET NOT NULL;