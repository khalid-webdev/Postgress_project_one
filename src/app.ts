import express from "express";
import authRoutes from "./routes/auth.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import userRoutes from "./routes/user.routes.js";
import walletRoutes from "./routes/wallet.routes.js";

const app = express();

// middleware
app.use(express.json());


//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/wallets", walletRoutes);

//errorMiddleware
app.use(errorMiddleware);

export default app;
