import { addSSEConnection, removeSSEConnection } from "@/models/Activity";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(req) {
  const connectionId = uuidv4();
  console.log(`New SSE connection attempt. ID: ${connectionId}`);

  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  let intervalId;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const sendMessage = (message) => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(message)}\n\n`)
          );
        } catch (error) {
          console.error(
            `Failed to send message for connection ${connectionId}:`,
            error
          );
          cleanup();
        }
      };

      const cleanup = () => {
        clearInterval(intervalId);
        removeSSEConnection(connectionId);
        try {
          controller.close();
        } catch (error) {
          console.error(
            `Error closing controller for connection ${connectionId}:`,
            error
          );
        }
      };

      sendMessage({ type: "connected", id: connectionId });

      intervalId = setInterval(() => {
        sendMessage({ type: "heartbeat" });
      }, 15000);

      addSSEConnection(connectionId, {
        write: sendMessage,
        close: cleanup,
      });

      req.signal.addEventListener("abort", cleanup);
    },
    cancel() {
      console.log(`SSE connection ${connectionId} cancelled`);
      clearInterval(intervalId);
      removeSSEConnection(connectionId);
    },
  });

  return new NextResponse(stream, { headers });
}
