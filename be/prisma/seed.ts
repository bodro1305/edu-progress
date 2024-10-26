import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      full_name: 'Admin',
      role: 'admin',
      password: await argon2.hash('admin'),
      is_substitute: false,
    },
  });

  const user123 = await prisma.user.upsert({
    where: { username: '112233' },
    update: {},
    create: {
      username: '112233',
      full_name: 'Santos Gaming',
      role: 'regular',
      password: await argon2.hash('123'),
      is_substitute: false,
      lessons: {
        create: {
          name: 'SEJARAH',
        },
      },
    },
    include: {
      lessons: true,
      substitute: true,
    },
  });

  console.log({ admin, user123 });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
