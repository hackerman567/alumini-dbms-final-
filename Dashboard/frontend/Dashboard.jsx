import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Award, Users, Briefcase, Shield } from 'lucide-react';
import client from '../api/client';

const Dashboard = () => {
    const [history, setHistory] = useState([]);
    
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await client.get('/nexus/history');
                setHistory(res.data || []);
            } catch (err) { console.error(err); }
        };
        fetchHistory();
    }, []);

    return (
        <div className="p-8 space-y-12">
            {/* Historical Banner */}
            {history.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 p-8 rounded-3xl border-2 border-[#00FFD1]/20 flex justify-between items-center shadow-2xl">
                    <div className="flex items-center gap-6">
                        <Clock className="text-[#00FFD1] animate-spin-slow" size={32} />
                        <div>
                            <h4 className="font-black text-white uppercase">{history[0].title}</h4>
                            <p className="text-xs text-[#00FFD1] uppercase font-mono">{history[0].desc}</p>
                        </div>
                    </div>
                    <div className="px-6 py-2 bg-black rounded-xl border border-white/10 text-white font-mono">EST. {history[0].year}</div>
                </motion.div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={<Users />} label="ACTIVE USERS" value="1,248" color="#00FFD1" />
                <StatCard icon={<Briefcase />} label="OPEN PORTALS" value="42" color="#BF00FF" />
                <StatCard icon={<Shield />} label="SECURITY" value="STABLE" color="#FFD700" />
                <StatCard icon={<Activity />} label="LATENCY" value="12ms" color="#FF2D6B" />
            </div>

            {/* Activity Feed */}
            <div className="bg-slate-900 p-8 rounded-3xl border-2 border-white/5 shadow-2xl">
                <h3 className="font-black text-white uppercase mb-8 flex items-center gap-4">
                    <Activity className="text-[#00FFD1]" /> Live Activity Feed
                </h3>
                <div className="space-y-6">
                    <LogEntry title="NEW MEMBER" desc="Sarah Chen just joined the community" time="04:21 PM" color="#00FFD1" />
                    <LogEntry title="JOB POSTED" desc="New Opportunity: Senior Engineer at TechCorp" time="03:45 PM" color="#BF00FF" />
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-black/40 p-6 rounded-2xl border-2 border-white/5 flex flex-col items-center text-center">
        <div className="p-4 rounded-xl bg-white/5 mb-4" style={{ color }}>{icon}</div>
        <div className="text-2xl font-black text-white mb-1">{value}</div>
        <div className="text-[10px] text-white/20 font-mono uppercase tracking-widest">{label}</div>
    </div>
);

const LogEntry = ({ title, desc, time, color }) => (
    <div className="flex gap-4 border-b border-white/5 pb-4">
        <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: color }}></div>
        <div className="flex-1">
            <div className="flex justify-between text-[10px] font-mono mb-1">
                <span style={{ color }}>{title}</span>
                <span className="text-white/20">{time}</span>
            </div>
            <p className="text-sm text-white/60">{desc}</p>
        </div>
    </div>
);

export default Dashboard;
