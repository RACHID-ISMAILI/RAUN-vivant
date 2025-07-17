import { users, capsules, comments, votes, type User, type InsertUser, type Capsule, type InsertCapsule, type Comment, type InsertComment, type Vote, type InsertVote } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Capsule methods
  getCapsules(): Promise<Capsule[]>;
  getCapsule(id: number): Promise<Capsule | undefined>;
  createCapsule(capsule: InsertCapsule): Promise<Capsule>;
  updateCapsuleLikes(id: number, likes: number): Promise<void>;
  updateCapsuleDislikes(id: number, dislikes: number): Promise<void>;
  
  // Comment methods
  getCommentsByCapsuleId(capsuleId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Vote methods
  getVote(capsuleId: number, username: string): Promise<Vote | undefined>;
  createVote(vote: InsertVote): Promise<Vote>;
  deleteVote(capsuleId: number, username: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private capsules: Map<number, Capsule>;
  private comments: Map<number, Comment>;
  private votes: Map<number, Vote>;
  private currentUserId: number;
  private currentCapsuleId: number;
  private currentCommentId: number;
  private currentVoteId: number;

  constructor() {
    this.users = new Map();
    this.capsules = new Map();
    this.comments = new Map();
    this.votes = new Map();
    this.currentUserId = 1;
    this.currentCapsuleId = 1;
    this.currentCommentId = 1;
    this.currentVoteId = 1;
    
    // Initialize with some default capsules
    this.initializeDefaultCapsules();
  }

  private initializeDefaultCapsules() {
    const defaultCapsules = [
      {
        content: "La conscience est comme un océan infini. Chaque pensée n'est qu'une vague à sa surface, mais l'essence demeure éternellement calme et profonde. Nous ne sommes pas nos pensées, nous sommes l'observateur silencieux qui les contemple.",
        likes: 24,
        dislikes: 2,
        createdAt: new Date(),
      },
      {
        content: "L'éveil n'est pas une destination mais un chemin. Chaque moment de présence authentique est une victoire contre l'illusion. Nous sommes déjà ce que nous cherchons à devenir.",
        likes: 18,
        dislikes: 1,
        createdAt: new Date(),
      },
      {
        content: "Dans le silence de l'esprit, toutes les réponses se révèlent. Ne cherchez pas à comprendre avec le mental, mais à ressentir avec le cœur. La vérité ne se pense pas, elle se vit.",
        likes: 31,
        dislikes: 0,
        createdAt: new Date(),
      },
    ];

    defaultCapsules.forEach((capsule) => {
      const id = this.currentCapsuleId++;
      this.capsules.set(id, { ...capsule, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCapsules(): Promise<Capsule[]> {
    return Array.from(this.capsules.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getCapsule(id: number): Promise<Capsule | undefined> {
    return this.capsules.get(id);
  }

  async createCapsule(insertCapsule: InsertCapsule): Promise<Capsule> {
    const id = this.currentCapsuleId++;
    const capsule: Capsule = {
      ...insertCapsule,
      id,
      likes: 0,
      dislikes: 0,
      createdAt: new Date(),
    };
    this.capsules.set(id, capsule);
    return capsule;
  }

  async updateCapsuleLikes(id: number, likes: number): Promise<void> {
    const capsule = this.capsules.get(id);
    if (capsule) {
      this.capsules.set(id, { ...capsule, likes });
    }
  }

  async updateCapsuleDislikes(id: number, dislikes: number): Promise<void> {
    const capsule = this.capsules.get(id);
    if (capsule) {
      this.capsules.set(id, { ...capsule, dislikes });
    }
  }

  async getCommentsByCapsuleId(capsuleId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.capsuleId === capsuleId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);
    return comment;
  }

  async getVote(capsuleId: number, username: string): Promise<Vote | undefined> {
    return Array.from(this.votes.values()).find(
      vote => vote.capsuleId === capsuleId && vote.username === username
    );
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const id = this.currentVoteId++;
    const vote: Vote = { ...insertVote, id };
    this.votes.set(id, vote);
    return vote;
  }

  async deleteVote(capsuleId: number, username: string): Promise<void> {
    const vote = Array.from(this.votes.entries()).find(
      ([_, v]) => v.capsuleId === capsuleId && v.username === username
    );
    if (vote) {
      this.votes.delete(vote[0]);
    }
  }
}

export const storage = new MemStorage();
