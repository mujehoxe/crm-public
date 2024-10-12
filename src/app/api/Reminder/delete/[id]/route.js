import { checkPermission } from "@/app/api/permissions/checkPermission";
import connect from "@/dbConfig/dbConfig";
import Reminder from "@/models/Reminder";
import { NextResponse } from "next/server";

connect();

export async function DELETE(request, { params: { id: reminderId } }) {
  if (!(await checkPermission("add_reminder", "lead")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const res = await Reminder.findByIdAndDelete(reminderId);
    return NextResponse.json({
      mesaaage: "Reminder deleted",
      data: res,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
