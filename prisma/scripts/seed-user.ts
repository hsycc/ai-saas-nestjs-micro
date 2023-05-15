/*
 * @Author: hsycc
 * @Date: 2023-05-04 03:16:00
 * @LastEditTime: 2023-05-15 15:41:05
 * @Description:
 *
 */
// prisma/seed.ts

import { PrismaClient } from '../@user-client';
import { generateKeyPair, getAesInstance } from '../../libs/common/src';
import { hashSync, genSaltSync } from 'bcrypt';

// initialize Prisma Client
const prisma = new PrismaClient();
const userMap = [
  {
    id: 'clhcwl1ybq000uau9t67z8xj0',
    username: 'hsycc3333',
    password: '12345678',
    ...generateKeyPair(),
  },
  {
    id: 'clhcsprq10000uawc05bf2whi',
    username: 'hsycc',
    password: '12345678',
    ...generateKeyPair(),
  },
];
userMap.map((v) => {
  v.password = hashSync(v.password, genSaltSync(10));
  v.secretKey = getAesInstance(2).encrypt(v.secretKey);
});
async function main() {
  // create two dummy articles
  const post1 = await prisma.user.createMany({
    data: userMap,
  });

  console.log({ post1 });

  const post2 = await prisma.user.findMany();

  console.log({ post2 });
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
