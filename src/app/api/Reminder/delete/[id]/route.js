import Reminder from "@/models/Reminder";
import connect from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";

connect();

export async function DELETE(request, { params: { id: reminderId } }) {
  if (!(await checkPermission(request, "add_reminder", "lead")))
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
