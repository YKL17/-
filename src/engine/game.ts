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
        combatPower: 10,
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

  // Calculate combat power based on stats and rings
  updateCombatPower() {
    const basePower = this.state.attributes.spiritPower * 10 + this.state.attributes.strength * 2;
    const ringBonus = this.state.spiritRings.reduce((acc, ring) => {
        let bonus = 0;
        if (ring.type === 'White') bonus = 100;
        if (ring.type === 'Yellow') bonus = 500;
        if (ring.type === 'Purple') bonus = 2000;
        if (ring.type === 'Black') bonus = 10000;
        if (ring.type === 'Red') bonus = 100000;
        if (ring.type === 'Gold') bonus = 1000000;
        return acc + bonus;
    }, 0);
    this.state.attributes.combatPower = Math.floor(basePower + ringBonus);
  }

  // Determine what happens next month
  nextMonth() {
    this.updateCombatPower();
    this.state.month++;
    if (this.state.month > 12) {
      this.state.month = 1;
      this.state.year++;
    }

    // 1. Check for Story Triggers based on Year/Stats
    // Iterate through all events to find Story events that trigger
    const storyEvents = Object.values(EVENT_REGISTRY).filter(e => 
        e.type === 'Story' && e.trigger && e.trigger(this.state)
    );

    if (storyEvents.length > 0) {
        // Trigger the first valid story event (or handle priority if needed)
        this.triggerEvent(storyEvents[0].id);
        return;
    }

    // 2. Check for Random Events
    // 40% chance of a random event each month
    const roll = Math.random();
    if (roll < 0.4) {
        const potentialEvents = Object.values(EVENT_REGISTRY).filter(e => 
            e.type !== 'Story' && e.trigger && e.trigger(this.state)
        );

        if (potentialEvents.length > 0) {
            // Pick a random event from the potential list
            const randomEvent = potentialEvents[Math.floor(Math.random() * potentialEvents.length)];
            this.triggerEvent(randomEvent.id);
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
    // Rank 10, 20, 30... require rings.
    // If spiritPower is 10, 20, 30... AND spiritRings.length < rank/10, we are stuck.
    
    // Calculate current max level based on rings
    // 0 rings -> max 10
    // 1 ring -> max 20
    const maxLevel = (this.state.spiritRings.length + 1) * 10;
    
    if (this.state.attributes.spiritPower >= maxLevel) {
        // Bottleneck reached!
        this.triggerEvent('CULTIVATION_BREAKTHROUGH');
    } else {
        // Normal cultivation
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

  hunt() {
      // Check if player needs a ring
      const currentRingCount = this.state.spiritRings.length;
      const maxLevel = (currentRingCount + 1) * 10;
      
      if (this.state.attributes.spiritPower >= maxLevel) {
          this.triggerEvent('HUNT_SELECTION');
      } else {
          this.state.log.unshift(`[Year ${this.state.year} Month ${this.state.month}] 你目前的魂力还不需要猎取魂环。`);
      }
  }
}

export const gameEngine = new GameEngine();
