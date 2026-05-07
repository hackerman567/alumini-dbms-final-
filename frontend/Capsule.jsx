import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Clock, Plus, Send } from 'lucide-react';
import client from '../api/client'; // Assuming axios client

const Capsule = () => {
    const [capsules, setCapsules] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [unlockDate, setUnlockDate] = useState('');

    useEffect(() => { fetchCapsules(); }, []);

    const fetchCapsules = async () => {
        try {
            const res = await client.get('/capsules');
            setCapsules(res.data || []);
        } catch (err) { console.error(err); }
    };

    const handleSeal = async (e) => {
        e.preventDefault();
        try {
            const res = await client.post('/capsules', { title, body, unlock_date: unlockDate, is_public: true });
            if (res.success) {
                setIsModalOpen(false);
                fetchCapsules();
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="p-8 space-y-10">
            <h1 className="text-4xl font-black text-white uppercase flex items-center gap-4">
                <Clock className="text-[#00FFD1]" size={48} /> Time Capsule
            </h1>
            <button onClick={() => setIsModalOpen(true)} className="bg-[#00FFD1] text-black px-8 py-3 rounded-xl font-black">NEW CAPSULE</button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {capsules.map(c => (
                    <div key={c.id} className="bg-black/60 border-2 border-white/5 p-6 rounded-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            {c.is_revealed ? <Unlock className="text-[#00FFD1]" /> : <Lock className="text-white/20" />}
                            <h3 className="font-bold text-white uppercase">{c.is_revealed ? c.title : 'LOCKED'}</h3>
                        </div>
                        <p className="text-sm text-white/40">{c.is_revealed ? c.body : 'Decrypting in future...'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Capsule;
