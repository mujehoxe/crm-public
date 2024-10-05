import { checkPermission } from "@/app/api/permissions/checkPermission";
import connect from "@/dbConfig/dbConfig";
import ActivityLog from "@/models/Activity";
import Leads from "@/models/Leads";
import { NextResponse } from "next/server";

connect();

export async function PUT(request, { params }) {
  if (!(await checkPermission(request, "export", "lead")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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

    const userId = decoded.id;
    const action = `status updated`;
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
        message: "status updated",
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
      date: currentDate,
      previousValue: previousStatus.label
        ? previousStatus.label
        : previousStatus,
      newValue: status.label,
    });

    await activityLog.save();

    return NextResponse.json({
      mesaaage: "Leads found",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
