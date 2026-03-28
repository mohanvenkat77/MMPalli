import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMembers } from '../hooks/useMembers';
import { useBulkMonthlyFee } from '../hooks/useAdminMutations';
import { CheckCircle2, Users, Search, Save, ArrowLeft, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BulkCollectionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [amount, setAmount] = useState(500); // Dynamic amount state
  const [selectedPhones, setSelectedPhones] = useState<string[]>([]);
  const { data: members, isLoading } = useMembers(searchTerm);
  const { mutate, isPending } = useBulkMonthlyFee();

  const toggleMember = (phone: string) => {
    setSelectedPhones(prev => 
      prev.includes(phone) ? prev.filter(p => p !== phone) : [...prev, phone]
    );
  };

  const handleSelectAll = () => {
    if (selectedPhones.length === members?.length) {
      setSelectedPhones([]);
    } else {
      setSelectedPhones(members?.map((m: any) => m.phone_number) || []);
    }
  };

  const handleProcess = () => {
    if (selectedPhones.length === 0) return alert("Select at least one member!");
    
    const list = members
      .filter((m: any) => selectedPhones.includes(m.phone_number))
      .map((m: any) => ({ phone: m.phone_number, name: m.full_name }));

    mutate({
      member_list: list,
      month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      amount: Number(amount) // Sending the dynamic amount
    }, {
      onSuccess: () => {
        setSelectedPhones([]);
        alert("Batch processing complete!");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-20">
      <div className="bg-slate-900 pt-12 pb-32 px-4 shadow-inner">
        <div className="max-w-5xl mx-auto">
          <Link to="/foundation" className="text-slate-400 hover:text-white flex items-center mb-6 transition-colors group">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back
          </Link>
          <h1 className="text-3xl font-bold text-white">Bulk Fee Collection</h1>
          <p className="text-slate-400 mt-2">Collect monthly contributions from multiple members at once.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          
          {/* Controls */}
          <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                {/* Search */}
                <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-3 text-slate-400" size={20} />
                <input 
                    type="text" placeholder="Filter members..." 
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-trustBlue-500 outline-none"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>

                {/* Amount Input */}
                <div className="relative w-full md:w-40">
                    <div className="absolute left-4 top-3 text-slate-400"><IndianRupee size={18} /></div>
                    <input 
                        type="number" 
                        placeholder="Amount"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-trustBlue-500 outline-none font-bold text-trustBlue-900"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />
                </div>
            </div>
            
            <button 
              onClick={handleProcess}
              disabled={isPending || selectedPhones.length === 0}
              className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center transition-all shadow-lg shadow-emerald-900/20"
            >
              <Save size={20} className="mr-2" /> 
              {isPending ? 'Processing...' : `Confirm ₹${selectedPhones.length * amount} Collection`}
            </button>
          </div>

          {/* Member List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-4 w-16 text-center">
                    <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-slate-300 text-trustBlue-600 focus:ring-trustBlue-500"
                        checked={selectedPhones.length === members?.length && members?.length > 0}
                        onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-4 font-bold">Member Name</th>
                  <th className="px-6 py-4 font-bold">Phone Number</th>
                  <th className="px-6 py-4 font-bold text-right">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                    <tr><td colSpan={4} className="py-10 text-center text-slate-400 italic">Loading members...</td></tr>
                ) : (
                    members?.map((member: any) => (
                    <tr 
                        key={member._id} 
                        onClick={() => toggleMember(member.phone_number)}
                        className={`hover:bg-trustBlue-50/30 cursor-pointer transition-colors ${selectedPhones.includes(member.phone_number) ? 'bg-trustBlue-50/50' : ''}`}
                    >
                        <td className="px-8 py-4 text-center">
                        <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-slate-300 text-trustBlue-600 focus:ring-trustBlue-500"
                            checked={selectedPhones.includes(member.phone_number)}
                            readOnly
                        />
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold uppercase">
                                    {member.full_name[0]}
                                </div>
                                <span className="font-semibold text-slate-700">{member.full_name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-sm">{member.phone_number}</td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-600">₹{amount}</td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}