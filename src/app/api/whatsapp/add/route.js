import connect from "@/dbConfig/dbConfig";
import ActivityLog from "@/models/Activity";
import WhatsappModel from "@/models/Whatsapp";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { TemplateData } = reqBody;
    const token = request.cookies.get("token")?.value || "";
    const decoded = jwt.decode(token);
    const userId = decoded.id;
    const action = `Whatsapp Template added`;
    const currentDate = new Date().toLocaleDateString("en-GB");
    const activityLog = new ActivityLog({
      action,
      Userid: userId,
      date: currentDate,
    });
    await activityLog.save();

    const newTemplate = new WhatsappModel({
      AddBy: userId,
      Template: TemplateData,
    });
    const savedTemplate = await newTemplate.save();

    return NextResponse.json({
      message: "Template created",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
