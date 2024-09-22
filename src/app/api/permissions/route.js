import { NextResponse } from "next/server";
import { checkPermission } from "./checkPermission";
import connect from "@/dbConfig/dbConfig";
import Operation from "@/models/Operation";
import Role from "@/models/Role";

connect();

export async function GET(request) {
  if (!(await checkPermission(request, "manage", "permissions")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const groupedOperations = await Operation.groupByModule();

    const permissionsMap = {};
    groupedOperations.forEach((module) => {
      permissionsMap[module._id] = module.operations;
    });

    const roles = (await Role.find({})).map((r) => r.name);

    return NextResponse.json({ permissionsMap, roles });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  if (!(await checkPermission(request, "manage", "permissions"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { modules } = await request.json();

    for (const [moduleName, operations] of Object.entries(modules)) {
      for (const operation of operations) {
        await Operation.findOneAndUpdate(
          { name: operation.name, module: moduleName },
          { $set: { allowedRoles: operation.allowedRoles } },
          { runValidators: true, upsert: true }
        );
      }
    }

    return NextResponse.json({ message: "Permissions updated successfully" });
  } catch (error) {
    console.error("Error updating permissions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
