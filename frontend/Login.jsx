import React, { useState } from 'react';
import { motion } from 'framer-motion';
import client from '../api/client'; // Assuming axios client

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await client.post('/auth/login', { email, password });
            if (res.success) {
                localStorage.setItem('token', res.token);
                window.location.href = '/dashboard';
            }
        } catch (err) { alert("Access Denied: Neural signature mismatch."); }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 p-12 rounded-3xl border-4 border-white/5 shadow-2xl w-full max-w-md">
                <h1 className="text-3xl font-black text-white uppercase mb-8 tracking-tighter">NEXUS <span className="text-[#00FFD1]">LOGIN</span></h1>
                <form onSubmit={handleLogin} className="space-y-6">
                    <input type="email" placeholder="EMAIL" className="w-full bg-black border border-white/10 p-4 text-white rounded-xl font-mono" value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="PASSWORD" className="w-full bg-black border border-white/10 p-4 text-white rounded-xl font-mono" value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="submit" className="w-full bg-[#00FFD1] text-black py-4 rounded-xl font-black uppercase shadow-[0_10px_30px_rgba(0,255,209,0.3)]">Establish Link</button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
