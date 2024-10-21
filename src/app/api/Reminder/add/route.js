import connect from "@/dbConfig/dbConfig";
import ActivityLog from "@/models/Activity";
import Reminder from "@/models/Reminder";
import logger from "@/utils/logger";
import axios from "axios";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { checkPermission } from "../../permissions/checkPermission";

connect();

export async function POST(request) {
  if (!(await checkPermission("add_reminder", "lead")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const reqBody = await request.json();
    const { DateTime, Assignees, Leadid, Comment } = reqBody;

    const newReminder = new Reminder({
      DateTime,
      Assignees,
      Leadid: Leadid,
      Comment,
    });

    const savedReminder = await newReminder.save();
    logger.info("New Reminder added:", savedReminder);

    const token = request.cookies.get("token")?.value || "";

    const decoded = jwt.decode(token);
    const userId = decoded.id;
    const leadid = Leadid;

    const action = `Reminder added`;

    const [date, Time] = reqBody.DateTime.split("T");

    const activityLog = new ActivityLog({
      action,
      Userid: userId,
      Leadid: leadid,
      date: new Date().toLocaleDateString(),
      info: {
        Date: date,
        Time,
        Comment,
      },
    });

    await activityLog.save();

    sendOneSignalNotification(savedReminder);

    return NextResponse.json({
      message: "Reminder created",
      activityLog,
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function sendOneSignalNotification(reminder) {
  const notificationTime = new Date(reminder.DateTime);
  notificationTime.setMinutes(notificationTime.getMinutes() - 15);

  const notification = {
    app_id: process.env.ONE_SIGNAL_APP_ID,
    headings: {
      en: `Reminder for lead "${reminder.Leadid.Name}"`,
    },
    contents: {
      en: `Reminder: ${reminder.Comment}\nDue at ${reminder.DateTime}`,
    },
    data: {
      type: "reminder",
      reminderId: reminder._id.toString(),
      leadId: reminder.Leadid._id.toString(),
      leadName: reminder.Leadid.Name,
      dateTime: reminder.DateTime,
      comment: reminder.Comment,
    },
    include_player_ids: [
      reminder.Assignees.onesignalPlayerId,
      reminder.Leadid.Assigned.onesignalPlayerId,
    ],
    send_after: `${notificationTime.toUTCString()}`,
  };

  try {
    console.log(notification);
    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      notification,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.ONE_SIGNAL_REST_API_KEY}`,
        },
      }
    );
    console.log("OneSignal Notification scheduled:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error scheduling OneSignal notification:",
      error.response ? error.response.data : error.message
    );
  }
}
