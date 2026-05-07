import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

/**
 * LiveFeedTicker Component
 * Displays real-time system events (Nexus Feed) via WebSocket.
 */
const LiveFeedTicker = ({ socketUrl = 'http://localhost:5000' }) => {
    const [events, setEvents] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(socketUrl);
        setSocket(newSocket);

        newSocket.on('live_event', (data) => {
            setEvents(prev => [data, ...prev].slice(0, 10)); // Keep last 10 events
        });

        return () => newSocket.close();
    }, [socketUrl]);

    return (
        <div className="fixed bottom-0 left-0 w-full h-[40px] bg-black/95 border-t border-white/5 flex items-center overflow-hidden z-50 backdrop-blur-md">
            <div className="px-4 border-r border-white/10 h-full flex items-center bg-[#050510] z-10 shrink-0">
                <span className="font-display text-[10px] text-[#00FFD1] font-black tracking-widest uppercase">NEXUS FEED</span>
            </div>
            <div className="flex-1 overflow-hidden whitespace-nowrap relative h-full flex items-center px-4">
                <div className="flex gap-8 items-center animate-[ticker_30s_linear_infinite] hover:[animation-play-state:paused]">
                    {events.map((ev, i) => (
                        <div key={i} className="font-mono text-[10px] uppercase tracking-wider flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ 
                                backgroundColor: ev.type === 'capsule' ? '#BF00FF' : 
                                                ev.type === 'job' ? '#00FFD1' : '#FF8C00' 
                            }}></span>
                            <span className="text-white/60">
                                <b className="text-white">{ev.message}</b>
                            </span>
                        </div>
                    ))}
                    {events.length === 0 && (
                        <span className="font-mono text-[10px] text-white/10 uppercase tracking-widest animate-pulse">
                            SCANNING QUANTUM TIMELINES FOR NEW ACTIVITY...
                        </span>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}} />
        </div>
    );
};

export default LiveFeedTicker;
