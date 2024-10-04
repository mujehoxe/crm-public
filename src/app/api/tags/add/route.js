import connect from "@/dbConfig/dbConfig";
import ActivityLog from "@/models/Activity";
import TagsModel from "@/models/Tags";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { Tag } = reqBody;
    const token = request.cookies.get("token")?.value || "";
    const decoded = jwt.decode(token);
    const userId = decoded.id;
    const username = decoded.name;
    const action = `tags added`;
    const currentDate = new Date().toLocaleDateString("en-GB");
    const activityLog = new ActivityLog({
      action,
      Userid: userId,
      date: currentDate,
    });
    await activityLog.save();

    const newTags = new TagsModel({
      AddBy: userId,
      Tag,
    });
    const savedTag = await newTags.save();

    return NextResponse.json({
      tag: savedTag,
      message: "Tag created",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
