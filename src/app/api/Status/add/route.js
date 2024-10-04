import connect from "@/dbConfig/dbConfig";
import ActivityLog from "@/models/Activity";
import StatusModel from "@/models/Status";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { Status } = reqBody;
    const token = request.cookies.get("token")?.value || "";
    const decoded = jwt.decode(token);
    const userId = decoded.id;
    const action = `status added`;
    const currentDate = new Date().toLocaleDateString("en-GB");
    const activityLog = new ActivityLog({
      action,
      Userid: userId,
      date: currentDate,
    });
    await activityLog.save();
    const sourceCount = await StatusModel.countDocuments();

    const newStatus = new StatusModel({
      AddBy: userId,
      Status: Status,
      order: sourceCount + 1,
    });
    const savedStatus = await newStatus.save();

    return NextResponse.json({
      message: "Status created",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
