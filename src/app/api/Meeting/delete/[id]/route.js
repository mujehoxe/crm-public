import Meeting from "@/models/Meeting";
import connect from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import { checkPermission } from "@/app/api/permissions/checkPermission";

connect();

export async function DELETE(request, { params: { id: meetingId } }) {
  if (!(await checkPermission(request, "add_meeting", "lead")))
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
