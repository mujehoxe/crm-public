import connect from "@/dbConfig/dbConfig";
import ActivityLog from "@/models/Activity";
import Comment from "@/models/Comment";
import logger from "@/utils/logger";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { checkPermission } from "../../permissions/checkPermission";

connect();

export async function POST(request) {
  if (!(await checkPermission(request, "comment", "lead")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const reqBody = await request.json();
    const { leadData, content } = reqBody;

    if (!leadData || !leadData._id)
      return NextResponse.json(
        { error: "must provide leadId" },
        { status: 400 }
      );

    const token = request.cookies.get("token")?.value || "";
    const user = jwt.decode(token, process.env.JWT_SECRET_KEY);
    const userId = user.id;
    const username = user.name;

    const newComment = new Comment({
      LeadId: leadData._id,
      UserId: user.id,
      Content: content,
    });

    const savedComment = await newComment.save();
    logger.info("New Comment added:", savedComment);

    const action = `Comment added by ${username} to Lead${
      leadData.leadName && `: "${leadData.leadName}"`
    }`;

    const activityLog = new ActivityLog({
      action,
      Userid: userId,
      Leadid: leadData._id,
      date: new Date().toLocaleDateString(),
    });

    await activityLog.save();

    return NextResponse.json({
      message: "Comment created",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
