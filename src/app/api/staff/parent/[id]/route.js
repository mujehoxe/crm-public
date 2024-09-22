import connect from "@/dbConfig/dbConfig";
import User from "@/models/Users";
import { NextResponse } from "next/server";

connect();

export async function GET(request, { params }) {
  try {
    const id = params.id;
    const user = await User.find({ PrentStaff: id });
    return NextResponse.json({
      mesaaage: "User found",
      data: user,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
