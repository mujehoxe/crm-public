import connect from "@/dbConfig/dbConfig";
import ActivityLog from "@/models/Activity";
import Leads from "@/models/Leads";
import logger from "@/utils/logger";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { checkPermission } from "../../permissions/checkPermission";

connect();

export async function POST(request) {
  if (!(await checkPermission(request, "add_individual", "lead")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const reqBody = await request.json();
    const {
      LeadStatus,
      Source,
      Assigned,
      typeprop,
      Name,
      Phone,
      AltPhone,
      Address,
      Email,
      City,
      Project,
      Budget,
      Country,
      Location,
      ZipCode,
      Type,
      Description,
      unitnumber,
      LeadType,
      tags,
      marketingtags,
    } = reqBody;

    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const user = jwt.decode(token, process.env.JWT_SECRET_KEY);

    const userId = user.id;
    const username = user.name;
    const newLead = new Leads({
      LeadStatus: LeadStatus || undefined,
      Source: Source || undefined,
      Assigned: Assigned || undefined,
      Name,
      Score: 80,
      Phone,
      AltPhone,
      Address,
      Email,
      typeprop,
      City,
      Project,
      Budget,
      Country,
      Location,
      ZipCode,
      Type,
      Description,
      LeadType,
      Doneby: userId,
      tags: tags || undefined,
      marketingtags: marketingtags || undefined,
      unitnumber,
    });

    const savedLead = await newLead.save();
    logger.info("New lead added:", savedLead);

    const leadid = savedLead._id;
    const currentDate = new Date().toLocaleDateString();

    const action = `new lead`;
    const activityLog = new ActivityLog({
      action,
      Userid: userId,
      Leadid: leadid,
      date: currentDate,
    });
    await activityLog.save();

    return NextResponse.json({
      message: "Lead created",
      success: true,
      savedLead,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
