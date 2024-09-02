import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextResponse } from "next/server";
import connect from "@/dbConfig/dbConfig";
import Leads from "@/models/Leads";
import ActivityLog from "@/models/Activity";
import jwt from "jsonwebtoken"; // Import jwt directly here
import StatusModel from "@/models/Status";

connect();

export async function PUT(request, { params }) {
  try {
    const reqBody = await request.json();
    const { status, previousStatus } = reqBody;
    const leadid = params.id;
    let lead = await Leads.findById(leadid);

    if (!lead) {
      return NextResponse.json(
        {
          message: "Lead not found",
          data: null,
        },
        { status: 404 }
      );
    }

    const token = request.cookies.get("token")?.value || "";
    const decoded = jwt.decode(token);
    const userId = decoded.id;
    const username = decoded.name;
    const action = `Lead status updated by ${username}`;
    const currentDate = new Date().toLocaleDateString();

    const newStatusLable = status?.lable;

    if (
      newStatusLable === "NI" ||
      newStatusLable === "NR" ||
      newStatusLable === "Not Intrested"
    ) {
      let newStatusCount = lead.statusCount + 1;
      let shouldDelete = false;
      if (newStatusCount >= 3) {
        shouldDelete = true;
      }

      await Leads.findByIdAndUpdate(leadid, {
        LeadStatus: status,
        statusCount: newStatusCount,
      });

      if (shouldDelete) {
        await Leads.findByIdAndDelete(leadid); // Delete lead from database
        return NextResponse.json({
          message: "Lead deleted successfully",
          data: null,
        });
      }

      return NextResponse.json({
        message: "Lead status updated",
        data: { LeadStatus: status.value, statusCount: newStatusCount },
      });
    }

    await Leads.findByIdAndUpdate(leadid, {
      LeadStatus: status.value,
      statusCount: 0,
    });

    console.log("***", previousStatus, status);
    const activityLog = new ActivityLog({
      action,
      Userid: userId,
      Leadid: leadid,
      leadstatus: status.label,
      date: currentDate,
      previousLeadstatus: previousStatus.label
        ? previousStatus.label
        : previousStatus,
    });

    await activityLog.save();

    return NextResponse.json({
      mesaaage: "Leads found",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
