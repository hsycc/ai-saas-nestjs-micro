/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "chat_model" (
    "id" TEXT NOT NULL,
    "provider" VARCHAR(50) NOT NULL DEFAULT 'chatgpt',
    "model" VARCHAR(50) NOT NULL DEFAULT 'gpt-3.5-turbo',
    "name" VARCHAR(50) NOT NULL,
    "struct" JSONB NOT NULL DEFAULT '[]',
    "question_tpl" TEXT NOT NULL DEFAULT '%question%',
    "status" INTEGER NOT NULL DEFAULT 1,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_model_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chat_model_id_key" ON "chat_model"("id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_model_name_user_id_key" ON "chat_model"("name", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_model_id_user_id_key" ON "chat_model"("id", "user_id");
