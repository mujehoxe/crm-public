import connect from "@/dbConfig/dbConfig";
import InvoiceFields from "@/models/InvoiceFields";
import InvoiceFieldTypes from "@/models/InvoiceFieldTypes";
import { NextResponse } from "next/server";
import { checkPermission } from "../../permissions/checkPermission";

InvoiceFieldTypes;

connect();

export async function GET(request, {}) {
  try {
    const fields = await InvoiceFields.find()
      .populate("type")
      .populate("visibleTo");

    return NextResponse.json({
      message: "Fields found",
      data: fields,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request) {
  if (!(await checkPermission("manage", "permissions")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { clientFields } = await request.json();

    for (const field of clientFields) {
      await InvoiceFields.findOneAndUpdate(
        { name: field.name },
        { $set: { visibleTo: field.visibleTo } },
        { runValidators: true, upsert: true }
      );
    }

    return NextResponse.json({
      message: "Invoice fields visiblity updated successfully",
    });
  } catch (error) {
    console.error("Error updating permissions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
