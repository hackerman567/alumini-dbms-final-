import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, ShieldAlert, CheckCircle, XCircle, Trash2, Search, RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await client.get('/admin/users');
            setUsers(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const toggleStatus = async (id, currentStatus) => {
        try {
            await client.put(`/admin/users/${id}/status`, { is_active: !currentStatus });
            fetchData();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="p-8 space-y-10">
            {/* Header */}
            <div className="bg-slate-900 p-10 rounded-3xl border-4 border-red-500/20 shadow-2xl flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">ADMINISTRATION <span className="text-red-500">PORTAL</span></h1>
                </div>
                <button onClick={fetchData} className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all">
                    <RefreshCw className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* User Table */}
            <div className="bg-slate-900 rounded-3xl border-2 border-white/5 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-black text-white uppercase">User Management</h3>
                    <input 
                        className="bg-black/40 border border-white/10 p-3 rounded-xl text-sm font-mono text-white" 
                        placeholder="SEARCH..." 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                    />
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/[0.02] text-slate-500 text-xs font-black uppercase">
                            <th className="p-6">Profile</th>
                            <th className="p-6">Role</th>
                            <th className="p-6">Status</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y border-white/5">
                        {users.filter(u => u.name.toLowerCase().includes(search.toLowerCase())).map(u => (
                            <tr key={u.id} className="hover:bg-white/[0.01]">
                                <td className="p-6">
                                    <div className="font-black text-white">{u.name}</div>
                                    <div className="text-xs text-slate-600">{u.email}</div>
                                </td>
                                <td className="p-6">
                                    <span className="text-[10px] font-black px-3 py-1 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">{u.role.toUpperCase()}</span>
                                </td>
                                <td className="p-6">
                                    <div className={`w-2 h-2 rounded-full ${u.is_active ? 'bg-[#00FFD1]' : 'bg-red-500'}`}></div>
                                </td>
                                <td className="p-6 text-right space-x-2">
                                    <button onClick={() => toggleStatus(u.id, u.is_active)} className="p-2 rounded-lg border border-white/10 text-white/40 hover:text-white transition-all">
                                        {u.is_active ? <XCircle size={20} /> : <CheckCircle size={20} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
