import Reminder from "@/models/Reminder";
import connect from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";

connect();

export async function DELETE(request, { params: { id: reminderId } }) {
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
