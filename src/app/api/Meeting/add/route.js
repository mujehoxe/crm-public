import connect from "@/dbConfig/dbConfig";
import ActivityLog from "@/models/Activity";
import Leads from "@/models/Leads";
import Meeting from "@/models/Meeting";
import logger from "@/utils/logger";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { checkPermission } from "../../permissions/checkPermission";

connect();

export async function POST(request) {
  try {
    if (!(await checkPermission("add_meeting", "lead")))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (err) {
    return NextResponse.json({ error: "Forbidden " + err }, { status: 403 });
  }

  try {
    const reqBody = await request.json();
    const {
      Subject,
      MeetingDate,
      Priority,
      Followers,
      Lead,
      Status,
      Comment,
      MeetingType,
      directoragnet,
      agentName,
      agentPhone,
      agentCompany,
      Developer,
      Location,
    } = reqBody;
    const token = request.cookies.get("token")?.value || "";

    const decoded = jwt.decode(token);
    const userId = decoded.id;
    const username = decoded.name;
    const leadid = Lead;

    const { Name, Email, Phone } = await Leads.findById(leadid).exec();

    const newMeeting = new Meeting({
      Subject,
      MeetingDate,
      Priority,
      MeetingType,
      directoragnet,
      agentName,
      agentPhone,
      agentCompany,
      Developer,
      Location,
      Assignees: userId,
      Followers,
      Leadid: Lead,
      Status,
      Comment,
      addedby: userId,
    });

    const savedMeeting = await newMeeting.save();
    logger.info("New Meeting added:", savedMeeting);
    const currentDate = new Date().toLocaleDateString();

    const action = `meeting added`;

    const activityLog = new ActivityLog({
      action,
      Userid: userId,
      Leadid: leadid,
      date: currentDate,
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
