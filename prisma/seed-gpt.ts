// prisma/seed.ts

import { PrismaClient as GptClient } from '.prisma/gpt-client';

// initialize Prisma Client
const prisma = new GptClient();

async function main() {
  // create two dummy articles
  // const post1 = await prisma.chatModel.create();
  // console.log({ post1 });yi
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
