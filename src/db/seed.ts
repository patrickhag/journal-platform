import { eq } from 'drizzle-orm';
import { db, users } from './schema';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { exit } from 'process';
const PASSWORD = 'whyoneAt@1';
import { eq } from 'drizzle-orm';
import { db, users } from './schema';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { exit } from 'process';
const PASSWORD = 'whyoneAt@1';

const hashedPassword = bcrypt.hashSync(PASSWORD);

const main = async () => {
  for (let i = 0; i < 9; i++) {
    const email = faker.internet.email();
    await db.delete(users).where(eq(users.email, email));
    await db.insert(users).values({
      role: 'NORMAL_USER',
      email,
      country: 'Rwanda',
      lastName: faker.person.lastName(),
      firstName: faker.person.firstName(),
      affiliation: faker.company.name(),
      password: hashedPassword,
      emailVerified: new Date(),
    });
  }
};

main()
  .catch(console.log)
  .finally(() => {
    exit();
  });
