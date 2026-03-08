import { GameState, GameEvent, EVENTS } from './types';
import { EVENTS as EVENT_REGISTRY } from './events';

export class GameEngine {
  state: GameState;
  currentEvent: GameEvent | null = null;

  constructor() {
    this.state = this.getInitialState();
  }

  getInitialState(): GameState {
    return {
      year: 1,
      month: 1,
      name: 'Player',
      gender: 'Male',
      martialSoul: 'None',
      attributes: {
        spiritPower: 1,
        rank: 1,
        health: 100,
        maxHealth: 100,
        wealth: 100,
        appearance: 50,
        intelligence: 50,
        strength: 50
      },
      relationships: {},
      flags: {},
      inventory: [],
      spiritRings: [],
      currentLocation: 'Unknown',
      faction: 'Neutral',
      log: []
    };
  }

  startGame() {
    this.state = this.getInitialState();
    this.triggerEvent('START_GAME');
  }

  triggerEvent(eventId: string) {
    const event = EVENT_REGISTRY[eventId];
    if (event) {
      this.currentEvent = event;
    }
  }

  // Determine what happens next month
  nextMonth() {
    this.state.month++;
    if (this.state.month > 12) {
      this.state.month = 1;
      this.state.year++;
    }

    // 1. Check for Story Triggers based on Year/Stats
    if (this.state.year === 6 && this.state.month === 1 && !this.state.flags['awakened']) {
       // Usually handled by start game flow, but just in case
    }

    // 2. Check for Random Events based on Location
    const roll = Math.random();
    if (roll < 0.2) {
        // 20% chance of random event
        // Simplified: just one random event for now
        if (this.state.currentLocation.includes('学院')) {
            this.triggerEvent('MEET_XIAO_WU');
            return;
        }
    }

    // 3. If no event, return control to user (null event)
    this.currentEvent = null;
  }

  handleOption(optionIndex: number) {
    if (!this.currentEvent) return;
    
    const option = this.currentEvent.options[optionIndex];
    if (option.action) {
      option.action(this.state);
    }

    if (option.nextEventId) {
      this.triggerEvent(option.nextEventId);
    } else {
      this.currentEvent = null;
    }
  }

  // Actions available in the UI
  cultivate() {
    // Check for bottlenecks
    const rankCap = (Math.floor(this.state.attributes.rank / 10) + 1) * 10;
    // e.g. Rank 10, 20, 30. 
    // If spiritPower is high enough to reach next rank but we don't have enough rings
    const requiredRings = Math.floor(this.state.attributes.rank / 10);
    
    if (this.state.attributes.spiritPower >= rankCap && this.state.spiritRings.length < requiredRings) {
        this.triggerEvent('CULTIVATION_BREAKTHROUGH');
    } else {
        this.triggerEvent('CULTIVATION_NORMAL');
    }
    this.nextMonth();
  }

  explore() {
      // Simple exploration logic
      const roll = Math.random();
      if (roll < 0.5) {
          this.state.attributes.wealth += 10;
          this.state.log.unshift(`[Year ${this.state.year} Month ${this.state.month}] 你在探索中发现了一些金魂币。`);
      } else {
          this.state.log.unshift(`[Year ${this.state.year} Month ${this.state.month}] 你探索了一番，什么也没发现。`);
      }
      this.nextMonth();
  }

  rest() {
      this.state.attributes.health = Math.min(this.state.attributes.health + 20, this.state.attributes.maxHealth);
      this.state.log.unshift(`[Year ${this.state.year} Month ${this.state.month}] 你休息了几天，体力恢复了。`);
      this.nextMonth();
  }
}

export const gameEngine = new GameEngine();
