import React, { useState } from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '../App';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginState, setLoginState] = useState('idle'); // 'idle', 'initializing', 'granted'
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoginState('initializing');
    
    // Simulate network delay for effect
    setTimeout(() => {
      // Admin Check
      if (email === 'Aditya' && password === 'Aditya20@') {
        setLoginState('granted');
        setTimeout(() => {
          setUser({ email: 'Aditya', role: 'admin' });
          navigate('/admin-dashboard');
        }, 1000);
        return;
      }
      
      // Citizen Check
      const citizen = MOCK_USERS.find(u => u.email === email && u.password === password);
      if (citizen) {
        setLoginState('granted');
        setTimeout(() => {
          setUser({ email: citizen.email, role: 'citizen', ward_number: citizen.ward_number });
          navigate('/');
        }, 1000);
        return;
      }

      setLoginState('idle');
      alert("SYS.ERR: Invalid Credentials");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 selection:bg-maroon-500 selection:text-white font-mono">
      <div className="w-full max-w-md glass-panel p-8 border border-white/10 relative">
        {/* Subtle border pop effect */}
        <div className="absolute inset-0 border border-white/20 pointer-events-none mix-blend-overlay"></div>
        
        {/* Header Section */}
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex p-3 bg-white/5 border border-white/10 mb-6">
            <ShieldCheck className="text-maroon-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-widest uppercase">SYS.GOV.<span className="text-maroon-500">AI</span></h2>
          <p className="text-gray-500 text-xs tracking-widest uppercase mt-2">Authentication_Required</p>
        </div>

        {/* Form Section */}
        <div className="relative z-10">
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Email_Address</label>
              <input 
                type="text" 
                className="w-full bg-black/50 border border-white/20 p-4 text-white placeholder-gray-600 focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 outline-none transition-colors duration-300" 
                placeholder="USER@SYS.GOV"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Security_Key</label>
              <input 
                type="password"
                className="w-full bg-black/50 border border-white/20 p-4 text-white placeholder-gray-600 focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 outline-none transition-colors duration-300" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loginState !== 'idle'}
              className={`w-full py-5 font-bold transition-all duration-300 flex items-center justify-center uppercase tracking-widest border ${
                loginState === 'granted' 
                  ? 'bg-green-600 text-white border-green-600' 
                  : 'bg-maroon-500 text-white border-maroon-500 hover:bg-maroon-600 hover:border-maroon-600 disabled:opacity-70'
              }`}
            >
              {loginState === 'idle' && <><LogIn className="mr-3" size={20} /> EXECUTE_LOGIN</>}
              {loginState === 'initializing' && 'INITIALIZING...'}
              {loginState === 'granted' && 'ACCESS GRANTED'}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/10">
            <Link 
              to="/register"
              className="text-xs text-gray-400 hover:text-white tracking-widest uppercase transition-colors duration-300 block w-full"
            >
              [ Request Access Credentials ]
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;