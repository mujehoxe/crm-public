import axios from "axios";
import mongoose from "mongoose";
import User from "./Users";

await import("./Source");
await import("./Status");
await import("./Tags");

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

const ONE_SIGNAL_APP_ID = "d1134921-c416-419e-a0a7-0c98e2640e2a";
const ONE_SIGNAL_REST_API_KEY = process.env.ONE_SIGNAL_REST_API_KEY;
async function sendOneSignalNotification(activityLog, targetedPlayerIds) {
  const notification = {
    app_id: ONE_SIGNAL_APP_ID,
    headings: {
      en: `"${activityLog.Leadid.Name}" ${activityLog.action} by ${
        activityLog.Userid.username || "Unknown User"
      }`,
    },
    contents: {
      en: `Changed${
        activityLog.previousValue ? " from " + activityLog.previousValue : ""
      }${activityLog.newValue ? " to " + activityLog.newValue : ""}`,
    },
    data: {
      timestamp: activityLog.timestamp,
      userId: activityLog.Userid._id.toString(),
      leadId: activityLog.Leadid._id.toString(),
    },
    include_player_ids: targetedPlayerIds,
  };

  try {
    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      notification,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${ONE_SIGNAL_REST_API_KEY}`,
        },
      }
    );
    console.log("OneSignal Notification sent:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error sending OneSignal notification:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

activityLogSchema.post("save", async function (doc) {
  try {
    const populatedDoc = await doc.populate("Userid Leadid");

    const targetedPlayerIds = await fetchTargetedPlayerIds(populatedDoc);

    if (targetedPlayerIds.length > 0)
      await sendOneSignalNotification(populatedDoc, targetedPlayerIds);
  } catch (error) {
    console.error("Error in post-save hook:", error);
  }
});

async function fetchTargetedPlayerIds(activityLog) {
  const userIds = [activityLog.Leadid.Assigned];

  const users = await User.find({ _id: { $in: userIds } });

  const playerIds = users.map((user) => user.onesignalPlayerId).filter(Boolean);
  console.log("**", playerIds);

  return playerIds;
}

const ActivityLog =
  mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
