export type Faction = 'Neutral' | 'Shrek' | 'SpiritHall';

export interface CharacterAttributes {
  spiritPower: number; // 0-100 (Rank 100 = God)
  rank: number; // 1-99
  health: number;
  maxHealth: number;
  wealth: number; // Gold coins
  appearance: number;
  intelligence: number;
  strength: number;
}

export interface Relationship {
  name: string;
  affection: number; // 0-100
  status: 'Stranger' | 'Acquaintance' | 'Friend' | 'Crush' | 'Lover' | 'Wife' | 'Enemy';
  avatar?: string;
  faction: Faction;
  description: string;
}

export interface GameState {
  year: number;
  month: number;
  name: string;
  gender: 'Male' | 'Female';
  martialSoul: string;
  attributes: CharacterAttributes;
  relationships: Record<string, Relationship>;
  flags: Record<string, boolean>; // For story triggers
  inventory: string[];
  spiritRings: string[];
  currentLocation: string;
  faction: Faction;
  log: string[]; // History of actions
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  image?: string; // Placeholder for future AI image integration
  type: 'Story' | 'Random' | 'Cultivation' | 'Battle' | 'Romance';
  trigger?: (state: GameState) => boolean;
  options: EventOption[];
}

export interface EventOption {
  text: string;
  condition?: (state: GameState) => boolean;
  action: (state: GameState) => Partial<GameState> | void; // Returns state updates
  nextEventId?: string; // Chain events
}
