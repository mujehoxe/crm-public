import connect from "@/dbConfig/dbConfig";
import User from "@/models/Users";
import fs, { promises as fsPromises } from "fs";
import { NextResponse } from "next/server";
import path from "path";
import { cruPermitedRoles } from "../permissions";

connect();
export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value || "";
    const loggedUser = jwt.decode(token);

    if (!loggedUser || cruPermitedRoles.includesloggedUser.role)
      return NextResponse.json(
        { error: "You don't have permissions to add staff" },
        { status: 401 }
      );

    const reqBody = await request.json();
    const { files, userid } = reqBody;

    const uploadsDir = path.join(process.cwd(), "public", "documents");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    const filenames = [];

    await Promise.all(
      files.map(async (fileData) => {
        const { filename, data } = fileData;
        const filePath = path.join(uploadsDir, filename);
        await fsPromises.writeFile(filePath, data, "base64");
        console.log(`File ${filename} saved successfully`);
        filenames.push(filename);
      })
    );

    const user = await User.findById(userid);
    if (user.documents) {
      user.documents += `, ${filenames.join(", ")}`;
    } else {
      user.documents = filenames.join(", ");
    }
    await user.save();

    return NextResponse.json({
      message: "Document added",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
}
