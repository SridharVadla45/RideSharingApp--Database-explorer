import { PrismaClient } from '@prisma/client';
// import { MariaDBAdapter } from '@prisma/adapter-mariadb';
// import { connect } from '@planetscale/database';

// const connection = connect({
//   host: process.env.DB_HOST,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
// });

// const adapter = new MariaDBAdapter(connection);
const prisma = new PrismaClient() ;

export default prisma;