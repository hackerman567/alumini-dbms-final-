import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Clock, Plus, Shield, Send } from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const Capsule = () => {
    const { user } = useAuth();
    const [capsules, setCapsules] = useState([]);
    const [myCapsules, setMyCapsules] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [view, setView] = useState('vault'); 

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [unlockDate, setUnlockDate] = useState('');

    useEffect(() => {
        fetchCapsules();
    }, [view]);

    const fetchCapsules = async () => {
        try {
            if (view === 'vault') {
                const res = await client.get('/capsules');
                setCapsules(res.data || []);
            } else {
                const res = await client.get('/capsules/me');
                setMyCapsules(res.data || []);
            }
        } catch (err) {
            console.error("Failed to load capsules", err);
        }
    };

    const handleSeal = async (e) => {
        e.preventDefault();
        try {
            const res = await client.post('/capsules', {
                title, 
                body, 
                unlock_date: unlockDate, 
                is_public: true,
                image_url: null 
            });
            if (res.success) {
                setIsModalOpen(false);
                fetchCapsules();
                setTitle(''); setBody(''); setUnlockDate('');
            }
        } catch (err) {
            console.error("Failed to create capsule", err);
        }
    };

    const calculateTimeLeft = (targetDate) => {
        const difference = new Date(targetDate) - new Date();
        if (difference <= 0) return "AVAILABLE";
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        return `${days}D ${hours}H ${minutes}M`;
    };

    return (
        <div className="max-w-7xl mx-auto space-y-20 pb-24 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 p-6 md:p-10 quantum-card rounded-3xl border-4 border-white/5 bg-black/40 shadow-2xl">
                <div className="space-y-4">
                    <h1 className="text-3xl md:text-5xl font-display font-black text-white mb-4 flex items-center gap-5 uppercase tracking-normaler leading-none">
                        <Clock className="text-[#00FFD1]" size={64} /> Time Capsule
                    </h1>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setView('vault')} className={`px-6 py-4 rounded-xl font-black uppercase transition-all ${view === 'vault' ? 'bg-white text-black' : 'text-white/20'}`}>Vault</button>
                    <button onClick={() => setView('mine')} className={`px-6 py-4 rounded-xl font-black uppercase transition-all ${view === 'mine' ? 'bg-[#BF00FF] text-white' : 'text-white/20'}`}>My Archive</button>
                    <button onClick={() => setIsModalOpen(true)} className="dimension-btn !px-10 !py-5 font-black uppercase">NEW CAPSULE</button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(view === 'vault' ? capsules : myCapsules).map((capsule) => (
                    <div key={capsule.id} className="quantum-card p-8 rounded-3xl border-2 border-white/5 bg-black/60">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center">
                                {capsule.is_revealed ? <Unlock className="text-[#00FFD1]" /> : <Lock className="text-white/20" />}
                            </div>
                            <h3 className="font-black text-white uppercase">{capsule.is_revealed ? capsule.title : 'ARCHIVE_LOCKED'}</h3>
                        </div>
                        <div className="h-40 bg-black/40 rounded-xl flex items-center justify-center border border-white/5 mb-6">
                            {capsule.is_revealed ? (
                                <p className="p-4 text-center italic">"{capsule.body}"</p>
                            ) : (
                                <span className="font-mono text-sm text-[#BF00FF]">{calculateTimeLeft(capsule.unlock_date)}</span>
                            )}
                        </div>
                        <p className="text-[10px] text-white/20 uppercase font-black">Transmit: {capsule.author_name}</p>
                    </div>
                ))}
            </div>

            {/* Modal - Simplified for snippet */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-6">
                    <div className="bg-black border-2 border-white/10 p-10 rounded-3xl w-full max-w-xl">
                        <h2 className="text-2xl font-black text-white mb-8">SEAL NEW ARCHIVE</h2>
                        <form onSubmit={handleSeal} className="space-y-6">
                            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black border border-white/10 p-4 text-white rounded-xl" placeholder="TITLE" />
                            <textarea value={body} onChange={e => setBody(e.target.value)} className="w-full bg-black border border-white/10 p-4 text-white rounded-xl" rows="4" placeholder="DATA..."></textarea>
                            <input type="date" value={unlockDate} onChange={e => setUnlockDate(e.target.value)} className="w-full bg-black border border-white/10 p-4 text-white rounded-xl [color-scheme:dark]" />
                            <button type="submit" className="dimension-btn w-full !py-4 font-black uppercase">SEAL DATA</button>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="w-full text-white/20 uppercase text-xs mt-4">Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Capsule;
