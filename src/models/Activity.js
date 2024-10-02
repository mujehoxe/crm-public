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

export const activeConnections = new Map();

export function addSSEConnection(id, res) {
  activeConnections.set(id, res);
  console.log(
    `New connection added. ID: ${id}. Total connections: ${activeConnections.size}`
  );
}

export function removeSSEConnection(id) {
  activeConnections.delete(id);
  console.log(
    `Connection removed. ID: ${id}. Total connections: ${activeConnections.size}`
  );
}

export async function notifyClientsOfNewActivityLog(activityLog) {
  console.log(
    `Notifying clients. Total connections: ${activeConnections.size}`
  );
  const message = {
    type: "NEW_ACTIVITY_LOG",
    data: activityLog,
  };

  const staleConnections = [];

  for (const [id, connection] of activeConnections) {
    try {
      connection.write(message);
      console.log(`Message sent to client ${id}`);
    } catch (error) {
      console.error(`Error writing to connection ${id}:`, error);
      staleConnections.push(id);
    }
  }

  staleConnections.forEach((id) => {
    removeSSEConnection(id);
  });
}

activityLogSchema.post("save", async function (doc) {
  try {
    const populatedDoc = await doc.populate("Userid Leadid");
    console.log("New activity log saved:", populatedDoc);
    await notifyClientsOfNewActivityLog(populatedDoc);
  } catch (error) {
    console.error("Error in post-save hook:", error);
  }
});

const ActivityLog =
  mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
