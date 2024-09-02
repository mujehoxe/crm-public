import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextResponse } from "next/server";
import connect from "@/dbConfig/dbConfig";
import Leads from "@/models/Leads";
import ActivityLog from "@/models/Activity";
import jwt from "jsonwebtoken"; // Import jwt directly here

connect();

export async function PUT(request) {
  try {
    const reqBody = await request.json();
    const { leads, assignee, source, status, description } = reqBody;
    const token = request.cookies.get("token")?.value || "";
    const decoded = jwt.decode(token);
    const userId = decoded.id;
    const username = decoded.name;
    const currentDate = new Date().toLocaleDateString();

    for (const lead of leads) {
      let updateObject = {};
      let operations = [];

      if (assignee) {
        updateObject.Assigned = assignee.value;
        updateObject.LeadAssignedDate = new Date();
        operations.push({
          editedField: "Assigned",
          action: "Lead reassigned",
          oldVal: lead.Assigned.username,
          newVal: assignee,
        });
      }

      if (source) {
        updateObject.Source = source.value;
        operations.push({
          editedField: "Source",
          action: "Lead Field Source updated",
          oldVal: lead.Source.Source,
          newVal: source,
        });
      }

      if (status) {
        updateObject.LeadStatus = status.value;
        operations.push({
          editedField: "LeadStatus",
          action: "Lead status updated by " + username,
          oldVal: lead.LeadStatus.Status,
          newVal: status,
        });
      }

      await Leads.findByIdAndUpdate(lead._id, updateObject);

      operations.forEach(async (operation) => {
        const activityLog = new ActivityLog({
          action: operation.action,
          Userid: userId,
          Leadid: lead._id,
          leadstatus: operation.newVal.label,
          date: currentDate,
          previousLeadstatus: operation.oldVal,
        });

        description &&
          description != "" &&
          (activityLog.description = description);

        await activityLog.save();
      });
    }

    return NextResponse.json({
      message: "Leads updated successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
