import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const userCount = await prisma.user.count();
        console.log(`User count: ${userCount}`);

        const driverCount = await prisma.driver.count();
        console.log(`Driver count: ${driverCount}`);

        const rideCount = await prisma.ride.count();
        console.log(`Ride count: ${rideCount}`);

        const kevin = await prisma.user.findFirst({
            where: { email: 'kevin@test.com' }
        });
        console.log('Kevin user:', kevin);

    } catch (err) {
        console.error('Error querying database:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
