import connect from "@/dbConfig/dbConfig";
import User from "@/models/Users";
import { NextResponse } from "next/server";

connect();

export async function POST(req) {
  try {
    const { userId, playerId } = await req.json();

    if (!userId || !playerId) {
      return NextResponse.json(
        { error: "User ID and Player ID are required" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { onesignalPlayerId: playerId } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "OneSignal Player ID updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating OneSignal Player ID:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
