import React, { useState } from 'react';
import { UserPlus, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    wardNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network delay for Mock Registration
    setTimeout(() => {
      alert("SYS: Citizen Identity Registered. Please Execute Login.");
      setLoading(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 selection:bg-maroon-500 selection:text-white font-mono py-12">
      <div className="w-full max-w-md glass-panel p-8 border border-white/10 relative">
        {/* Subtle border pop effect */}
        <div className="absolute inset-0 border border-white/20 pointer-events-none mix-blend-overlay"></div>
        
        {/* Header Section */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex p-3 bg-white/5 border border-white/10 mb-4">
            <ShieldCheck className="text-maroon-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-widest uppercase">SYS.GOV.<span className="text-maroon-500">AI</span></h2>
          <p className="text-gray-500 text-xs tracking-widest uppercase mt-2">Initialize_New_Citizen</p>
        </div>

        {/* Form Section */}
        <div className="relative z-10">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full_Name</label>
              <input 
                type="text"
                className="w-full bg-black/50 border border-white/20 p-3 text-white placeholder-gray-600 focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 outline-none transition-colors duration-300" 
                placeholder="JOHN DOE"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email_Address</label>
              <input 
                type="email"
                className="w-full bg-black/50 border border-white/20 p-3 text-white placeholder-gray-600 focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 outline-none transition-colors duration-300" 
                placeholder="USER@SYS.GOV"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Security_Key</label>
              <input 
                type="password"
                className="w-full bg-black/50 border border-white/20 p-3 text-white placeholder-gray-600 focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 outline-none transition-colors duration-300" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Ward_Number</label>
              <input 
                type="text"
                className="w-full bg-black/50 border border-white/20 p-3 text-white placeholder-gray-600 focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 outline-none transition-colors duration-300" 
                placeholder="WARD_01"
                value={formData.wardNumber}
                onChange={(e) => setFormData({...formData, wardNumber: e.target.value})}
                required
              />
            </div>

            <button 
              disabled={loading}
              className="w-full mt-2 bg-maroon-500 text-white py-4 font-bold hover:bg-maroon-600 transition-colors duration-300 flex items-center justify-center uppercase tracking-widest border border-maroon-500 hover:border-maroon-600 disabled:opacity-50"
            >
              <UserPlus className="mr-3" size={20} />
              {loading ? "INITIALIZING..." : "JOIN PORTAL"}
            </button>
          </form>

          <div className="mt-6 text-center pt-6 border-t border-white/10">
            <Link 
              to="/login"
              className="text-xs text-gray-400 hover:text-white tracking-widest uppercase transition-colors duration-300 block w-full"
            >
              [ Switch to Login Stream ]
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
