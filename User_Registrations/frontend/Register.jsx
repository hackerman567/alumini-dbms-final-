import React, { useState } from 'react';
import client from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Hexagon } from 'lucide-react';

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'student',
        department: '', graduation_year: '', enrollment_year: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await client.post('/auth/register', formData);
            if (res.success) window.location.href = '/dashboard';
        } catch (err) { alert(err.error || "Neural link failure: Registration rejected."); }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/40 p-12 rounded-3xl border-4 border-white/5 shadow-2xl w-full max-w-xl">
                <div className="text-center mb-10">
                    <Hexagon size={48} className="text-[#00FFD1] mx-auto mb-4" />
                    <h1 className="text-3xl font-black text-white uppercase">INITIATE <span className="text-[#00FFD1]">IDENTITY</span></h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {step === 1 ? (
                        <>
                            <input className="w-full bg-black border border-white/10 p-5 rounded-xl text-white" placeholder="FULL NAME" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            <input className="w-full bg-black border border-white/10 p-5 rounded-xl text-white" type="email" placeholder="EMAIL" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            <input className="w-full bg-black border border-white/10 p-5 rounded-xl text-white" type="password" placeholder="PASSWORD" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setFormData({...formData, role: 'student'})} className={`flex-1 p-4 rounded-xl border-2 transition-all ${formData.role === 'student' ? 'border-[#00FFD1] text-[#00FFD1]' : 'border-white/5 text-white/20'}`}>Student</button>
                                <button type="button" onClick={() => setFormData({...formData, role: 'alumni'})} className={`flex-1 p-4 rounded-xl border-2 transition-all ${formData.role === 'alumni' ? 'border-[#BF00FF] text-[#BF00FF]' : 'border-white/5 text-white/20'}`}>Alumni</button>
                            </div>
                            <button type="button" onClick={() => setStep(2)} className="dimension-btn w-full !py-4 font-black uppercase flex items-center justify-center gap-2">Next <ArrowRight size={18} /></button>
                        </>
                    ) : (
                        <>
                            <select className="w-full bg-black border border-white/10 p-5 rounded-xl text-white" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                                <option value="">SELECT DEPARTMENT</option>
                                <option value="CS">Computer Science</option>
                                <option value="ME">Mechanical Engineering</option>
                            </select>
                            <input className="w-full bg-black border border-white/10 p-5 rounded-xl text-white" type="number" placeholder="YEAR" value={formData.graduation_year || formData.enrollment_year} onChange={e => setFormData({...formData, graduation_year: e.target.value, enrollment_year: e.target.value})} />
                            <button type="submit" className="dimension-btn w-full !py-4 font-black uppercase">Finalize Join</button>
                            <button type="button" onClick={() => setStep(1)} className="w-full text-white/20 text-xs">Back</button>
                        </>
                    )}
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
