import connect from "@/dbConfig/dbConfig";
import ActivityLog from "@/models/Activity";
import Comment from "@/models/Comment";
import Leads from "@/models/Leads";
import Meeting from "@/models/Meeting";
import Reminder from "@/models/Reminder";
import jwt from "jsonwebtoken"; // Import jwt directly here
import { NextResponse } from "next/server";
import { checkPermission } from "../../permissions/checkPermission";

connect();

export async function PUT(request) {
  if (!(await checkPermission(request, "map_leads", "lead")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const reqBody = await request.json();
    const { leads, assignee, source, status, description, clearData } = reqBody;
    const token = request.cookies.get("token")?.value || "";
    const decoded = jwt.decode(token);
    const userId = decoded.id;
    const currentDate = new Date().toLocaleDateString();

    for (const lead of leads) {
      let updateObject = {};
      let operations = [];

      if (assignee) {
        updateObject.Assigned = assignee.value;
        updateObject.LeadAssignedDate = new Date();
        operations.push({
          editedField: "Assigned",
          action: "reassigned",
          oldVal: lead.Assigned?.username,
          newVal: assignee,
        });
      }

      if (source) {
        updateObject.Source = source.value;
        operations.push({
          editedField: "Source",
          action: "source updated",
          oldVal: lead.Source.Source,
          newVal: source,
        });
      }

      if (status) {
        updateObject.LeadStatus = status.value;
        operations.push({
          editedField: "LeadStatus",
          action: "status updated",
          oldVal: lead.LeadStatus.Status,
          newVal: status,
        });
      }

      await Leads.findByIdAndUpdate(lead._id, updateObject);

      if (clearData) {
        Meeting.deleteMany({ Leadid: lead._id }).exec();
        Reminder.deleteMany({ Leadid: lead._id }).exec();
        Comment.deleteMany({ LeadId: lead._id }).exec();
      }

      operations.forEach(async (operation) => {
        if (operation.oldVal != operation.newVal.label) {
          const activityLog = new ActivityLog({
            action: operation.action,
            Userid: userId,
            Leadid: lead._id,
            date: currentDate,
            previousValue: operation.oldVal,
            newValue: operation.newVal.label,
          });

          description &&
            description != "" &&
            (activityLog.description = description);

          await activityLog.save();
        }
      });
    }

    return NextResponse.json({
      message: "Leads updated successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
