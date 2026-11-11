import express from "express";
import authRoutes from "./routes/auth.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// middleware
app.use(express.json());


//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

//errorMiddleware
app.use(errorMiddleware);

export default app;
