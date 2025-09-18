import { 
  type User, 
  type InsertUser,
  type RoomListing,
  type InsertRoomListing,
  type TiffinService,
  type InsertTiffinService,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type Requirement,
  type InsertRequirement,
  type Review,
  type InsertReview
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Room Listings
  getRoomListing(id: string): Promise<RoomListing | undefined>;
  getRoomListings(filters?: { location?: string; roomType?: string; minRent?: number; maxRent?: number }): Promise<RoomListing[]>;
  getRoomListingsByOwner(ownerId: string): Promise<RoomListing[]>;
  createRoomListing(listing: InsertRoomListing): Promise<RoomListing>;
  updateRoomListing(id: string, updates: Partial<InsertRoomListing>): Promise<RoomListing | undefined>;
  deleteRoomListing(id: string): Promise<boolean>;

  // Tiffin Services
  getTiffinService(id: string): Promise<TiffinService | undefined>;
  getTiffinServices(filters?: { foodType?: string; deliveryArea?: string; maxPrice?: number }): Promise<TiffinService[]>;
  getTiffinServicesByProvider(providerId: string): Promise<TiffinService[]>;
  createTiffinService(service: InsertTiffinService): Promise<TiffinService>;
  updateTiffinService(id: string, updates: Partial<InsertTiffinService>): Promise<TiffinService | undefined>;
  deleteTiffinService(id: string): Promise<boolean>;

  // Conversations
  getConversation(id: string): Promise<Conversation | undefined>;
  getConversationsByUser(userId: string): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  findOrCreateConversation(user1Id: string, user2Id: string): Promise<Conversation>;

  // Messages
  getMessage(id: string): Promise<Message | undefined>;
  getMessagesByConversation(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Requirements
  getRequirement(id: string): Promise<Requirement | undefined>;
  getRequirements(filters?: { type?: string; location?: string; isActive?: boolean }): Promise<Requirement[]>;
  getRequirementsByStudent(studentId: string): Promise<Requirement[]>;
  createRequirement(requirement: InsertRequirement): Promise<Requirement>;
  updateRequirement(id: string, updates: Partial<InsertRequirement>): Promise<Requirement | undefined>;

  // Reviews
  getReview(id: string): Promise<Review | undefined>;
  getReviewsByTarget(targetId: string, targetType: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private roomListings: Map<string, RoomListing> = new Map();
  private tiffinServices: Map<string, TiffinService> = new Map();
  private conversations: Map<string, Conversation> = new Map();
  private messages: Map<string, Message> = new Map();
  private requirements: Map<string, Requirement> = new Map();
  private reviews: Map<string, Review> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample Users
    const user1: User = {
      id: "user-1",
      email: "amit.singh@example.com",
      name: "Amit Singh",
      userType: "room_owner",
      college: null,
      profileImage: "",
      phoneNumber: "+91 98765 43210",
      createdAt: new Date()
    };

    const user2: User = {
      id: "user-2",
      email: "maa.ki.rasoi@example.com",
      name: "Maa Ki Rasoi",
      userType: "tiffin_provider",
      college: null,
      profileImage: "",
      phoneNumber: "+91 98765 43211",
      createdAt: new Date()
    };

    const user3: User = {
      id: "user-3",
      email: "zaika.express@example.com",
      name: "Zaika Express",
      userType: "tiffin_provider",
      college: null,
      profileImage: "",
      phoneNumber: "+91 98765 43212",
      createdAt: new Date()
    };

    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);
    this.users.set(user3.id, user3);

    // Sample Room Listings
    const room1: RoomListing = {
      id: "room-1",
      ownerId: user1.id,
      title: "Comfort PG Wright Town",
      description: "Single sharing AC room with attached bathroom, WiFi, and meals included. Located in the heart of Wright Town with easy access to colleges and markets.",
      rent: 4500,
      location: "Wright Town",
      area: "Wright Town",
      roomType: "single",
      amenities: ["AC", "WiFi", "Meals", "Laundry"],
      images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"],
      available: true,
      latitude: "23.1815",
      longitude: "79.9864",
      rating: "4.8",
      reviewCount: 45,
      createdAt: new Date()
    };

    const room2: RoomListing = {
      id: "room-2",
      ownerId: user1.id,
      title: "Student Haven Hostel",
      description: "Double sharing room with common kitchen, study area, and 24/7 security. Perfect for students looking for a budget-friendly option.",
      rent: 3200,
      location: "South Civil Lines",
      area: "South Civil Lines",
      roomType: "double",
      amenities: ["Kitchen", "Security", "Study Area"],
      images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"],
      available: true,
      latitude: "23.1685",
      longitude: "79.9338",
      rating: "4.3",
      reviewCount: 28,
      createdAt: new Date()
    };

    const room3: RoomListing = {
      id: "room-3",
      ownerId: user1.id,
      title: "Elite Stay Napier Town",
      description: "Private AC room with attached bathroom, balcony, and premium amenities. Ideal for those seeking luxury accommodation.",
      rent: 7800,
      location: "Napier Town",
      area: "Napier Town",
      roomType: "private",
      amenities: ["Private", "AC", "Balcony", "Premium"],
      images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"],
      available: true,
      latitude: "23.1645",
      longitude: "79.9432",
      rating: "4.9",
      reviewCount: 62,
      createdAt: new Date()
    };

    this.roomListings.set(room1.id, room1);
    this.roomListings.set(room2.id, room2);
    this.roomListings.set(room3.id, room3);

    // Sample Tiffin Services
    const tiffin1: TiffinService = {
      id: "tiffin-1",
      providerId: user2.id,
      name: "Maa Ki Rasoi",
      description: "Homestyle vegetarian meals with fresh rotis, sabzi, dal, and rice. Made with love and care using traditional recipes.",
      foodType: "vegetarian",
      lunchPrice: 80,
      dinnerPrice: 90,
      monthlyPrice: 2800,
      deliveryAreas: ["Wright Town", "Civil Lines"],
      deliveryFee: 0,
      images: ["https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"],
      available: true,
      rating: "4.8",
      reviewCount: 156,
      menuItems: [{"name": "Dal Rice", "price": 80}, {"name": "Sabzi Roti", "price": 70}],
      createdAt: new Date()
    };

    const tiffin2: TiffinService = {
      id: "tiffin-2",
      providerId: user3.id,
      name: "Zaika Express",
      description: "Authentic non-vegetarian meals with chicken, mutton, and fish specialties. Fresh ingredients and authentic flavors guaranteed.",
      foodType: "non_vegetarian",
      lunchPrice: 120,
      dinnerPrice: 140,
      monthlyPrice: 3600,
      deliveryAreas: ["Civil Lines", "Napier Town"],
      deliveryFee: 20,
      images: ["https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"],
      available: true,
      rating: "4.6",
      reviewCount: 89,
      menuItems: [{"name": "Chicken Curry", "price": 120}, {"name": "Mutton Biryani", "price": 140}],
      createdAt: new Date()
    };

    const tiffin3: TiffinService = {
      id: "tiffin-3",
      providerId: user2.id,
      name: "Healthy Bites",
      description: "Nutritious meals with salads, proteins, and balanced diet options. Perfect for health-conscious students.",
      foodType: "vegetarian",
      lunchPrice: 100,
      dinnerPrice: 110,
      monthlyPrice: 3200,
      deliveryAreas: ["Napier Town", "Wright Town"],
      deliveryFee: 0,
      images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"],
      available: true,
      rating: "4.9",
      reviewCount: 72,
      menuItems: [{"name": "Quinoa Salad", "price": 100}, {"name": "Protein Bowl", "price": 110}],
      createdAt: new Date()
    };

    this.tiffinServices.set(tiffin1.id, tiffin1);
    this.tiffinServices.set(tiffin2.id, tiffin2);
    this.tiffinServices.set(tiffin3.id, tiffin3);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Room Listings
  async getRoomListing(id: string): Promise<RoomListing | undefined> {
    return this.roomListings.get(id);
  }

  async getRoomListings(filters?: { location?: string; roomType?: string; minRent?: number; maxRent?: number }): Promise<RoomListing[]> {
    let listings = Array.from(this.roomListings.values()).filter(listing => listing.available);
    
    if (filters?.location) {
      listings = listings.filter(listing => 
        listing.location.toLowerCase().includes(filters.location!.toLowerCase()) ||
        listing.area.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    if (filters?.roomType) {
      listings = listings.filter(listing => listing.roomType === filters.roomType);
    }
    if (filters?.minRent) {
      listings = listings.filter(listing => listing.rent >= filters.minRent!);
    }
    if (filters?.maxRent) {
      listings = listings.filter(listing => listing.rent <= filters.maxRent!);
    }
    
    return listings.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getRoomListingsByOwner(ownerId: string): Promise<RoomListing[]> {
    return Array.from(this.roomListings.values()).filter(listing => listing.ownerId === ownerId);
  }

  async createRoomListing(insertListing: InsertRoomListing): Promise<RoomListing> {
    const id = randomUUID();
    const listing: RoomListing = { 
      ...insertListing, 
      id, 
      available: true,
      rating: "0",
      reviewCount: 0,
      createdAt: new Date() 
    };
    this.roomListings.set(id, listing);
    return listing;
  }

  async updateRoomListing(id: string, updates: Partial<InsertRoomListing>): Promise<RoomListing | undefined> {
    const listing = this.roomListings.get(id);
    if (!listing) return undefined;
    const updatedListing = { ...listing, ...updates };
    this.roomListings.set(id, updatedListing);
    return updatedListing;
  }

  async deleteRoomListing(id: string): Promise<boolean> {
    return this.roomListings.delete(id);
  }

  // Tiffin Services
  async getTiffinService(id: string): Promise<TiffinService | undefined> {
    return this.tiffinServices.get(id);
  }

  async getTiffinServices(filters?: { foodType?: string; deliveryArea?: string; maxPrice?: number }): Promise<TiffinService[]> {
    let services = Array.from(this.tiffinServices.values()).filter(service => service.available);
    
    if (filters?.foodType) {
      services = services.filter(service => 
        service.foodType === filters.foodType || service.foodType === 'both'
      );
    }
    if (filters?.deliveryArea) {
      services = services.filter(service => 
        service.deliveryAreas?.some(area => 
          area.toLowerCase().includes(filters.deliveryArea!.toLowerCase())
        )
      );
    }
    if (filters?.maxPrice) {
      services = services.filter(service => service.monthlyPrice <= filters.maxPrice!);
    }
    
    return services.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getTiffinServicesByProvider(providerId: string): Promise<TiffinService[]> {
    return Array.from(this.tiffinServices.values()).filter(service => service.providerId === providerId);
  }

  async createTiffinService(insertService: InsertTiffinService): Promise<TiffinService> {
    const id = randomUUID();
    const service: TiffinService = { 
      ...insertService, 
      id, 
      available: true,
      rating: "0",
      reviewCount: 0,
      createdAt: new Date() 
    };
    this.tiffinServices.set(id, service);
    return service;
  }

  async updateTiffinService(id: string, updates: Partial<InsertTiffinService>): Promise<TiffinService | undefined> {
    const service = this.tiffinServices.get(id);
    if (!service) return undefined;
    const updatedService = { ...service, ...updates };
    this.tiffinServices.set(id, updatedService);
    return updatedService;
  }

  async deleteTiffinService(id: string): Promise<boolean> {
    return this.tiffinServices.delete(id);
  }

  // Conversations
  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getConversationsByUser(userId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter(conv => conv.user1Id === userId || conv.user2Id === userId)
      .sort((a, b) => new Date(b.lastMessageAt!).getTime() - new Date(a.lastMessageAt!).getTime());
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = { 
      ...insertConversation, 
      id, 
      lastMessageAt: new Date(),
      createdAt: new Date() 
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async findOrCreateConversation(user1Id: string, user2Id: string): Promise<Conversation> {
    const existing = Array.from(this.conversations.values()).find(conv =>
      (conv.user1Id === user1Id && conv.user2Id === user2Id) ||
      (conv.user1Id === user2Id && conv.user2Id === user1Id)
    );
    
    if (existing) return existing;
    
    return this.createConversation({ user1Id, user2Id });
  }

  // Messages
  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = { ...insertMessage, id, createdAt: new Date() };
    this.messages.set(id, message);
    
    // Update conversation last message time
    const conversation = this.conversations.get(insertMessage.conversationId);
    if (conversation) {
      conversation.lastMessageAt = new Date();
      this.conversations.set(conversation.id, conversation);
    }
    
    return message;
  }

  // Requirements
  async getRequirement(id: string): Promise<Requirement | undefined> {
    return this.requirements.get(id);
  }

  async getRequirements(filters?: { type?: string; location?: string; isActive?: boolean }): Promise<Requirement[]> {
    let requirements = Array.from(this.requirements.values());
    
    if (filters?.type) {
      requirements = requirements.filter(req => req.type === filters.type);
    }
    if (filters?.location) {
      requirements = requirements.filter(req => 
        req.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    if (filters?.isActive !== undefined) {
      requirements = requirements.filter(req => req.isActive === filters.isActive);
    }
    
    return requirements.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getRequirementsByStudent(studentId: string): Promise<Requirement[]> {
    return Array.from(this.requirements.values())
      .filter(req => req.studentId === studentId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createRequirement(insertRequirement: InsertRequirement): Promise<Requirement> {
    const id = randomUUID();
    const requirement: Requirement = { 
      ...insertRequirement, 
      id, 
      isActive: true,
      createdAt: new Date() 
    };
    this.requirements.set(id, requirement);
    return requirement;
  }

  async updateRequirement(id: string, updates: Partial<InsertRequirement>): Promise<Requirement | undefined> {
    const requirement = this.requirements.get(id);
    if (!requirement) return undefined;
    const updatedRequirement = { ...requirement, ...updates };
    this.requirements.set(id, updatedRequirement);
    return updatedRequirement;
  }

  // Reviews
  async getReview(id: string): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getReviewsByTarget(targetId: string, targetType: string): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.targetId === targetId && review.targetType === targetType)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = { ...insertReview, id, createdAt: new Date() };
    this.reviews.set(id, review);
    
    // Update target rating
    const reviews = await this.getReviewsByTarget(insertReview.targetId, insertReview.targetType);
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    if (insertReview.targetType === 'room') {
      const listing = this.roomListings.get(insertReview.targetId);
      if (listing) {
        listing.rating = avgRating.toFixed(2);
        listing.reviewCount = reviews.length;
        this.roomListings.set(listing.id, listing);
      }
    } else if (insertReview.targetType === 'tiffin') {
      const service = this.tiffinServices.get(insertReview.targetId);
      if (service) {
        service.rating = avgRating.toFixed(2);
        service.reviewCount = reviews.length;
        this.tiffinServices.set(service.id, service);
      }
    }
    
    return review;
  }
}

export const storage = new MemStorage();
