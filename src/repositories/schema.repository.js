import {PrismaClient} from "./src/generated/prisma-client.js";

const prisma = new PrismaClient();

export const getSchema = async () => {
    const result = await prisma.$queryRaw`SHOW TABLES`;
    return result;
}