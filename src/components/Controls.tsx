import { GameEngine } from '../game/GameEngine';
import { useGameStore } from '../store/useGameStore';
import { CONF } from '../config/constants';
import { Panel } from './ui/Panel';
import { Button } from './ui/Button';

export const Controls = () => {
    const { money, buildType, waveRunning, powerCD } = useGameStore();
    const engine = GameEngine.getInstance();
    const selectedTower = engine.getSelectedTower();

    return (
        <div className="absolute top-24 right-5 bottom-5 w-72 flex flex-col gap-4 pointer-events-auto z-20">

            {/* Build Panel */}
            <Panel title="Build Towers" className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 gap-2">
                    <button
                        onClick={() => engine.setBuildMode('tiki')}
                        className={`
                            relative group overflow-hidden rounded-xl p-3 text-left transition-all border
                            ${buildType === 'tiki'
                                ? 'bg-tropical-500/20 border-tropical-400 ring-1 ring-tropical-400'
                                : 'bg-slate-800/50 border-white/5 hover:border-white/20 hover:bg-slate-800'
                            }
                        `}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🗿</span>
                            <span className="font-black text-tropical-400 bg-black/30 px-2 py-0.5 rounded text-sm">
                                {CONF.TOWERS.tiki.cost}
                            </span>
                        </div>
                        <div className="font-bold text-slate-100">Tiki Tower</div>
                        <div className="text-[10px] text-slate-400 font-medium tracking-wide">
                            RAPID FIRE • SINGLE TARGET
                        </div>
                    </button>

                    <button
                        onClick={() => engine.setBuildMode('volc')}
                        className={`
                            relative group overflow-hidden rounded-xl p-3 text-left transition-all border
                            ${buildType === 'volc'
                                ? 'bg-lava-500/20 border-lava-400 ring-1 ring-lava-400'
                                : 'bg-slate-800/50 border-white/5 hover:border-white/20 hover:bg-slate-800'
                            }
                        `}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🌋</span>
                            <span className="font-black text-tropical-400 bg-black/30 px-2 py-0.5 rounded text-sm">
                                {CONF.TOWERS.volc.cost}
                            </span>
                        </div>
                        <div className="font-bold text-slate-100">Volcano</div>
                        <div className="text-[10px] text-slate-400 font-medium tracking-wide">
                            SPLASH DAMAGE • SLOW
                        </div>
                    </button>
                </div>
            </Panel>

            {/* Manage / Power Panel Group */}
            <div className="flex flex-col gap-3 shrink-0">
                {/* Selection / Manage */}
                <Panel title={selectedTower ? 'Selected Tower' : 'Selection'} className="min-h-[140px]">
                    {selectedTower ? (
                        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center justify-between">
                                <div className="font-black text-xl text-white">
                                    {CONF.TOWERS[selectedTower.type].name}
                                </div>
                                <div className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-tropical-300">
                                    LVL {selectedTower.level}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {selectedTower.level < 4 ? (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => engine.upgradeTower()}
                                        disabled={money < CONF.TOWERS[selectedTower.type].cost * selectedTower.level}
                                    >
                                        UPGRADE ({CONF.TOWERS[selectedTower.type].cost * selectedTower.level})
                                    </Button>
                                ) : (
                                    <div className="bg-palm-500/20 border border-palm-500/30 text-palm-400 font-bold text-center text-xs py-2 rounded-lg flex items-center justify-center">
                                        MAX LEVEL
                                    </div>
                                )}
                                <Button
                                    variant="neutral"
                                    size="sm"
                                    onClick={() => engine.sellTower()}
                                >
                                    SELL
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-2 opacity-50">
                            <span className="text-3xl">👆</span>
                            <span className="text-xs font-bold uppercase tracking-widest">Select a Tower</span>
                        </div>
                    )}
                </Panel>

                {/* Powers */}
                <Panel>
                    <Button
                        variant="primary"
                        size="md"
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 shadow-blue-500/20"
                        onClick={() => engine.usePower()}
                        disabled={powerCD > 0}
                    >
                        {powerCD > 0 ? (
                            <span className="font-mono">{Math.ceil(powerCD / 60)}s COOLDOWN</span>
                        ) : (
                            <>
                                <span className="text-lg">🌊</span> TIDAL WAVE
                            </>
                        )}
                    </Button>
                </Panel>
            </div>

            {/* Start Wave Button */}
            <div className="shrink-0 mt-2">
                <Button
                    variant={waveRunning ? 'neutral' : 'success'}
                    size="lg"
                    className="w-full text-xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                    onClick={() => engine.startWave()}
                    disabled={waveRunning}
                >
                    {waveRunning ? (
                        <span className="opacity-50">WAVE IN PROGRESS...</span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <span>⚔️</span> START WAVE
                        </span>
                    )}
                </Button>
            </div>
        </div>
    );
};
