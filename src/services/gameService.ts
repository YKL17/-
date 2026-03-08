import { GoogleGenAI } from "@google/genai";
import { DOULUO_SYSTEM_PROMPT } from "../constants";

// Initialize Gemini Client
// Note: We use process.env.GEMINI_API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface GameState {
  name: string;
  gender: string;
  age: number;
  martialSoul: string;
  rank: number;
  spiritPower: number;
  health: number;
  maxHealth: number;
  location: string;
  inventory: string[];
  spiritRings: {
    name: string;
    age: number;
    color: string;
    skill: string;
    description: string;
  }[];
  skills: string[];
  status: string;
}

export interface GameResponse {
  narrative: string;
  newState: GameState | null;
}

export class GameService {
  private model: any;
  private chat: any;
  private lastState: GameState | null = null;

  constructor() {
    this.model = "gemini-2.5-flash"; // Using a fast model for responsiveness
    this.startNewGame();
  }

  startNewGame(customPrompt?: string) {
    this.chat = ai.chats.create({
      model: this.model,
      config: {
        systemInstruction: customPrompt || DOULUO_SYSTEM_PROMPT,
      },
    });
    this.lastState = null;
  }

  async sendMessage(message: string, currentState?: GameState): Promise<GameResponse> {
    try {
      // If we have state, we might want to inject it to remind the model, 
      // but the chat history should handle it. 
      // However, for robustness, we can append a hidden context if needed.
      // For now, we rely on the model following the system instruction to output JSON.

      const response = await this.chat.sendMessage({ message });
      const text = response.text;

      // Parse JSON state and Narrative
      const { narrative, newState } = this.parseResponse(text);

      if (newState) {
        this.lastState = newState;
      }

      return { narrative, newState: this.lastState };
    } catch (error) {
      console.error("Game Service Error:", error);
      return {
        narrative: "与精神世界的连接不稳定。请重试。",
        newState: this.lastState,
      };
    }
  }

  private parseResponse(text: string): { narrative: string; newState: GameState | null } {
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonRegex);

    let newState: GameState | null = null;
    let narrative = text;

    if (match) {
      try {
        newState = JSON.parse(match[1]);
        // Remove the JSON block from the narrative to show the user
        narrative = text.replace(match[0], "").trim();
      } catch (e) {
        console.error("Failed to parse game state JSON", e);
      }
    }

    return { narrative, newState };
  }
}

export const gameService = new GameService();
