"""
sse_bus.py — Lightweight Server-Sent Events broadcast bus.

Usage (backend):
    import sse_bus
    sse_bus.emit_event("transactions_changed", user_id=1)

Usage (FastAPI endpoint):
    from fastapi.responses import StreamingResponse
    @app.get("/events/{user_id}")
    async def event_stream(user_id: int):
        return StreamingResponse(sse_bus.subscribe(user_id), media_type="text/event-stream", ...)
"""

import asyncio
import json
from typing import AsyncIterator

# Global list of (user_id, queue) pairs for connected clients.
_subscribers: list[tuple[int, asyncio.Queue]] = []


async def subscribe(user_id: int) -> AsyncIterator[str]:
    """Async generator that yields SSE-formatted strings for a given user."""
    q: asyncio.Queue = asyncio.Queue()
    _subscribers.append((user_id, q))
    try:
        # Send a heartbeat comment immediately so the browser knows the stream opened
        yield ": connected\n\n"
        while True:
            data = await q.get()
            yield data
    finally:
        # Clean up when the client disconnects
        _subscribers.remove((user_id, q))


def emit_event(event_type: str, user_id: int) -> None:
    """
    Broadcast a typed event to all connected SSE clients for the given user.
    Safe to call from synchronous code — uses put_nowait().
    """
    payload = json.dumps({"type": event_type, "user_id": user_id})
    message = f"data: {payload}\n\n"
    for (sub_user_id, q) in list(_subscribers):
        if sub_user_id == user_id:
            q.put_nowait(message)
