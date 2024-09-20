import { NextResponse } from "next/server";
import User from "@/models/Users";
import connect from "@/dbConfig/dbConfig";
import { deletePermitedRoles } from "../../permissions";
import jwt from "jsonwebtoken";

connect();

export async function DELETE(request, { params }) {
  try {
    const token = request.cookies.get("token")?.value || "";
    const loggedUser = jwt.decode(token);

    if (!loggedUser || !deletePermitedRoles.includes(loggedUser.role))
      return NextResponse.json(
        { error: "You don't have permissions to add staff" },
        { status: 401 }
      );

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
