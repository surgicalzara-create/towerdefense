import { GameEngine } from './GameEngine';
import { CONF } from '../config/constants';
import { Enemy, type EnemyType } from './entities/Enemy';

export class WaveManager {
    private engine: GameEngine;

    constructor(engine: GameEngine) {
        this.engine = engine;
    }

    public startWave(waveNum: number) {
        const state = this.engine.state;
        if (state.waveRunning) return;

        state.waveRunning = true;
        state.wave = waveNum;

        const q: EnemyType[] = [];

        if (waveNum % 10 === 0) {
            // Boss
            q.push('pirate', 'pirate');
            q.push('boss');
            q.push('pirate', 'pirate', 'pirate');
        } else {
            const count = 3 + Math.floor(waveNum / 2);
            for (let i = 0; i < count; i++) {
                if (waveNum > 2 && i === 1) q.push('crab');
                else q.push('pirate');
            }
        }

        state.spawnQueue = q;
        state.spawnTimer = 0;
    }

    public update() {
        const state = this.engine.state;
        if (!state.waveRunning) return;

        state.spawnTimer--;
        if (state.spawnTimer <= 0 && state.spawnQueue.length > 0) {
            const type = state.spawnQueue.shift();
            if (type) this.spawnEnemy(type);
            state.spawnTimer = 70; // Hardcoded spawn interval from original
        }

        if (state.spawnQueue.length === 0 && this.engine.enemies.length === 0) {
            state.waveRunning = false;
            console.log("Wave Complete");
        }
    }

    private spawnEnemy(type: EnemyType) {
        const { wave } = this.engine.state;
        let hp: number;
        let speed: number;
        let reward: number;
        let isBoss = false;

        if (type === 'boss') {
            hp = 250 + (wave * 10);
            speed = 0.3;
            reward = CONF.REWARDS.ship;
            isBoss = true;
        } else if (type === 'crab') {
            hp = 30 + (wave * 3);
            speed = 0.4;
            reward = CONF.REWARDS.crab;
        } else {
            hp = 10 + (wave * 1.5);
            speed = 0.8;
            reward = CONF.REWARDS.pirate;
        }

        const enemy = new Enemy(
            CONF.PATH[0].x,
            CONF.PATH[0].y,
            speed,
            type,
            reward,
            hp,
            isBoss
        );
        this.engine.enemies.push(enemy);
    }
}
