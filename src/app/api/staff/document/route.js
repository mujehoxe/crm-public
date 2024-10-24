import connect from "@/dbConfig/dbConfig";
import User from "@/models/Users";
import fs, { promises as fsPromises } from "fs";
import { NextResponse } from "next/server";
import path from "path";
import { checkPermission } from "../../permissions/checkPermission";

connect();
export async function POST(request) {
  if (!(await checkPermission("upload_document", "staff")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
