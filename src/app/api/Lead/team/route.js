
import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import Leads from "@/models/Leads";
import User from "@/models/Users";
import connect from "@/dbConfig/dbConfig";
import TagsModel from "@/models/Tags";
import StatusModel from "@/models/Status";
import Source from "@/models/Source";

connect();

async function getAllUserIds(userid) {
    const userIds = [];
    const queue = [userid];

    while (queue.length > 0) {
        const currentId = queue.shift();
        userIds.push(currentId);

        const users = await User.find({ PrentStaff: currentId });
        const newUserIds = users.map(user => user._id.toString());

        queue.push(...newUserIds);
    }

    return userIds;
}

export async function GET(request) {
    try {
        // Fetch all users with the role of 'BusinessHead'
        const users = await User.find({ Role: 'BussinessHead' });

        if (users.length === 0) {
            return NextResponse.json({ message: "No users found with the specified role." }, { status: 404 });
        }

        // Prepare a map to group leads by BusinessHead
        const leadsByUser = {};

        for (const user of users) {
            // Get all user IDs related to the BusinessHead user
            const userIds = await getAllUserIds(user._id);

            // Fetch leads assigned to these users
            const query = {
                Assigned: { $in: userIds },
            };
            const Leaddata = await Leads.find(query)
                .populate('tags marketingtags Assigned LeadStatus Source');

            // Group leads by BusinessHead user
            leadsByUser[user._id] = {
                user: user,
                leads: Leaddata
            };
        }

        return NextResponse.json({
            message: "Leads found",
            leadsByUser: leadsByUser
        });
    } catch (error) {
        console.error("Error fetching lead data:", error);
        return NextResponse.json({ message: "Error fetching lead data." }, { status: 500 });
    }
}
