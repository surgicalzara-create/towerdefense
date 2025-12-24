export const CONF = {
    W: 800,
    H: 600,
    PATH: [
        { x: 0, y: 150 },
        { x: 150, y: 150 },
        { x: 150, y: 450 },
        { x: 400, y: 450 },
        { x: 400, y: 200 },
        { x: 650, y: 200 },
        { x: 650, y: 500 },
        { x: 800, y: 500 },
    ],
    TOWERS: {
        tiki: { name: 'Tiki', cost: 50, range: 130, dmg: 20, rate: 35, color: '#f59e0b' },
        volc: { name: 'Volcano', cost: 150, range: 170, dmg: 50, rate: 90, color: '#ef4444' },
    },
    REWARDS: { pirate: 20, crab: 40, ship: 100 },
} as const;

export type TowerType = keyof typeof CONF.TOWERS;
