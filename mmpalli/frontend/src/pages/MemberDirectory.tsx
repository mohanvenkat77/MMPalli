import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMembers } from '../hooks/useMembers';
import { ArrowLeft, Search, User, Phone, Calendar, UserCheck, Users, IndianRupee } from 'lucide-react';
import MemberHistoryModal from '../components/admin/MemberHistoryModal';

export default function MemberDirectory() {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: members, isLoading } = useMembers(searchTerm);
    const [selectedMember, setSelectedMember] = useState<any>(null);

    return (
        <div className="min-h-screen bg-[#FAFAF9] pb-20 font-sans">

            {/* 1. Header Section */}
            <div className="bg-trustBlue-900 pt-12 pb-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-500/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <Link to="/foundation" className="text-trustBlue-200 hover:text-white flex items-center mb-8 transition-colors group">
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Foundation
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-saffron-500/20 rounded-lg text-saffron-400">
                            <Users size={24} />
                        </div>
                        <span className="text-saffron-400 font-bold tracking-widest text-sm uppercase">Directory</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                        Foundation <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-yellow-200">Members</span>
                    </h1>
                    <p className="text-trustBlue-100 mt-4 text-lg max-w-2xl opacity-90 leading-relaxed">
                        A complete directory of all active members contributing to the MatlaMala Palli development and foundation goals.
                    </p>
                </div>
            </div>

            {/* 2. Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">

                {/* Search Bar */}
                <div className="bg-white rounded-[2rem] shadow-xl p-3 mb-10 flex items-center border border-slate-100 ring-4 ring-black/5">
                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 ml-1">
                        <Search size={22} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or phone number..."
                        className="w-full px-4 py-2 outline-none text-lg text-slate-700 placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Member Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 bg-white rounded-[2rem] border border-slate-100 p-6 space-y-4 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div className="w-12 h-12 bg-slate-100 animate-pulse rounded-2xl" />
                                    <div className="w-20 h-6 bg-slate-100 animate-pulse rounded-full" />
                                </div>
                                <div className="w-3/4 h-6 bg-slate-100 animate-pulse rounded-lg" />
                                <div className="w-1/2 h-4 bg-slate-100 animate-pulse rounded-lg" />
                                <div className="pt-4 border-t border-slate-50 space-y-2">
                                    <div className="w-full h-4 bg-slate-50 animate-pulse rounded-lg" />
                                    <div className="w-full h-4 bg-slate-50 animate-pulse rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {members?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {members.map((member: any) => (
                                    <motion.div
                                        key={member._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ y: -5 }}
                                        onClick={() => setSelectedMember(member)}
                                        className="cursor-pointer bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all relative overflow-hidden group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="bg-saffron-50 p-4 rounded-2xl text-saffron-600">
                                                <User size={28} />
                                            </div>
                                            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase">
                                                <UserCheck size={14} /> ACTIVE
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-trustBlue-700 transition-colors">
                                                {member.full_name || member.name}
                                            </h3>
                                            <p className="text-slate-400 text-sm mt-1 font-medium italic">
                                                S/o: {member.father_name || 'Not Mentioned'}
                                            </p>
                                        </div>

                                        <div className="mt-4 bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Total Contribution</span>
                                                <div className="flex items-center text-emerald-700 font-black">
                                                    <IndianRupee size={14} />
                                                    <span className="text-lg">{member.total_contributed || 0}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex flex-col gap-3 border-t border-slate-50 pt-4">
                                            <div className="flex items-center text-slate-600 gap-3">
                                                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400"><Phone size={14} /></div>
                                                <span className="font-bold text-slate-700 tracking-wide">{member.phone_number}</span>
                                            </div>
                                            <div className="flex items-center text-slate-500 gap-3">
                                                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400"><Calendar size={14} /></div>
                                                <span className="text-xs font-medium uppercase tracking-wider">
                                                    Joined {new Date(member.join_date || member.joined_date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search size={32} className="text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">No members found</h3>
                                <p className="text-slate-500 mt-2">Try searching for a different name or phone number.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* MEMBER HISTORY MODAL */}
            <MemberHistoryModal 
                isOpen={!!selectedMember} 
                onClose={() => setSelectedMember(null)} 
                member={selectedMember} 
            />

        </div>
    );
}