import { Entity } from './Entity';
import { CONF, type TowerType } from '../../config/constants';
import { Enemy } from './Enemy';

export class Tower extends Entity {
    public target: Enemy | null = null;
    public level: number = 1;
    public range: number;
    public damage: number;
    public rate: number;
    public cooldown: number = 0;

    public type: TowerType;

    constructor(
        x: number,
        y: number,
        type: TowerType
    ) {
        super(x, y);
        this.type = type;
        const stats = CONF.TOWERS[type];
        this.range = stats.range;
        this.damage = stats.dmg;
        this.rate = stats.rate;
    }

    public update(enemies: Enemy[]): Enemy | null {
        if (this.cooldown > 0) {
            this.cooldown--;
            return null;
        }

        // Find Target
        let best: Enemy | null = null;
        let maxP = -1;

        for (const e of enemies) {
            const dist = Math.hypot(e.x - this.x, e.y - this.y);
            if (dist <= this.range) {
                if (e.pathIdx > maxP) {
                    maxP = e.pathIdx;
                    best = e;
                }
            }
        }

        if (best) {
            this.cooldown = this.rate;
            return best; // Fire!
        }

        return null;
    }

    public upgrade() {
        if (this.level >= 4) return;
        this.level++;
        this.damage *= 1.5;
        this.range += 20;
    }
}
