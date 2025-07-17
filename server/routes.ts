import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCapsuleSchema, insertCommentSchema, insertVoteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session management
  let currentUser: string | null = null;

  // Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);
      
      let user = await storage.getUserByUsername(username);
      if (!user) {
        // Create user if doesn't exist (simple auth)
        user = await storage.createUser({ username, password });
      } else if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      currentUser = username;
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    currentUser = null;
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!currentUser) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json({ username: currentUser });
  });

  // Capsules
  app.get("/api/capsules", async (req, res) => {
    try {
      const capsules = await storage.getCapsules();
      res.json(capsules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch capsules" });
    }
  });

  app.post("/api/capsules", async (req, res) => {
    if (!currentUser) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const capsuleData = insertCapsuleSchema.parse(req.body);
      const capsule = await storage.createCapsule(capsuleData);
      res.json(capsule);
    } catch (error) {
      res.status(400).json({ message: "Invalid capsule data" });
    }
  });

  // Comments
  app.get("/api/capsules/:id/comments", async (req, res) => {
    try {
      const capsuleId = parseInt(req.params.id);
      const comments = await storage.getCommentsByCapsuleId(capsuleId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/capsules/:id/comments", async (req, res) => {
    if (!currentUser) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const capsuleId = parseInt(req.params.id);
      const commentData = insertCommentSchema.parse({
        ...req.body,
        capsuleId,
        username: currentUser,
      });
      const comment = await storage.createComment(commentData);
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data" });
    }
  });

  // Votes
  app.post("/api/capsules/:id/vote", async (req, res) => {
    if (!currentUser) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const capsuleId = parseInt(req.params.id);
      const { type } = z.object({ type: z.enum(["like", "dislike"]) }).parse(req.body);
      
      const capsule = await storage.getCapsule(capsuleId);
      if (!capsule) {
        return res.status(404).json({ message: "Capsule not found" });
      }
      
      const existingVote = await storage.getVote(capsuleId, currentUser);
      
      if (existingVote) {
        if (existingVote.type === type) {
          // Remove vote if same type
          await storage.deleteVote(capsuleId, currentUser);
          
          if (type === "like") {
            await storage.updateCapsuleLikes(capsuleId, capsule.likes - 1);
          } else {
            await storage.updateCapsuleDislikes(capsuleId, capsule.dislikes - 1);
          }
        } else {
          // Change vote type
          await storage.deleteVote(capsuleId, currentUser);
          await storage.createVote({ capsuleId, username: currentUser, type });
          
          if (type === "like") {
            await storage.updateCapsuleLikes(capsuleId, capsule.likes + 1);
            await storage.updateCapsuleDislikes(capsuleId, capsule.dislikes - 1);
          } else {
            await storage.updateCapsuleLikes(capsuleId, capsule.likes - 1);
            await storage.updateCapsuleDislikes(capsuleId, capsule.dislikes + 1);
          }
        }
      } else {
        // Create new vote
        await storage.createVote({ capsuleId, username: currentUser, type });
        
        if (type === "like") {
          await storage.updateCapsuleLikes(capsuleId, capsule.likes + 1);
        } else {
          await storage.updateCapsuleDislikes(capsuleId, capsule.dislikes + 1);
        }
      }
      
      const updatedCapsule = await storage.getCapsule(capsuleId);
      res.json(updatedCapsule);
    } catch (error) {
      res.status(400).json({ message: "Invalid vote data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
