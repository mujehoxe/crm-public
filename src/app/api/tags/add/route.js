import connect from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import TagsModel from "@/models/Tags";
import ActivityLog from "@/models/Activity";

connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { Tag } = reqBody;
    const token = request.cookies.get("token")?.value || "";
    const decoded = jwt.decode(token);
    const userId = decoded.id;
    const username = decoded.name;
    const action = `Tags added by ${username}`;
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
