import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getCursorAPI } from "./cursor";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Cursor API routes
  app.post("/api/cursor/chat", async (req, res) => {
    try {
      const { message, systemPrompt } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const cursorAPI = getCursorAPI();
      const response = await cursorAPI.sendMessage(message, systemPrompt);

      res.json({ response });
    } catch (error: any) {
      console.error("Cursor API error:", error);
      res.status(500).json({ error: error.message || "Failed to communicate with Cursor API" });
    }
  });

  app.post("/api/cursor/completion", async (req, res) => {
    try {
      const { messages, model, temperature, max_tokens } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      const cursorAPI = getCursorAPI();
      const response = await cursorAPI.chatCompletion({
        messages,
        model,
        temperature,
        max_tokens,
      });

      res.json(response);
    } catch (error: any) {
      console.error("Cursor API error:", error);
      res.status(500).json({ error: error.message || "Failed to communicate with Cursor API" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
