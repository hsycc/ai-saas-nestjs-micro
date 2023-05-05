-- CreateTable
CREATE TABLE "chat_model" (
    "id" SERIAL NOT NULL,
    "provider" VARCHAR(50) DEFAULT 'chatgpt',
    "model" VARCHAR(50) DEFAULT 'gpt-3.5-turbo''',
    "name" VARCHAR(50) NOT NULL,
    "preset" JSONB,
    "question_tpl" TEXT DEFAULT '%question%',
    "userId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_model_pkey" PRIMARY KEY ("id")
);
