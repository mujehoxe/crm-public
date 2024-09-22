import { cookies } from "next/headers";

import PermissionsManagement from "./PermissionsManagement";

async function getInitialPermissions() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch("http://localhost:3000/api/permissions", {
    headers: {
      Cookie: `token=${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch permissions " + res.statusText);
  return res.json();
}

export default async function PermissionsPage() {
  let initialPermissions, roles;
  try {
    const { permissionsMap, roles: rs } = await getInitialPermissions();
    initialPermissions = permissionsMap;
    roles = rs;
  } catch (error) {
    console.error("Error fetching initial permissions:", error);
    return <div>Error loading permissions: {error.message}</div>;
  }

  if (!initialPermissions) {
    return <div>No permissions loaded</div>;
  }

  return (
    <PermissionsManagement initialModules={initialPermissions} roles={roles} />
  );
}
