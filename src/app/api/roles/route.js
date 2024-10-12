import connect from "@/dbConfig/dbConfig";
import Role from "@/models/Role";
import { NextResponse } from "next/server";

connect();

export async function GET(request, {}) {
  try {
    const role = await Role.find();
    return NextResponse.json({
      message: "Roles found",
      data: role,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
