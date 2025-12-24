import { CONF } from '../config/constants';
import { GameEngine } from './GameEngine';

export class Renderer {
    private ctx: CanvasRenderingContext2D;
    private bgPattern: CanvasPattern | null = null;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.createSandTexture();
    }

    private createSandTexture() {
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 100;
        pCanvas.height = 100;
        const pCtx = pCanvas.getContext('2d');
        if (!pCtx) return;

        // Base
        pCtx.fillStyle = "#eab308";
        pCtx.fillRect(0, 0, 100, 100);

        // Noise
        for (let i = 0; i < 500; i++) {
            pCtx.fillStyle = Math.random() > 0.5 ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
            pCtx.fillRect(Math.random() * 100, Math.random() * 100, 2, 2);
        }
        this.bgPattern = this.ctx.createPattern(pCanvas, 'repeat');
    }

    public draw(engine: GameEngine) {
        const { W, H } = CONF;
        this.ctx.clearRect(0, 0, W, H);

        this.drawEnvironment();
        this.drawEntities(engine);
        this.drawParticles(engine);
        this.drawOverlays(engine);
    }

    private drawEntities(engine: GameEngine) {
        // Shadows
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = "rgba(0,0,0,0.5)";

        // Towers
        engine.towers.forEach(t => {
            // Base
            const grad = this.ctx.createLinearGradient(t.x - 20, t.y - 20, t.x + 20, t.y + 20);
            grad.addColorStop(0, "#475569"); grad.addColorStop(1, "#1e293b");
            this.ctx.fillStyle = grad;
            this.ctx.beginPath(); this.ctx.arc(t.x, t.y, 20, 0, Math.PI * 2); this.ctx.fill();

            // Core
            this.ctx.fillStyle = t.type === 'tiki' ? '#fbbf24' : '#ef4444';
            this.ctx.beginPath(); this.ctx.arc(t.x, t.y, 14, 0, Math.PI * 2); this.ctx.fill();

            // Level
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = "white";
            this.ctx.font = "12px Arial";
            this.ctx.fillText("⭐".repeat(t.level), t.x - (t.level * 4), t.y - 25);
            this.ctx.shadowBlur = 15;
        });

        // Enemies
        engine.enemies.forEach(e => {
            if (e.isBoss) {
                this.drawVectorShip(e.x, e.y);
            } else if (e.type === 'crab') {
                this.drawVectorCrab(e.x, e.y);
            } else {
                this.drawVectorPirate(e.x, e.y);
            }

            // HP Bar
            this.ctx.shadowBlur = 0;
            const barW = e.isBoss ? 80 : 20;
            const pct = e.hp / e.maxHp;
            this.ctx.fillStyle = "rgba(0,0,0,0.5)";
            this.ctx.fillRect(e.x - barW / 2, e.y - 35, barW, 4);

            this.ctx.fillStyle = "#22c55e";
            this.ctx.fillRect(e.x - barW / 2, e.y - 35, barW * pct, 4);
            this.ctx.shadowBlur = 15;
        });

        // Projectiles
        engine.projectiles.forEach(p => {
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath(); this.ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); this.ctx.fill();
        });

        this.ctx.shadowBlur = 0;
    }

    private drawParticles(engine: GameEngine) {
        engine.particles.forEach(p => {
            if (p.type === 'wave') {
                this.ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
                this.ctx.fillRect(p.x, 0, 100, CONF.H);
            } else if (p.type === 'blood') {
                this.ctx.fillStyle = `rgba(185, 28, 28, ${p.life})`;
                this.ctx.beginPath(); this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); this.ctx.fill();
            } else if (p.type === 'smoke') {
                this.ctx.fillStyle = `rgba(251, 146, 60, ${p.life})`; // Orange smoke
                this.ctx.beginPath(); this.ctx.arc(p.x, p.y, 10 + (1 - p.life) * 10, 0, Math.PI * 2); this.ctx.fill();
            } else {
                // Spark
                this.ctx.fillStyle = `rgba(255, 255, 255, ${p.life})`;
                this.ctx.beginPath(); this.ctx.arc(p.x, p.y, 5 * p.life, 0, Math.PI * 2); this.ctx.fill();
            }
        });
    }

    private drawOverlays(engine: GameEngine) {
        const selected = engine.getSelectedTower();
        if (selected) {
            this.ctx.strokeStyle = "rgba(255,255,255,0.5)";
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(selected.x, selected.y, selected.range, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }

    private drawEnvironment() {
        const { W, H, PATH } = CONF;
        const frameCount = performance.now() / 16;

        // Ocean
        const gradSea = this.ctx.createLinearGradient(0, 0, 0, 250);
        gradSea.addColorStop(0, "#0c4a6e");
        gradSea.addColorStop(1, "#0ea5e9");
        this.ctx.fillStyle = gradSea;
        this.ctx.fillRect(0, 0, W, 250);

        // Sand
        if (this.bgPattern) {
            this.ctx.fillStyle = this.bgPattern;
            this.ctx.fillRect(0, 250, W, H - 250);
        }

        // Shoreline
        this.ctx.fillStyle = "rgba(255,255,255,0.5)";
        this.ctx.beginPath();
        this.ctx.moveTo(0, 240);
        for (let i = 0; i <= W; i += 20) {
            this.ctx.lineTo(i, 250 + Math.sin((i + frameCount) * 0.02) * 10);
        }
        this.ctx.lineTo(W, 270);
        this.ctx.lineTo(0, 270);
        this.ctx.fill();

        // PATH
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = "rgba(0,0,0,0.15)";
        this.ctx.lineWidth = 60;
        this.ctx.beginPath();
        this.ctx.moveTo(PATH[0].x, PATH[0].y);
        for (let i = 1; i < PATH.length; i++) {
            this.ctx.lineTo(PATH[i].x, PATH[i].y);
        }
        this.ctx.stroke();
    }

    private drawVectorPirate(x: number, y: number) {
        this.ctx.fillStyle = "#cbd5e1";
        this.ctx.beginPath(); this.ctx.arc(x, y, 10, 0, Math.PI * 2); this.ctx.fill();
        this.ctx.fillStyle = "#1e293b";
        this.ctx.beginPath(); this.ctx.arc(x, y - 5, 8, Math.PI, 0); this.ctx.fill();
        this.ctx.fillStyle = "#ef4444";
        this.ctx.beginPath(); this.ctx.arc(x + 2, y - 2, 2, 0, Math.PI * 2); this.ctx.fill();
    }

    private drawVectorCrab(x: number, y: number) {
        this.ctx.fillStyle = "#b91c1c";
        this.ctx.beginPath(); this.ctx.ellipse(x, y, 15, 10, 0, 0, Math.PI * 2); this.ctx.fill();
        this.ctx.beginPath(); this.ctx.arc(x - 15, y - 10, 6, 0, Math.PI * 2); this.ctx.fill();
        this.ctx.beginPath(); this.ctx.arc(x + 15, y - 10, 6, 0, Math.PI * 2); this.ctx.fill();
    }

    private drawVectorShip(x: number, y: number) {
        this.ctx.fillStyle = "#451a03";
        this.ctx.save();
        this.ctx.translate(x, y);

        this.ctx.beginPath();
        this.ctx.moveTo(-35, -10); this.ctx.lineTo(35, -10);
        this.ctx.lineTo(25, 15); this.ctx.lineTo(-25, 15);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = "#d4d4d4";
        this.ctx.fillRect(-5, -40, 40, 30);
        this.ctx.fillRect(-30, -35, 20, 25);

        this.ctx.fillStyle = "#451a03";
        this.ctx.beginPath();
        this.ctx.moveTo(-35, 0); this.ctx.lineTo(35, 0);
        this.ctx.lineTo(25, 20); this.ctx.lineTo(-25, 20);
        this.ctx.fill();

        this.ctx.fillStyle = "#000";
        this.ctx.beginPath(); this.ctx.arc(-15, 10, 3, 0, Math.PI * 2); this.ctx.fill();
        this.ctx.beginPath(); this.ctx.arc(0, 10, 3, 0, Math.PI * 2); this.ctx.fill();
        this.ctx.beginPath(); this.ctx.arc(15, 10, 3, 0, Math.PI * 2); this.ctx.fill();

        this.ctx.restore();
    }
}
