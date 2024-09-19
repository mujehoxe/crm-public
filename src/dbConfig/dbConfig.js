import mongoose from "mongoose";

async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URL);
    const connection = mongoose.connection;
    connection.setMaxListeners(15);
    connection.on("connected", () => {
      console.info("connected");
    });
    connection.on("error", (e) => {
      console.error("MongoDB connection error:", e);
      retryConnect();
    });
    connection.on("disconnected", () => {
      console.warn("Disconnected from MongoDB");
      retryConnect();
    });
  } catch (e) {
    console.error("Initial MongoDB connection failed:", e);
    retryConnect();
  }
}

function retryConnect() {
  setTimeout(() => {
    connect().catch((err) => {
      console.error("Retry failed:", err);
      process.exit(1); // Exit if all retries fail
    });
  }, 5000); // Retry after 5 seconds
}

export default connect;
