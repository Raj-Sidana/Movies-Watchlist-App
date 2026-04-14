import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { config } from "dotenv";

config();

const neon = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
    wsConstructor: ws
});

const prisma = new PrismaClient({
    adapter: neon,
    log: process.env.NODE_ENV === "development" 
    ? ["query", "error", "warn"] : ["error"],
});

const connectDB = async () => {
    try{
        await prisma.$connect();
        console.log(`DB connected via Prisma`);
    } catch(error){
        console.error(`DB connection error:`, error);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    await prisma.$disconnect();
    console.log(`DB disconnected`);
};

export { prisma, connectDB, disconnectDB };