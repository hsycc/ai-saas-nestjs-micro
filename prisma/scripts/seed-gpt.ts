/*
 * @Author: hsycc
 * @Date: 2023-05-05 17:47:33
 * @LastEditTime: 2023-05-10 08:09:48
 * @Description:
 *
 */
// prisma/seed.ts

import { PrismaClient } from '.prisma/gpt-client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  // const post1 = await prisma.chatModel.create();
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
