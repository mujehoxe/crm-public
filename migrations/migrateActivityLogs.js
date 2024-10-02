const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const activityLogSchema = new mongoose.Schema(
  {
    action: String,
    Userid: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    Leadid: { type: mongoose.Schema.Types.ObjectId, ref: "Leads" },
    timestamp: { type: Date, default: Date.now },
    date: {
      type: String,
      required: true,
    },
    previousValue: String,
    newValue: String,
    description: String,
  },
  { strict: false }
);

const ActivityLog =
  mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", activityLogSchema);

async function migrateActivityLogs() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected!");

    const logs = await ActivityLog.find({
      $or: [
        { previousLeadstatus: { $exists: true } },
        { leadstatus: { $exists: true } },
      ],
    });

    for (const log of logs) {
      log.previousValue = log.previousLeadstatus;
      log.newValue = log.leadstatus;

      // Remove the old fields
      log.previousLeadstatus = undefined;
      log.leadstatus = undefined;

      await log.save();
      console.log(`Migrated log with id: ${log._id}`);
    }

    console.log("Migration completed!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Migration failed:", error);
    mongoose.connection.close();
  }
}

migrateActivityLogs();
