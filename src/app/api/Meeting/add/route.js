import connect from "@/dbConfig/dbConfig";
import ActivityLog from "@/models/Activity";
import Meeting from "@/models/Meeting";
import logger from "@/utils/logger";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { checkPermission } from "../../permissions/checkPermission";

connect();

export async function POST(request) {
  const reqBody = await request.json();

  try {
    if (!(await checkPermission("add_meeting", "lead")))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (err) {
    return NextResponse.json({ error: "Forbidden " + err }, { status: 403 });
  }

  try {
    const token = request.cookies.get("token")?.value || "";

    const user = jwt.decode(token);

    const newMeeting = new Meeting({
      ...reqBody,
      Assignees: user.id,
      Leadid: reqBody.Lead,
      addedby: user.id,
    });

    const savedMeeting = await newMeeting.save();
    logger.info("New Meeting added:", savedMeeting);
    const currentDate = new Date().toLocaleDateString();

    const activityLog = new ActivityLog({
      action: `Meeting added`,
      Userid: user.id,
      Leadid: reqBody.Lead,
      date: currentDate,
      MeetingDate: reqBody.MeetingDate,
      MeetingTime: reqBody.Time,
    });

    await activityLog.save();

    return NextResponse.json({
      message: "Meeting created",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
