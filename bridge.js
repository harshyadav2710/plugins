import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import readline from "readline";

const token = process.env.ASKCRUZ_API_TOKEN;
if (!token) {
  console.error("ASKCRUZ_API_TOKEN is missing");
  process.exit(1);
}

const transport = new SSEClientTransport(
  new URL("https://mcp.askcruz.com/internal-team/mcp/sse"),
  {
    eventSourceInit: {
      headers: {
        "x-auth-token": token
      }
    },
    requestInit: {
      headers: {
        "x-auth-token": token
      }
    }
  }
);

transport.onmessage = (message) => {
  console.log(JSON.stringify(message));
};

transport.onerror = (error) => {
  console.error("Transport error:", error);
};

transport.onclose = () => {
  process.exit(0);
};

await transport.start();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on("line", async (line) => {
  try {
    const message = JSON.parse(line);
    await transport.send(message);
  } catch (error) {
    console.error("Failed to parse or send message:", error);
  }
});
