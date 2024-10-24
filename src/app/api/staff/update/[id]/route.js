import { checkPermission } from "@/app/api/permissions/checkPermission";
import connect from "@/dbConfig/dbConfig";
import User from "@/models/Users";
import bcryptjs from "bcryptjs";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

connect();

export async function PUT(request, { params }) {
  if (!(await checkPermission("edit", "staff")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const reqBody = await request.json();
    const id = params.id;
    const {
      _id,
      username,
      email,
      personalemail,
      password,
      Role,
      Phone,
      file,
      image,
      PrentStaff,
    } = reqBody;

    let updatedFields = {
      username,
      email,
      personalemail,
      Role,
      Phone,
    };

    if (PrentStaff) updatedFields.PrentStaff = PrentStaff;

    if (password) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
      updatedFields.password = hashedPassword;
    }

    if (image) {
      const imagePath = path.join(
        process.cwd(),
        "public",
        "users",
        `${Date.now()}_${username}.png`
      );
      fs.writeFileSync(imagePath, Buffer.from(image, "base64"));
      updatedFields.Avatar = imagePath.replace(
        path.join(process.cwd(), "public"),
        ""
      );
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User updated",
      success: true,
      updatedUser,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
