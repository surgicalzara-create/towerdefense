import { Entity } from './Entity';
import { Enemy } from './Enemy';

export class Projectile extends Entity {
    public active: boolean = true;

    public target: Enemy;
    public damage: number;
    public speed: number;
    public color: string;
    public isSplash: boolean;

    constructor(
        x: number,
        y: number,
        target: Enemy,
        damage: number,
        speed: number,
        color: string,
        isSplash: boolean
    ) {
        super(x, y);
        this.target = target;
        this.damage = damage;
        this.speed = speed;
        this.color = color;
        this.isSplash = isSplash;
    }

    public update(): boolean {
        if (!this.active) return false;
        if (this.target.hp <= 0 || !this.target.active) {
            this.active = false;
            return false;
        }

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < this.speed) {
            // Hit
            this.active = false;
            return true;
        }

        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;
        return false;
    }
}
