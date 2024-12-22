//import { eq } from 'drizzle-orm';
//import { db, people, users } from './schema';
//import { faker } from '@faker-js/faker';
//import bcrypt from 'bcryptjs';
//import { exit } from 'process';
//const PASSWORD = 'whyoneAt@1';
//
//const hashedPassword = bcrypt.hashSync(PASSWORD);
//
//const main = async () => {
//  for (let i = 0; i < 9; i++) {
//    const email = faker.internet.email();
//    await db.delete(people).where(eq(people.email, email));
//    const person = {
//      email,
//      country: 'Rwanda',
//      lastName: faker.person.lastName(),
//      firstName: faker.person.firstName(),
//      affiliation: faker.company.name(),
//      password: hashedPassword,
//      phone: faker.phone.number(),
//    }
//    await db.insert(people).values({
//      email:'',
//      firstName:'',
//      lastName:'',
//    });
//  }
//};
//
//main()
//  .catch(console.log)
//  .finally(() => {
//    exit();
//  });
