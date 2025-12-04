import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        const userCount = await prisma.user.count();
        console.log(`✅ Success! Found ${userCount} users in the database.`);

        const tables = await prisma.$queryRaw`SHOW TABLES`;
        console.log('Tables found:', tables);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
