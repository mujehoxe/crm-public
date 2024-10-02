import axios from "axios";
import mongoose from "mongoose";
import Source from "./Source";
import StatusModel from "./Status";
import TagsModel from "./Tags";
import User from "./Users";
User;
StatusModel;
Source;
TagsModel;

const ONE_SIGNAL_APP_ID = "d1134921-c416-419e-a0a7-0c98e2640e2a";
const ONE_SIGNAL_REST_API_KEY = process.env.ONE_SIGNAL_REST_API_KEY;

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

async function sendOneSignalNotification(activityLog) {
  const notification = {
    app_id: ONE_SIGNAL_APP_ID,
    headings: {
      en: `${activityLog.action} by ${
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
    included_segments: ["All"],
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
    console.log("New activity log saved:", populatedDoc);
    await sendOneSignalNotification(populatedDoc);
  } catch (error) {
    console.error("Error in post-save hook:", error);
  }
});

const ActivityLog =
  mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
