import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import AiChatPanel from '@/components/AiChatPanel';
import { SimulationPanel } from '@/components/SimulationPanel';
import { useSettings } from '@/context/SettingsContext';

export default function Layout() {
    const [aiChatOpen, setAiChatOpen] = useState(false);
    const { aiEnabled } = useSettings();

    const handleAiToggle = () => setAiChatOpen(prev => !prev);
    const handleAiClose = () => setAiChatOpen(false);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Left nav sidebar — auto-collapses when AI chat is open */}
            <Sidebar
                aiChatOpen={aiChatOpen}
                onAiChatToggle={handleAiToggle}
            />

            {/* Center column: main content + simulation panel stacked vertically */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Main page content */}
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>

                {/* Simulation panel — slides up from below when active */}
                <SimulationPanel />
            </div>

            {/* Right AI chat panel — always mounted to preserve model + chat history.
                Width animates to 0 when closed; the component is never unmounted. */}
            {aiEnabled && (
                <div
                    className={`
                        flex flex-col shrink-0
                        transition-all duration-300 ease-in-out
                        ${aiChatOpen ? 'w-[320px]' : 'w-0 overflow-hidden'}
                    `}
                >
                    {/* Inner wrapper keeps the panel at its natural width even when the 
                        outer container collapses to w-0, so layout never breaks children */}
                    <div className="w-[320px] h-full">
                        <AiChatPanel onClose={handleAiClose} />
                    </div>
                </div>
            )}
        </div>
    );
}
