import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Update user 204 (Kevin Garcia)
        const user = await prisma.user.update({
            where: { user_id: 204 },
            data: {
                email: 'kevin@test.com',
                password: hashedPassword
            }
        });

        console.log('User updated successfully:', user);
    } catch (err) {
        console.error('Error updating user:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
