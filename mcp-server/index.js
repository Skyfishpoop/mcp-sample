import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = "http://localhost:3000";

const server = new McpServer({
  name: "books-api",
  version: "1.0.0",
});

server.registerTool(
  "list_books",
  {
    description: "登録されている書籍を一覧取得する",
  },
  async () => {
    const res = await fetch(`${API_BASE}/books`);
    const data = await res.json();
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);

server.registerTool(
  "add_book",
  {
    description: "新しい書籍を追加する",
    inputSchema: {
      title: z.string().describe("書籍タイトル"),
      author: z.string().optional().describe("著者名(省略可)"),
    },
  },
  async ({ title, author }) => {
    const res = await fetch(`${API_BASE}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author: author ?? "" }),
    });
    const data = await res.json();
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
