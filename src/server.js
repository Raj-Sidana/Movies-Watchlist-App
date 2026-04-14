import express from "express";
import moviesRoutes from "../routes/moviesRoutes.js";
import { connectDB, disconnectDB } from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";

await connectDB();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Api Routes
app.use("/movies", moviesRoutes);
app.use("/auth", authRoutes);


app.listen(port, () => {
    console.log(`Server is runing at http://localhost:${port}`);
});

// Handle unhandled Promise Rejection
process.on("unhandledRejection", (error) => {
    console.error(`Unhandled Rejection: ${error.message}`);
    disconnectDB();
    process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error(`Uncaught Exception: ${error.message}`);
    disconnectDB();
    process.exit(1);
});

// Handle process termination
process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    disconnectDB();
    process.exit(0);
});