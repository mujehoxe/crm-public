import connect from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import Reminder from "@/models/Reminder";
import logger from "@/utils/logger";
import jwt from "jsonwebtoken";
import axios from "axios";
import ActivityLog from "@/models/Activity";

connect();

export async function POST(request) {
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
    console.log(savedReminder);
    logger.info("New Reminder added:", savedReminder);

    const token = request.cookies.get("token")?.value || "";

    const decoded = jwt.decode(token);
    const userId = decoded.id;
    const username = decoded.name;
    const leadid = Leadid;
    const leadResponse = await axios.get(
      (process.env.BASE_URL || "") + `/api/Lead/${leadid}`
    );

    const { Name, Email, Phone } = leadResponse.data.data;

    const action = `Reminder added by ${username} to Lead: ${
      Name ? `Name: "${Name}"` : ""
    }${Email ? ` Email: ${Email}` : ""}${Phone ? ` Phone: ${Phone}` : ""}`;

    const activityLog = new ActivityLog({
      action,
      Userid: userId,
      Leadid: leadid,
      date: new Date().toLocaleDateString(),
    });

    await activityLog.save();

    return NextResponse.json({
      message: "Reminder created",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
