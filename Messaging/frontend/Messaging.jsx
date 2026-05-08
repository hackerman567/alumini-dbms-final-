import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { motion } from 'framer-motion';
import { Send, MessageSquare, User } from 'lucide-react';

const Messaging = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchConvs = async () => {
            const res = await client.get('/messages/conversations');
            setConversations(res.data || []);
        };
        fetchConvs();
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!selectedId || !message) return;
        try {
            await client.post('/messages', { receiver_id: selectedId, body: message });
            setMessage('');
            // Refresh logic here...
        } catch (err) { alert("Signal blocked."); }
    };

    return (
        <div className="h-[80vh] flex bg-black/40 rounded-3xl border-4 border-white/5 overflow-hidden shadow-2xl">
            {/* Sidebar */}
            <div className="w-1/3 border-r border-white/5 overflow-y-auto bg-slate-900/40">
                <div className="p-6 border-b border-white/5 font-black text-white uppercase tracking-widest">Conversations</div>
                {conversations.map(c => (
                    <div key={c.id} onClick={() => setSelectedId(c.participant_id)} className={`p-6 cursor-pointer hover:bg-white/5 transition-all flex items-center gap-4 ${selectedId === c.participant_id ? 'bg-[#00FFD1]/10 border-l-4 border-[#00FFD1]' : ''}`}>
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-[#00FFD1] font-black">{c.participant_name.charAt(0)}</div>
                        <div>
                            <div className="text-sm font-black text-white uppercase">{c.participant_name}</div>
                            <div className="text-[10px] text-white/20 font-mono">STABLE CONNECTION</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-8 overflow-y-auto space-y-6">
                    {/* Messages would go here */}
                    <div className="text-center text-white/10 font-mono text-xs py-20 uppercase tracking-widest">Secure encrypted tunnel established</div>
                </div>

                <form onSubmit={handleSend} className="p-6 border-t border-white/5 bg-black/40 flex gap-4">
                    <input className="flex-1 bg-black border border-white/10 p-4 rounded-xl text-white font-mono" placeholder="TRANSMIT SIGNAL..." value={message} onChange={e => setMessage(e.target.value)} />
                    <button type="submit" className="bg-[#00FFD1] p-4 rounded-xl text-black hover:scale-105 transition-all"><Send size={24} /></button>
                </form>
            </div>
        </div>
    );
};

export default Messaging;
