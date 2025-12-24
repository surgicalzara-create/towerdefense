import { Entity } from './Entity';
import { CONF } from '../../config/constants';

export type EnemyType = 'pirate' | 'crab' | 'boss';

export class Enemy extends Entity {
    public hp: number;
    public maxHp: number;
    public active: boolean = true;
    public speed: number;
    public type: EnemyType;
    public reward: number;
    public isBoss: boolean;

    constructor(
        x: number,
        y: number,
        speed: number,
        type: EnemyType,
        reward: number,
        hp: number,
        isBoss: boolean = false
    ) {
        super(x, y);
        this.speed = speed;
        this.type = type;
        this.reward = reward;
        this.isBoss = isBoss;
        this.hp = hp;
        this.maxHp = hp;
    }

    // Path index (where they are heading TO)
    // Assuming they start at PATH[0] and head to PATH[1]
    public pathIdx: number = 1;

    public update(): boolean {
        if (!this.active) return false;

        const dest = CONF.PATH[this.pathIdx];
        const dx = dest.x - this.x;
        const dy = dest.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < this.speed) {
            // Reached waypoint
            this.x = dest.x;
            this.y = dest.y;
            this.pathIdx++;

            if (this.pathIdx >= CONF.PATH.length) {
                // Reached end
                this.active = false;
                return true; // Leaked
            }
        } else {
            // Move
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }

        return false;
    }
}
