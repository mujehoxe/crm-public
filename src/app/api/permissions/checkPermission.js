import Operation from "@/models/Operation";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function checkPermission(permission, module) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return false;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!user) return false;

    const operation = await Operation.findOne({ name: permission, module });

    if (!operation) return false;

    return operation.allowedRoles.includes(user.role);
  } catch (error) {
    console.error("Error checking permission:", error);
    throw error;
  }
}

export async function checkPermissionAndReturnUser(permission, module) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return { hasPermission: false, user: null };

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!user) return { hasPermission: false, user: null };

    const operation = await Operation.findOne({ name: permission, module });

    if (!operation) return { hasPermission: false, user };

    const hasPermission = operation.allowedRoles.includes(user.role);

    return { hasPermission, user };
  } catch (error) {
    console.error("Error checking permission:", error);
    throw error;
  }
}
