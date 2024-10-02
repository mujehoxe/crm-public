import { addSSEConnection, removeSSEConnection } from "@/models/Activity";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  addSSEConnection(writer);

  req.signal.addEventListener("abort", () => {
    removeSSEConnection(writer);
    writer.close();
  });

  return new NextResponse(readable, { headers });
}
