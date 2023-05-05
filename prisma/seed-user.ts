// prisma/seed.ts

import { PrismaClient as UserClient } from '.prisma/user-client';

import { PrismaClient as GptClient } from '.prisma/user-client';

// initialize Prisma Client
const prisma = new UserClient();

async function main() {
  // create two dummy articles
  const post1 = await prisma.user.create({
    data: {
      username: 'hsycc',
      password: '123456',
    },
  });

  console.log({ post1 });
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
