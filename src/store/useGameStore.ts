import { create } from 'zustand';
import type { GameState } from '../game/GameEngine';

// Extend GameState with setter
interface GameStore extends GameState {
    set: (state: Partial<GameState>) => void;
}

export const useGameStore = create<GameStore>((set) => ({
    money: 500,
    lives: 20,
    wave: 1,
    active: false,
    spawnQueue: [],
    spawnTimer: 0,
    waveRunning: false,
    buildType: null,
    selectedTowerId: null,
    powerCD: 0,
    set: (updater) => set(updater),
}));
