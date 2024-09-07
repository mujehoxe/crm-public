import {NextResponse} from "next/server";
import connect from "@/dbConfig/dbConfig";
import Leads from "@/models/Leads";
import ActivityLog from "@/models/Activity";
import jwt from "jsonwebtoken";
import TagsModel from "@/models/Tags";

connect();

export async function PATCH(request, {params}) {
	try {
		const reqBody = await request.json();

		// Define the fields we expect to update
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
				const existingTag = await TagsModel.findOne({Tag: reqBody[field], type: field});
				let newTag;
				if (!existingTag) {
					newTag = new TagsModel({
						AddBy: userId,
						Tag: reqBody[field],
						type: field,
					});
					await newTag.save();
				} else {
					newTag = existingTag;
				}
				updateObj[field] = newTag._id;
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
				{$set: updateObj},
				{new: true, strict: false}
			).populate("tags marketingtags Assigned LeadStatus Source")
		;

		const currentDate = new Date().toLocaleDateString();

		const activityPromises = Object.keys(updateObj).map(
			async (updatedField) => {
				const activityLog = new ActivityLog({
					action: `Lead Field ${updatedField} updated`,
					Userid: userId,
					Leadid: leadid,
					leadstatus: reqBody[updatedField]?.label || reqBody[updatedField],
					date: currentDate,
					previousLeadstatus:
						reqBody.previousStatus?.label ||
						(reqBody.currentLead && reqBody.currentLead[updatedField]),
					description: reqBody.updateDescription,
				});
				return activityLog.save();
			}
		);

		await Promise.all(activityPromises);

		return NextResponse.json({
			message: "Lead updated successfully",
			data: updatedLead,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({error: error.message}, {status: 400});
	}
}
