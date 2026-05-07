import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

/**
 * Real-time Ticker Component for System Events
 */
const LiveFeedTicker = ({ socketUrl = 'http://localhost:5000' }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const socket = io(socketUrl);
        socket.on('live_event', (data) => {
            setEvents(prev => [data, ...prev].slice(0, 10));
        });
        return () => socket.close();
    }, [socketUrl]);

    return (
        <div className="fixed bottom-0 left-0 w-full h-10 bg-black/90 border-t border-white/5 flex items-center overflow-hidden z-50">
            <div className="px-4 bg-[#080818] h-full flex items-center border-r border-white/10 shrink-0">
                <span className="text-[#00FFD1] text-[10px] font-black uppercase">NEXUS_FEED</span>
            </div>
            <div className="flex-1 flex gap-10 items-center px-6 animate-[ticker_40s_linear_infinite]">
                {events.map((ev, i) => (
                    <div key={i} className="flex items-center gap-3 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00FFD1] shadow-[0_0_10px_#00FFD1]"></span>
                        <span className="text-white font-mono text-[10px] uppercase font-black">{ev.message}</span>
                    </div>
                ))}
                {events.length === 0 && <span className="text-white/10 text-[10px] font-mono">SCANNING FOR ACTIVITY...</span>}
            </div>
            <style>{`@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }`}</style>
        </div>
    );
};

export default LiveFeedTicker;
