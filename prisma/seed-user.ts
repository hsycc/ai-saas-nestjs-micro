/*
 * @Author: hsycc
 * @Date: 2023-05-04 03:16:00
 * @LastEditTime: 2023-05-08 08:14:48
 * @Description:
 *
 */
// prisma/seed.ts

import { PrismaClient as UserClient } from '.prisma/user-client';
import { hashSync, genSaltSync } from 'bcrypt';
// initialize Prisma Client
const prisma = new UserClient();
const userMap = [
  {
    id: 'clhcwl1ybq000uau9t67z8xj0',
    username: 'hsycc3333',
    password: '123456',
  },
  {
    id: 'clhcsprq10000uawc05bf2whi',
    username: 'hsycc',
    password: '123456',
  },
];
userMap.map((v) => {
  v.password = hashSync(v.password, genSaltSync(10));
});
async function main() {
  // create two dummy articles
  const post1 = await prisma.user.createMany({
    data: userMap,
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
