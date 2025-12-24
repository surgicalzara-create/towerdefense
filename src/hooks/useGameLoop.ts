import { useEffect } from 'react';
import { GameEngine } from '../game/GameEngine';
import { useGameStore } from '../store/useGameStore';

export const useGameLoop = () => {
    const setStore = useGameStore((s) => s.set);

    useEffect(() => {
        const engine = GameEngine.getInstance();

        // Sync UI every 100ms to avoid React render thrashing
        const interval = setInterval(() => {
            setStore(engine.getState());
        }, 100);

        return () => clearInterval(interval);
    }, [setStore]);
};
