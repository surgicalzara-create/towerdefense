import { useGameStore } from '../store/useGameStore';
import { Panel } from './ui/Panel';

export const HUD = () => {
    const { lives, wave, money } = useGameStore();

    return (
        <div className="absolute top-5 left-5 right-5 flex justify-between pointer-events-none z-10">
            {/* Left Group */}
            <div className="flex gap-3">
                <Panel className="flex-row items-center !py-2 !px-5 !rounded-full">
                    <span className="text-2xl drop-shadow-md">❤️</span>
                    <span className="text-xl font-black text-white drop-shadow-md">{lives}</span>
                </Panel>
                <Panel className="flex-row items-center !py-2 !px-5 !rounded-full">
                    <span className="text-2xl drop-shadow-md">🥥</span>
                    <span className="text-xl font-black text-tropical-400 drop-shadow-md">{Math.floor(money)}</span>
                </Panel>
            </div>

            {/* Center - Wave */}
            <Panel className="flex-row items-center !py-2 !px-8 !rounded-full bg-ocean-800/90 border-tropical-500/20 shadow-tropical-500/10">
                <span className="text-xl font-black text-tropical-400 tracking-widest drop-shadow-md">WAVE {wave}</span>
            </Panel>

            {/* Right Spacer (for balance if needed, or settings later) */}
            <div className="w-[100px]"></div>
        </div>
    );
};
