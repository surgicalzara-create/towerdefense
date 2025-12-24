import { useEffect, useRef } from 'react';
import { GameEngine } from '../game/GameEngine';
import { Renderer } from '../game/Renderer';
import { CONF } from '../config/constants';
import { useGameLoop } from '../hooks/useGameLoop';
import { HUD } from './HUD';
import { Controls } from './Controls';
import { useGameStore } from '../store/useGameStore';

export const GameCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { buildType } = useGameStore();

    useGameLoop();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const engine = GameEngine.getInstance();
        const renderer = new Renderer(ctx);

        const renderLoop = () => {
            engine.start();
            renderer.draw(engine);
            requestAnimationFrame(renderLoop);
        };

        const id = requestAnimationFrame(renderLoop);

        return () => {
            cancelAnimationFrame(id);
            engine.stop();
        };
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        GameEngine.getInstance().handleClick(x, y);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        GameEngine.getInstance().setBuildMode(null);
    }

    return (
        <div className="relative flex justify-center items-center h-screen bg-slate-950 overflow-hidden">
            <HUD />

            {/* Layout Grid: Canvas Left, Controls Right (Overlay) */}
            <div className="relative flex gap-4 pointer-events-none">
                <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 pointer-events-auto">
                    <canvas
                        ref={canvasRef}
                        width={CONF.W}
                        height={CONF.H}
                        className={`block bg-slate-800 ${buildType ? 'cursor-crosshair' : 'cursor-default'}`}
                        onClick={handleClick}
                        onContextMenu={handleContextMenu}
                    />
                </div>

                <Controls />
            </div>
        </div>
    );
};
