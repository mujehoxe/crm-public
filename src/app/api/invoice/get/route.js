import connect from "@/dbConfig/dbConfig";
import Invoice from "@/models/invoice";
import { NextResponse } from "next/server";
import { checkPermission } from "../../permissions/checkPermission";

connect();

export async function GET(request) {
  if (!(await checkPermission(request, "view_invoice", "deals_approval")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const invoices = await Invoice.find({})
      .populate("Userid")
      .populate("approvedby")
      .populate({
        path: "Leadid",
        populate: { path: "Source", select: "Source" },
      });
    return NextResponse.json({
      mesaaage: "invoices found",
      data: invoices,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
