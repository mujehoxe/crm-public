import connect from "@/dbConfig/dbConfig";
import ActivityLog from "@/models/Activity";
import Note from "@/models/Notes";
import logger from "@/utils/logger";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { Comment, Leadid } = reqBody;

    const newNote = new Note({
      Comment,
      Leadid: Leadid.lead._id,
    });
    const savedNote = await newNote.save();
    console.log(savedNote);
    logger.info("New Note added:", savedNote);

    const token = request.cookies.get("token")?.value || "";
    console.log(token);

    const decoded = jwt.decode(token);
    const userId = decoded.id;
    const leadid = Leadid.lead._id;

    const action = `note added`;
    const activityLog = new ActivityLog({
      action,
      Userid: userId,
      Leadid: leadid,
    });
    await activityLog.save();

    return NextResponse.json({
      message: "Note created",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
