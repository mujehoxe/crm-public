import connect from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import Meeting from "@/models/Meeting";
import logger from "@/utils/logger";
import jwt from "jsonwebtoken";
import axios from "axios";
import ActivityLog from "@/models/Activity";

connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const {
      Subject,
      MeetingDate,
      Priority,
      Assignees,
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

    const leadResponse = await axios.get(
      (process.env.BASE_URL || "") + `/api/Lead/${leadid}`
    );

    const { Name, Email, Phone } = leadResponse.data.data;

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

    const action = `Meeting added by ${username} to Lead: ${
      Name ? `Name: "${Name}"` : ""
    }${Email ? ` Email: ${Email}` : ""}${Phone ? ` Phone: ${Phone}` : ""}`;

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
    console.error(error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
