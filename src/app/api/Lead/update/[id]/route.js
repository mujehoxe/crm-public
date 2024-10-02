import { checkPermission } from "@/app/api/permissions/checkPermission";
import connect from "@/dbConfig/dbConfig";
import ActivityLog from "@/models/Activity";
import Leads from "@/models/Leads";
import TagsModel from "@/models/Tags";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

connect();

export async function PATCH(request, { params }) {
  if (!(await checkPermission(request, "add_individual", "lead")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const reqBody = await request.json();

    const expectedFields = [
      "LeadStatus",
      "Source",
      "Assigned",
      "Name",
      "Score",
      "Phone",
      "AltPhone",
      "Address",
      "Email",
      "City",
      "State",
      "Project",
      "Budget",
      "Country",
      "Location",
      "ZipCode",
      "Priority",
      "Type",
      "marketingtags",
      "tags",
      "Description",
      "updateDescription",
      "previousStatus",
      "currentLead",
    ];

    const token = request.cookies.get("token")?.value || "";
    const decoded = jwt.decode(token);
    const userId = decoded.id;

    const updateObj = {};

    for (const field of expectedFields) {
      if (
        !reqBody[field] ||
        reqBody[field] === "" ||
        field === "updateDescription" ||
        field === "currentLead"
      )
        continue;

      if (field === "tags" || field === "marketingtags") {
        const tagArray = Array.isArray(reqBody[field])
          ? reqBody[field]
          : [reqBody[field]];
        const tagIds = [];

        for (const tagItem of tagArray) {
          const tagValue = typeof tagItem === "object" ? tagItem.Tag : tagItem;
          let existingTag = await TagsModel.findOne({
            Tag: tagValue,
            type: field,
          });

          if (!existingTag) {
            existingTag = new TagsModel({
              AddBy: userId,
              Tag: tagValue,
              type: field,
            });
            await existingTag.save();
          }

          tagIds.push(existingTag._id);
        }

        updateObj[field] = tagIds;
        continue;
      }

      if (reqBody[field] && field !== "previousStatus") {
        updateObj[field] = reqBody[field].value
          ? reqBody[field].value
          : reqBody[field];
      }
    }

    const leadid = params.id;
    const updatedLead = await Leads.findByIdAndUpdate(
      leadid,
      { $set: updateObj },
      { new: true, strict: false }
    ).populate("tags marketingtags Assigned LeadStatus Source");
    const currentDate = new Date().toLocaleDateString();

    const activityPromises = Object.keys(updateObj).map((updatedField) => {
      let newValue =
        reqBody[updatedField]?.label || reqBody[updatedField].toString();

      if (updatedField === "tags" || updatedField === "marketingtags")
        newValue = reqBody[updatedField]
          .map((val) => val.Tag)
          .toString()
          .replaceAll(",", ", ");

      const activityLog = new ActivityLog({
        action: `Lead Field ${updatedField} updated`,
        Userid: userId,
        Leadid: leadid,
        date: currentDate,
        previousValue:
          reqBody.previousStatus?.label ||
          (reqBody.currentLead && reqBody.currentLead[updatedField].toString()),
        newValue: newValue,
        description: reqBody.updateDescription,
      });
      return activityLog.save();
    });

    await Promise.all(activityPromises);

    return NextResponse.json({
      message: "Lead updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
