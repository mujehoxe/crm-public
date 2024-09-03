import Meeting from "@/models/Meeting";
import connect from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";

connect();

export async function DELETE(request, { params: { id: meetingId } }) {
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
