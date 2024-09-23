import connect from "@/dbConfig/dbConfig";
import Comment from "@/models/Comment";
import { NextResponse } from "next/server";

connect();

export async function GET(request, { params }) {
  const lead = params.id;
  try {
    const comment = await Comment.find({ LeadId: lead })
      .populate("UserId")
      .sort({ CreatedAt: 1 });
    return NextResponse.json({
      message: "Comment found",
      data: comment,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
