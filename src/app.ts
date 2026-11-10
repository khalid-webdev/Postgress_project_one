import express from "express";
import authRoutes from "./routes/auth.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

// middleware 
app.use(express.json());


//routes
app.use("/api/v1/auth", authRoutes);


//errorMiddleware
app.use(errorMiddleware);

export default app;
