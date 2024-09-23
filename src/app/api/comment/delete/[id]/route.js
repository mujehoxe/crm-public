import { checkPermission } from "@/app/api/permissions/checkPermission";
import connect from "@/dbConfig/dbConfig";
import Comment from "@/models/Comment";
import { NextResponse } from "next/server";

connect();

export async function DELETE(request, { params: { id: commentId } }) {
  if (!(await checkPermission(request, "comment", "lead")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const res = await Comment.findByIdAndDelete(commentId);
    return NextResponse.json({
      mesaaage: "Comment deleted",
      data: res,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
