-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "createdAt" SET DEFAULT NOW() + interval '1 month',
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);
