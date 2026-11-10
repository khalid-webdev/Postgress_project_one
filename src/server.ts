import app from "./app.js"
import { initializeDatabase, PORT} from "./config/db.js"


const startServer = async () => {
  try {
    await initializeDatabase();
    console.log("Database ready...")
    app.listen(PORT, () => console.log(`Server is running on ${PORT}`))
  } catch (error) {
    console.log("Database initializaion failed", error);
    process.exit(1);
  }
}

startServer();
