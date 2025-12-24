import { CONF, type TowerType } from '../config/constants';
import { Enemy, type EnemyType } from './entities/Enemy';
import { Tower } from './entities/Tower';
import { Projectile } from './entities/Projectile';
import { WaveManager } from './WaveManager';

export interface Particle {
    x: number;
    y: number;
    life: number;
    color?: string;
    type?: 'wave' | 'blood' | 'smoke';
}

export interface GameState {
    money: number;
    lives: number;
    wave: number;
    active: boolean;
    spawnQueue: EnemyType[];
    spawnTimer: number;
    waveRunning: boolean;
    buildType: TowerType | null;
    selectedTowerId: string | null;
    powerCD: number;
}

export class GameEngine {
    private static instance: GameEngine;

    public state: GameState;
    public enemies: Enemy[] = [];
    public towers: Tower[] = [];
    public projectiles: Projectile[] = [];
    public particles: Particle[] = [];

    private loopId: number | null = null;
    private waveManager: WaveManager;

    private constructor() {
        this.state = {
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
        };
        this.waveManager = new WaveManager(this);
    }

    public static getInstance(): GameEngine {
        if (!GameEngine.instance) {
            GameEngine.instance = new GameEngine();
        }
        return GameEngine.instance;
    }

    public start() {
        if (this.loopId) return;
        this.state.active = true;
        this.loop();
    }

    public startWave() {
        this.waveManager.startWave(this.state.wave);
    }

    public stop() {
        if (this.loopId) {
            cancelAnimationFrame(this.loopId);
            this.loopId = null;
        }
        this.state.active = false;
    }

    private loop = (_time?: number) => {
        if (!this.state.active) return;
        this.update();
        this.loopId = requestAnimationFrame(this.loop);
    };

    private update() {
        // Wave Logic
        this.waveManager.update();

        if (this.state.powerCD > 0) this.state.powerCD--;

        // Towers
        this.towers.forEach(t => {
            const target = t.update(this.enemies);
            if (target) {
                this.projectiles.push(new Projectile(
                    t.x, t.y, target, t.damage, 12,
                    t.type === 'volc' ? '#ef4444' : '#fff',
                    t.type === 'volc'
                ));
            }
        });

        // Projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            const hit = p.update();
            if (hit) {
                this.particles.push({ x: p.x, y: p.y, color: '#fff', life: 0.5 }); // Hit effect

                if (p.isSplash) {
                    this.enemies.forEach(e => {
                        if (Math.hypot(e.x - p.x, e.y - p.y) < 80) this.damageEnemy(e, p.damage);
                    });
                } else {
                    this.damageEnemy(p.target, p.damage);
                }
                this.projectiles.splice(i, 1);
            } else if (!p.active) {
                this.projectiles.splice(i, 1);
            }
        }

        // Enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            const leaked = e.update();
            if (leaked) {
                this.state.lives -= (e.isBoss ? 10 : 1);
                this.enemies.splice(i, 1);
                if (this.state.lives <= 0) {
                    this.state.active = false;
                    console.log("Game Over");
                }
            } else if (e.hp <= 0) {
                this.state.money += e.reward;
                this.enemies.splice(i, 1);
                // Blood
                for (let k = 0; k < 5; k++) {
                    this.particles.push({
                        x: e.x + (Math.random() * 10 - 5),
                        y: e.y + (Math.random() * 10 - 5),
                        type: 'blood', life: 1.0
                    });
                }
            }
        }

        // Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= 0.05;
            if (p.type === 'wave') p.x += 12; // Wave moves right
            if (p.life <= 0) this.particles.splice(i, 1);
        }
    }

    private damageEnemy(e: Enemy, amt: number) {
        if (e.isBoss) amt *= 0.9;
        if (e.type === 'crab') amt *= 0.8;
        e.hp -= amt;
    }

    // Power
    public usePower() {
        if (this.state.powerCD > 0) return;
        this.state.powerCD = 900;
        this.particles.push({ type: 'wave', x: 0, y: 0, life: 100 }); // y ignored by renderer for wave usually

        this.enemies.forEach(e => {
            e.pathIdx = Math.max(0, e.pathIdx - 1);
            e.x = CONF.PATH[e.pathIdx].x;
            e.y = CONF.PATH[e.pathIdx].y;
        });
    }

    // Interaction
    public setBuildMode(type: TowerType | null) {
        this.state.buildType = type;
        this.state.selectedTowerId = null;
    }

    public handleClick(x: number, y: number) {
        if (this.state.buildType) {
            const cost = CONF.TOWERS[this.state.buildType].cost;
            if (this.state.money >= cost) {
                this.state.money -= cost;
                this.towers.push(new Tower(x, y, this.state.buildType));
                this.state.buildType = null;
            }
        } else {
            // Select
            const hit = this.towers.find(t => Math.hypot(t.x - x, t.y - y) < 30);
            this.state.selectedTowerId = hit ? hit.id : null;
        }
    }

    public getSelectedTower() {
        return this.towers.find(t => t.id === this.state.selectedTowerId) || null;
    }

    public upgradeTower() {
        const t = this.getSelectedTower();
        if (!t) return;
        const cost = CONF.TOWERS[t.type].cost * t.level;
        if (this.state.money >= cost && t.level < 4) {
            this.state.money -= cost;
            t.upgrade();
        }
    }

    public sellTower() {
        const t = this.getSelectedTower();
        if (!t) return;
        this.state.money += Math.floor(CONF.TOWERS[t.type].cost * 0.7);
        this.towers = this.towers.filter(x => x !== t);
        this.state.selectedTowerId = null;
    }

    // Boss Logic
    public triggerBossEvent() {
        if (this.towers.length === 0) return;
        let toKill = 4;
        let attempts = 0;
        // Simple random kill
        while (toKill > 0 && this.towers.length > 0 && attempts < 100) {
            let idx = Math.floor(Math.random() * this.towers.length);
            let t = this.towers[idx];
            this.particles.push({ x: t.x, y: t.y, life: 1.5, color: 'orange', type: 'smoke' });
            this.towers.splice(idx, 1);
            toKill--;
            attempts++;
        }
        this.state.selectedTowerId = null;
    }

    // Getters for Renderer
    public getState() { return this.state; }
}
