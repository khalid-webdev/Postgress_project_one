import app from "./app.js"
import { initializeDatabase, PORT } from "./config/db.js"


const startServer = async () => {
  try {

    await initializeDatabase();


    app.listen(PORT, () => console.log(`Server is running on ${PORT}`))
  } catch (error) {
    console.log("Error: startup-->", error);
  }
}

startServer();
