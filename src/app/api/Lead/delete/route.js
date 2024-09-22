import connect from "@/dbConfig/dbConfig";
import Leads from "@/models/Leads";
import { NextResponse } from "next/server";
import { checkPermission } from "../../permissions/checkPermission";

connect();

export async function DELETE(request) {
  if (!(await checkPermission(request, "export", "lead")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const reqBody = await request.json();
    const { leadIds } = reqBody;
    await Leads.deleteMany({ _id: { $in: leadIds } });
    return NextResponse.json({
      mesaaage: "Leads found",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
