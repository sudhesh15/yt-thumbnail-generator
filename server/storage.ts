import { type User, type InsertUser, type ThumbnailRequest, type InsertThumbnailRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getThumbnailRequest(id: string): Promise<ThumbnailRequest | undefined>;
  createThumbnailRequest(request: InsertThumbnailRequest): Promise<ThumbnailRequest>;
  updateThumbnailRequest(id: string, updates: Partial<ThumbnailRequest>): Promise<ThumbnailRequest>;
  getThumbnailRequestsByStatus(status: string): Promise<ThumbnailRequest[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private thumbnailRequests: Map<string, ThumbnailRequest>;

  constructor() {
    this.users = new Map();
    this.thumbnailRequests = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getThumbnailRequest(id: string): Promise<ThumbnailRequest | undefined> {
    return this.thumbnailRequests.get(id);
  }

  async createThumbnailRequest(insertRequest: InsertThumbnailRequest): Promise<ThumbnailRequest> {
    const id = randomUUID();
    const request: ThumbnailRequest = {
      ...insertRequest,
      id,
      refinedPrompt: null,
      generatedImagePath: null,
      status: "pending",
      createdAt: new Date(),
      uploadedImagePath: insertRequest.uploadedImagePath || null,
    };
    this.thumbnailRequests.set(id, request);
    return request;
  }

  async updateThumbnailRequest(id: string, updates: Partial<ThumbnailRequest>): Promise<ThumbnailRequest> {
    const existing = this.thumbnailRequests.get(id);
    if (!existing) {
      throw new Error(`Thumbnail request with id ${id} not found`);
    }
    const updated = { ...existing, ...updates };
    this.thumbnailRequests.set(id, updated);
    return updated;
  }

  async getThumbnailRequestsByStatus(status: string): Promise<ThumbnailRequest[]> {
    return Array.from(this.thumbnailRequests.values()).filter(
      (request) => request.status === status
    );
  }
}

export const storage = new MemStorage();
