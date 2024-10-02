import mongoose from "mongoose";

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

// Store active connections
export const activeConnections = new Set();

export function addSSEConnection(writer) {
  activeConnections.add(writer);
  console.log(
    `New connection added. Total connections: ${activeConnections.size}`
  );
}

export function removeSSEConnection(writer) {
  activeConnections.delete(writer);
  console.log(
    `Connection removed. Total connections: ${activeConnections.size}`
  );
}

// Function to notify all clients of a new activity log
export async function notifyClientsOfNewActivityLog(activityLog) {
  const message = JSON.stringify({
    type: "NEW_ACTIVITY_LOG",
    data: activityLog,
  });

  activeConnections.forEach((writer) => {
    try {
      writer.write(`data: ${message}\n\n`).catch(console.error);
    } catch (error) {
      console.error("Error writing to connection:", error);
      removeSSEConnection(writer);
    }
  });
}

activityLogSchema.post("save", async function (doc) {
  try {
    const populatedDoc = await doc.populate("Userid", "Leadid");
    await notifyClientsOfNewActivityLog(populatedDoc);
  } catch (error) {
    console.error("Error in post-save hook:", error);
  }
});

const ActivityLog =
  mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
