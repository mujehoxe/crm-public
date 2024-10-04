import connect from "@/dbConfig/dbConfig";
import ActivityLog from "@/models/Activity";
import Source from "@/models/Source";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

connect();

export async function PUT(request) {
  try {
    const reqBody = await request.json();
    const { orderedIds } = reqBody;
    const token = request.cookies.get("token")?.value || "";
    const decoded = jwt.decode(token);
    const userId = decoded.id;
    const action = `order added`;
    const currentDate = new Date().toLocaleDateString("en-GB");
    const activityLog = new ActivityLog({
      action,
      Userid: userId,
      date: currentDate,
    });
    await activityLog.save();

    orderedIds.forEach(async (id, index) => {
      await Source.findByIdAndUpdate(id, { order: index });
    });

    return NextResponse.json({
      message: "Source created",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
