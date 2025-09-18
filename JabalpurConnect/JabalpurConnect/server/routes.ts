import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertRoomListingSchema, insertTiffinServiceSchema, insertMessageSchema, insertRequirementSchema, insertReviewSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time messaging
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Map<string, WebSocket>();

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const userId = url.searchParams.get('userId');
    
    if (userId) {
      clients.set(userId, ws);
    }

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'send_message') {
          const newMessage = await storage.createMessage({
            conversationId: message.conversationId,
            senderId: message.senderId,
            content: message.content,
            messageType: message.messageType || 'text'
          });

          // Send to recipient
          const conversation = await storage.getConversation(message.conversationId);
          if (conversation) {
            const recipientId = conversation.user1Id === message.senderId ? conversation.user2Id : conversation.user1Id;
            const recipientWs = clients.get(recipientId);
            
            if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
              recipientWs.send(JSON.stringify({
                type: 'new_message',
                message: newMessage
              }));
            }
          }

          // Send confirmation back to sender
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'message_sent',
              message: newMessage
            }));
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (userId) {
        clients.delete(userId);
      }
    });
  });

  // Auth routes
  app.post("/api/auth/google", async (req, res) => {
    try {
      const { email, name, userType, college, profileImage } = req.body;
      
      let user = await storage.getUserByEmail(email);
      if (!user) {
        user = await storage.createUser({
          email,
          name,
          userType,
          college,
          profileImage
        });
      }
      
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Authentication failed" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const updates = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  // Room listings routes
  app.get("/api/rooms", async (req, res) => {
    const { location, roomType, minRent, maxRent } = req.query;
    const filters = {
      location: location as string,
      roomType: roomType as string,
      minRent: minRent ? parseInt(minRent as string) : undefined,
      maxRent: maxRent ? parseInt(maxRent as string) : undefined
    };
    
    const rooms = await storage.getRoomListings(filters);
    res.json(rooms);
  });

  app.get("/api/rooms/:id", async (req, res) => {
    const room = await storage.getRoomListing(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });
    res.json(room);
  });

  app.post("/api/rooms", async (req, res) => {
    try {
      const roomData = insertRoomListingSchema.parse(req.body);
      const room = await storage.createRoomListing(roomData);
      res.status(201).json(room);
    } catch (error) {
      res.status(400).json({ error: "Invalid room data" });
    }
  });

  app.put("/api/rooms/:id", async (req, res) => {
    try {
      const updates = insertRoomListingSchema.partial().parse(req.body);
      const room = await storage.updateRoomListing(req.params.id, updates);
      if (!room) return res.status(404).json({ error: "Room not found" });
      res.json(room);
    } catch (error) {
      res.status(400).json({ error: "Invalid room data" });
    }
  });

  app.delete("/api/rooms/:id", async (req, res) => {
    const deleted = await storage.deleteRoomListing(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Room not found" });
    res.status(204).send();
  });

  app.get("/api/users/:id/rooms", async (req, res) => {
    const rooms = await storage.getRoomListingsByOwner(req.params.id);
    res.json(rooms);
  });

  // Tiffin services routes
  app.get("/api/tiffin", async (req, res) => {
    const { foodType, deliveryArea, maxPrice } = req.query;
    const filters = {
      foodType: foodType as string,
      deliveryArea: deliveryArea as string,
      maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined
    };
    
    const services = await storage.getTiffinServices(filters);
    res.json(services);
  });

  app.get("/api/tiffin/:id", async (req, res) => {
    const service = await storage.getTiffinService(req.params.id);
    if (!service) return res.status(404).json({ error: "Tiffin service not found" });
    res.json(service);
  });

  app.post("/api/tiffin", async (req, res) => {
    try {
      const serviceData = insertTiffinServiceSchema.parse(req.body);
      const service = await storage.createTiffinService(serviceData);
      res.status(201).json(service);
    } catch (error) {
      res.status(400).json({ error: "Invalid tiffin service data" });
    }
  });

  app.put("/api/tiffin/:id", async (req, res) => {
    try {
      const updates = insertTiffinServiceSchema.partial().parse(req.body);
      const service = await storage.updateTiffinService(req.params.id, updates);
      if (!service) return res.status(404).json({ error: "Tiffin service not found" });
      res.json(service);
    } catch (error) {
      res.status(400).json({ error: "Invalid tiffin service data" });
    }
  });

  app.delete("/api/tiffin/:id", async (req, res) => {
    const deleted = await storage.deleteTiffinService(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Tiffin service not found" });
    res.status(204).send();
  });

  app.get("/api/users/:id/tiffin", async (req, res) => {
    const services = await storage.getTiffinServicesByProvider(req.params.id);
    res.json(services);
  });

  // Conversation routes
  app.get("/api/users/:id/conversations", async (req, res) => {
    const conversations = await storage.getConversationsByUser(req.params.id);
    res.json(conversations);
  });

  app.post("/api/conversations", async (req, res) => {
    try {
      const { user1Id, user2Id } = req.body;
      const conversation = await storage.findOrCreateConversation(user1Id, user2Id);
      res.json(conversation);
    } catch (error) {
      res.status(400).json({ error: "Invalid conversation data" });
    }
  });

  // Message routes
  app.get("/api/conversations/:id/messages", async (req, res) => {
    const messages = await storage.getMessagesByConversation(req.params.id);
    res.json(messages);
  });

  // Requirements routes
  app.get("/api/requirements", async (req, res) => {
    const { type, location, isActive } = req.query;
    const filters = {
      type: type as string,
      location: location as string,
      isActive: isActive === 'true'
    };
    
    const requirements = await storage.getRequirements(filters);
    res.json(requirements);
  });

  app.get("/api/users/:id/requirements", async (req, res) => {
    const requirements = await storage.getRequirementsByStudent(req.params.id);
    res.json(requirements);
  });

  app.post("/api/requirements", async (req, res) => {
    try {
      const requirementData = insertRequirementSchema.parse(req.body);
      const requirement = await storage.createRequirement(requirementData);
      res.status(201).json(requirement);
    } catch (error) {
      res.status(400).json({ error: "Invalid requirement data" });
    }
  });

  app.put("/api/requirements/:id", async (req, res) => {
    try {
      const updates = insertRequirementSchema.partial().parse(req.body);
      const requirement = await storage.updateRequirement(req.params.id, updates);
      if (!requirement) return res.status(404).json({ error: "Requirement not found" });
      res.json(requirement);
    } catch (error) {
      res.status(400).json({ error: "Invalid requirement data" });
    }
  });

  // Review routes
  app.get("/api/reviews/:targetId/:targetType", async (req, res) => {
    const { targetId, targetType } = req.params;
    const reviews = await storage.getReviewsByTarget(targetId, targetType);
    res.json(reviews);
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ error: "Invalid review data" });
    }
  });

  return httpServer;
}
