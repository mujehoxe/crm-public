import { checkPermission } from "@/app/api/permissions/checkPermission";
import connect from "@/dbConfig/dbConfig";
import User from "@/models/Users";
import { NextResponse } from "next/server";

connect();

export async function DELETE(request, { params }) {
  if (!(await checkPermission(request, "delete", "staff")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const userid = params.id;
    if (!userid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await User.deleteOne({ _id: userid });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
