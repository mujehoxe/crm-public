import connect from "@/dbConfig/dbConfig";
import User from "@/models/Users";
import axios from "axios";
import bcryptjs from "bcryptjs";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";
import { checkPermission } from "../../permissions/checkPermission";

connect();
async function addUserToOneSignalAndCRM(userDetails) {
  try {
    const oneSignalResponse = await axios.post(
      "https://onesignal.com/api/v1/players",
      {
        app_id: "7a7f495d-a3ba-45b4-aa8e-37bf796e6bc4",
        email: userDetails.email,
        device_type: 5,
        identifier: "uniqyuetext123",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic NzgxYmZjMzEtNjY1Mi00YzNhLTk3MDgtMGNlY2VkYzNjZDJj",
        },
      }
    );

    const playerID = oneSignalResponse.data.id;

    await User.updateOne(
      { email: userDetails.email },
      { onesignalPlayerId: playerID }
    );

    console.log("User added to OneSignal and player ID updated in CRM");
  } catch (error) {
    console.error(
      "Error adding user to OneSignal and updating player ID in CRM:",
      error
    );
  }
}

export async function POST(request) {
  if (!(await checkPermission("add", "staff")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const reqBody = await request.json();
    const {
      username,
      email,
      personalemail,
      password,
      Role,
      Phone,
      image,
      PrentStaff,
    } = reqBody;

    const dir = path.join(process.cwd(), "public", "users");

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const imagePath = path.join(dir, `${Date.now()}_${username}.png`);

    if (image)
      fs.writeFileSync(imagePath, Buffer.from(image, "base64"), {
        recursive: true,
      });

    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      personalemail,
      password: hashedPassword,
      Role,
      Phone,
      Avatar: imagePath.replace(path.join(process.cwd(), "public"), ""),
      PrentStaff,
    });

    const savedUser = await newUser.save();
    await addUserToOneSignalAndCRM({ email });

    return NextResponse.json({
      message: "User created",
      success: true,
      savedUser,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
