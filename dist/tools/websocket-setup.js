import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerWebsocketSetupTools(server) {
    server.tool("ws_generate_server", "Generate a WebSocket server with connection handling, heartbeats, and message routing", {
        framework: z.enum(["ws", "socket.io", "uwebsockets"]).default("socket.io").describe("WebSocket library to use"),
        events: z.array(z.string()).describe("Custom event names to handle (e.g. 'chat:message', 'user:typing')"),
        include_auth: z.boolean().default(true).describe("Whether to include authentication middleware"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_ws_server",
                        instructions: `Generate a WebSocket server using ${params.framework}. Set up connection handling with heartbeat/ping-pong for stale connection detection. Create message handlers for events: ${params.events.join(", ")}. ${params.include_auth ? "Add JWT-based authentication middleware on connection handshake." : ""} Include graceful shutdown, error handling, connection tracking, and structured message serialization.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("ws_generate_client", "Generate a WebSocket client with auto-reconnect, event handling, and message queuing", {
        framework: z.enum(["ws", "socket.io-client", "native"]).default("socket.io-client").describe("Client library to use"),
        events: z.array(z.string()).describe("Events the client should listen for"),
        platform: z.enum(["browser", "node", "react-native"]).default("browser").describe("Target platform"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_ws_client",
                        instructions: `Generate a ${params.platform} WebSocket client using ${params.framework}. Implement auto-reconnect with exponential backoff, offline message queuing, and event listeners for: ${params.events.join(", ")}. Add connection state management, typed event emitters, and error handling with user-friendly status reporting.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("ws_add_rooms", "Pro: Add room/channel management with presence tracking and broadcasting", {
        room_types: z.array(z.string()).describe("Types of rooms to support (e.g. 'chat', 'game-lobby', 'dashboard')"),
        max_per_room: z.number().default(100).describe("Maximum connections per room"),
        include_presence: z.boolean().default(true).describe("Whether to track user presence in rooms"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier !== "pro") {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({ action: "upgrade_required", instructions: "The ws_add_rooms tool requires a Pro subscription. Please upgrade to access WebSocket room management." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "add_ws_rooms",
                        instructions: `Add room/channel management for room types: ${params.room_types.join(", ")}. Enforce max ${params.max_per_room} connections per room. ${params.include_presence ? "Implement presence tracking with join/leave events, online user lists, and idle detection." : ""} Add room-scoped broadcasting, private messaging within rooms, room metadata, and admin controls for kick/ban operations.`,
                    }, null, 2),
                },
            ],
        };
    });
}
