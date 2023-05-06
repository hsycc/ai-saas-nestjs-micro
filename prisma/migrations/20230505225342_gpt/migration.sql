/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "user";

-- DropEnum
DROP TYPE "UserRole";

-- DropEnum
DROP TYPE "UserStatus";

-- CreateTable
CREATE TABLE "chat_model" (
    "id" TEXT NOT NULL,
    "provider" VARCHAR(50) DEFAULT 'chatgpt',
    "model" VARCHAR(50) DEFAULT 'gpt-3.5-turbo''',
    "name" VARCHAR(50) NOT NULL,
    "preset" JSONB,
    "question_tpl" TEXT DEFAULT '%question%',
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_model_pkey" PRIMARY KEY ("id")
);
