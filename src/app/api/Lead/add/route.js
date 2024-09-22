import connect from "@/dbConfig/dbConfig";
import ActivityLog from "@/models/Activity";
import Leads from "@/models/Leads";
import logger from "@/utils/logger";
import { NextResponse } from "next/server";
import { checkPermission } from "../../permissions/checkPermission";

connect();

export async function POST(request) {
  if (!(await checkPermission(request, "add", "lead")))
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
    const userId = decoded.id;
    const username = decoded.name;
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

    const action = `Lead added by ${username} and assigned to ${Assigned}`;
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
