import connect from "@/dbConfig/dbConfig";
import ActivityLog from "@/models/Activity";
import Reminder from "@/models/Reminder";
import logger from "@/utils/logger";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { checkPermission } from "../../permissions/checkPermission";
import Leads from "@/models/Leads";

connect();

export async function POST(request) {
  if (!(await checkPermission(request, "add_reminder", "lead")))
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
    const username = decoded.name;
    const leadid = Leadid;

    const { Name, Email, Phone } = await Leads.findById(leadid).exec();

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
