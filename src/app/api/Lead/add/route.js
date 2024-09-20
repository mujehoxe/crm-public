import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Leads from "@/models/Leads";
import logger from "@/utils/logger";
import axios from "axios";
import jwt from "jsonwebtoken"; // Import jwt directly here
import ActivityLog from "@/models/Activity";
import { addPermitedRoles } from "../permisions";

connect();

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value || "";
    const loggedUser = jwt.decode(token);

    if (!loggedUser || !addPermitedRoles.includes(loggedUser.role))
      return NextResponse.json(
        { error: "You don't have permissions to add leads" },
        { status: 401 }
      );

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
