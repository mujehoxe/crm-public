import getDataFromToken from "@/helpers/getDataFromtoken";
import { NextRequest, NextResponse } from "next/server";
import Invoice from "@/models/invoice";
import User from "@/models/Users";
import connect from "@/dbConfig/dbConfig";
import { checkPermission } from "@/app/api/permissions/checkPermission";

connect();
async function getAllUserIds(userid) {
  const userIds = [];
  const queue = [userid];

  while (queue.length > 0) {
    const currentId = queue.shift();
    userIds.push(currentId);

    const users = await User.find({ PrentStaff: currentId });
    const newUserIds = users.map((user) => user._id.toString());

    queue.push(...newUserIds);
  }

  return userIds;
}
export async function GET(request, { params }) {
  if (!(await checkPermission(request, "view_invoice", "lead")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parentstaff = params.id;

  try {
    const allUserIds = await getAllUserIds(parentstaff);

    const invoices = await Invoice.find({
      $or: [
        { Userid: { $in: allUserIds } },
        { approvedby: { $elemMatch: { $in: allUserIds } } },
      ],
    }).populate("approvedby Userid");
    return NextResponse.json({
      mesaaage: "invoices found",
      data: invoices,
      users: allUserIds,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
