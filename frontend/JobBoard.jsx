import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Calendar, Plus, Send, Zap } from 'lucide-react';

const JobBoard = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await client.get('/jobs');
            setJobs(res.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchJobs(); }, []);

    const handleApply = async (id) => {
        try {
            await client.post(`/jobs/${id}/apply`);
            alert("Transmission Successful: Application sent through the Nexus.");
        } catch (err) { alert(err.error || "Neural link failure: Could not apply."); }
    };

    return (
        <div className="p-8 space-y-12">
            {/* Header */}
            <div className="bg-black/40 p-10 rounded-3xl border-4 border-white/5 shadow-2xl flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-white uppercase mb-4 tracking-tighter">OPPORTUNITY <span className="text-[#00FFD1]">PORTAL</span></h1>
                    <p className="text-white/20 font-mono text-sm tracking-widest uppercase font-black">Gateways to professional evolution</p>
                </div>
                {(user.role === 'alumni' || user.role === 'admin') && (
                    <button className="dimension-btn !px-10 !py-5 font-black uppercase flex items-center gap-4">
                        <Plus size={24} /> OPEN PORTAL
                    </button>
                )}
            </div>

            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                    <motion.div key={job.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900/60 p-8 rounded-3xl border-2 border-white/5 group hover:border-[#00FFD1]/30 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase group-hover:text-[#00FFD1] transition-colors">{job.title}</h3>
                                <p className="text-[#00FFD1] font-mono text-xs uppercase mt-2">{job.company}</p>
                            </div>
                            <span className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-black text-white/40 uppercase tracking-widest border border-white/5">{job.type}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-3 text-white/40 font-mono text-xs">
                                <MapPin size={16} /> {job.location || 'REMOTE'}
                            </div>
                            <div className="flex items-center gap-3 text-white/40 font-mono text-xs">
                                <DollarSign size={16} /> {job.salary_range || 'TBD'}
                            </div>
                        </div>

                        <button onClick={() => handleApply(job.id)} className="dimension-btn w-full !py-4 font-black uppercase flex items-center justify-center gap-4 active:scale-95">
                            <Zap size={20} /> ENTER PORTAL
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default JobBoard;
