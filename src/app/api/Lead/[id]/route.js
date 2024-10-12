import connect from "@/dbConfig/dbConfig";
import Leads from "@/models/Leads";
import { NextResponse } from "next/server";
import { checkPermission } from "../../permissions/checkPermission";

connect();

export async function GET(request, { params }) {
  if (!(await checkPermission("view", "lead")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const id = params.id;

    const lead = await Leads.findById(id).populate("Assigned");
    return NextResponse.json({
      mesaaage: "Leads found",
      data: lead,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
