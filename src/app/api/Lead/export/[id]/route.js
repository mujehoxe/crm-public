import { checkPermission } from "@/app/api/permissions/checkPermission";
import connect from "@/dbConfig/dbConfig";
import Leads from "@/models/Leads";
import { NextResponse } from "next/server";
import Papa from "papaparse";

connect();

export async function POST(request, { params }) {
  if (!(await checkPermission("export", "lead")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const id = params.id;

    const lead = await Leads.find({ LeadType: id });
    const csv = Papa.unparse(
      lead.map((lead) => ({
        Name: lead.Name,
        Email: lead.Email,
        Phone: lead.Phone,
        Description: lead.Description,
        LeadStatus: lead.LeadStatus,
      }))
    );

    return new Response(csv, {
      headers: {
        "Content-Disposition": 'attachment; filename="leads.csv"',
        "Content-Type": "text/csv",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
