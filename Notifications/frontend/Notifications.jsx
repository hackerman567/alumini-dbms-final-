import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShieldAlert, Zap, UserPlus, Briefcase } from 'lucide-react';

const Notifications = () => {
    const [notifs, setNotifs] = useState([]);

    useEffect(() => {
        const fetchNotifs = async () => {
            const res = await client.get('/notifications');
            setNotifs(res.data || []);
        };
        fetchNotifs();
    }, []);

    const markRead = async (id) => {
        await client.put(`/notifications/${id}/read`);
        setNotifs(notifs.map(n => n.id === id ? { ...n, is_read: true } : n));
    };

    return (
        <div className="p-8 space-y-10">
            <div className="bg-slate-900 p-10 rounded-3xl border-4 border-[#00FFD1]/20 shadow-2xl flex items-center gap-8">
                <Bell size={48} className="text-[#00FFD1] animate-pulse" />
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter">CENTRAL <span className="text-[#00FFD1]">SIGNAL</span> FEED</h1>
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {notifs.map((n, i) => (
                        <motion.div key={n.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`p-6 rounded-2xl border-2 flex justify-between items-center transition-all ${n.is_read ? 'bg-black/20 border-white/5 opacity-50' : 'bg-slate-900/60 border-[#00FFD1]/20 shadow-xl'}`}>
                            <div className="flex items-center gap-6">
                                <div className={`p-3 rounded-xl bg-black ${n.is_read ? 'text-white/10' : 'text-[#00FFD1]'}`}>
                                    {n.type === 'job' ? <Briefcase size={24} /> : <Zap size={24} />}
                                </div>
                                <div>
                                    <h4 className="font-black text-white text-sm uppercase">{n.title}</h4>
                                    <p className="text-xs text-white/40 font-mono mt-1">{n.body}</p>
                                </div>
                            </div>
                            {!n.is_read && (
                                <button onClick={() => markRead(n.id)} className="text-[10px] font-black text-[#00FFD1] uppercase border border-[#00FFD1]/30 px-4 py-2 rounded-lg hover:bg-[#00FFD1] hover:text-black transition-all">ACKNOWLEDGE</button>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Notifications;
