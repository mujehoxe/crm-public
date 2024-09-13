// src/app/api/sse-proxy/route.ts
import {NextResponse} from 'next/server';

export async function GET(req) {
	new URL(req.url);
	const url = new URL('http://65.20.87.36:8080/events');

	try {
		const response = await fetch(url, {
			headers: {
				'Accept': 'text/event-stream',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive',
			},
		});

		if (!response.ok)
			return new NextResponse('SSE server error', {status: response.status});

		const stream = new ReadableStream({
			async start(controller) {
				const reader = response.body?.getReader();
				if (!reader) {
					controller.close();
					return;
				}

				const textDecoder = new TextDecoder();
				while (true) {
					const {done, value} = await reader.read();
					if (done) break;

					const chunk = textDecoder.decode(value);
					const lines = chunk.split('\n');

					for (const line of lines) {
						if (line.startsWith('data:')) {
							// Forward the data as-is, without trying to parse or modify it
							controller.enqueue(line + '\n\n');
						}
					}
				}
				controller.close();
			},
		});

		return new NextResponse(stream, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive',
			},
		});
	} catch (error) {
		console.error('Error in SSE proxy:', error);
		return new NextResponse('Internal Server Error', {status: 500});
	}
}