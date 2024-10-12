import { checkPermission } from "@/app/api/permissions/checkPermission";
import connect from "@/dbConfig/dbConfig";
import Meeting from "@/models/Meeting";
import { NextResponse } from "next/server";

connect();

export async function DELETE(request, { params: { id: meetingId } }) {
  if (!(await checkPermission("add_meeting", "lead")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const res = await Meeting.deleteOne({ _id: meetingId });
    return NextResponse.json({
      mesaaage: "Meeting deleted",
      data: res,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
