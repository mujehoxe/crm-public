import Operation from "@/models/Operation";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function checkPermission(request, permission, module) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return false;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = decoded;

    if (!user) return false;

    const operation = await Operation.findOne({ name: permission, module });

    if (!operation) return false;

    return operation.allowedRoles.includes(user.role);
  } catch (error) {
    console.error("Error checking permission:", error);
    throw error;
  }
}
