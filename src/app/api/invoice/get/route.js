import connect from "@/dbConfig/dbConfig";
import Invoice from "@/models/invoice";
import InvoiceFields from "@/models/InvoiceFields";
import { NextResponse } from "next/server";
import { checkPermissionAndReturnUser } from "../../permissions/checkPermission";

await import("@/models/Source");
await import("@/models/Users");
await import("@/models/Role");

connect();

export async function GET(request) {
  const { hasPermission, user } = await checkPermissionAndReturnUser(
    "view_invoice",
    "deals_approval"
  );

  if (!hasPermission)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const populatedInvoiceFields = await InvoiceFields.find()
      .populate("visibleTo")
      .exec();

    const visibleFields = populatedInvoiceFields.filter((field) => {
      return field.visibleTo.some((role) => role.name === user.role);
    });

    // Create a projection object based on the visible fields
    const projection = {};
    visibleFields.forEach((field) => {
      projection[field.value] = 1;
    });

    if (projection.Comission) projection.ComissionType = 1;

    const invoices = await Invoice.find({}, projection)
      .populate("Userid")
      .populate("approvedby")
      .populate({
        path: "Leadid",
        populate: { path: "Source", select: "Source" },
      });

    return NextResponse.json({
      message: "invoices found",
      data: invoices,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
