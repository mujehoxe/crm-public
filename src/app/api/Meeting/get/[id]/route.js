import { NextResponse } from "next/server";
import Meeting from "@/models/Meeting";
import connect from "@/dbConfig/dbConfig";

connect();

export async function GET(request, { params }) {
  const leadId = params.id;
  try {
    const Meetings = await Meeting.find({ Leadid: leadId }).populate(
      "Assignees addedby"
    );
    return NextResponse.json({
      mesaaage: "Meetings found",
      data: Meetings,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
