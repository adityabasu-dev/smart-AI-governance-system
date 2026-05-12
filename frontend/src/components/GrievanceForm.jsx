import React, { useState, useEffect } from 'react';
import api from '../api/config';
import { MapPin, Send, Loader2, CheckCircle } from 'lucide-react';

const GrievanceForm = ({ user }) => {
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    // Default to Bengaluru for the demo
    latitude: 12.9716, 
    longitude: 77.5946 
  });
  const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success'
  const [grievanceId, setGrievanceId] = useState(null);

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setFormData(prev => ({ ...prev, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
      // Alert removed for a more minimalist feel, or can use a custom toast
    }, () => {
      // Fallback
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const payload = {
        ...formData,
        ward_number: user?.ward_number || 'UNKNOWN'
      };
      const response = await api.post('/citizen/submit', payload);
      setGrievanceId(response.data.id);
      setStatus('success');
      setFormData({ title: '', description: '', latitude: 12.9716, longitude: 77.5946 });
      
      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setGrievanceId(null);
      }, 5000);
    } catch (err) {
      alert("SYS.ERR: Backend Connection Error.");
      setStatus('idle');
    }
  };

  return (
    <div className="max-w-2xl mx-auto glass-panel p-8 md:p-12">
      <h2 className="text-3xl font-mono font-bold text-white mb-2 uppercase tracking-wider">File_Report</h2>
      <p className="text-gray-400 font-mono text-sm mb-10 tracking-wide">
        AI will automatically categorize and prioritize your grievance. 
        {user?.ward_number && <span className="text-maroon-500 ml-2">[ WARD: {user.ward_number} ]</span>}
      </p>
      
      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
          <CheckCircle className="text-maroon-500 w-16 h-16 mb-4" />
          <h3 className="text-2xl font-mono font-bold text-white uppercase">Transmission_Complete</h3>
          <p className="text-gray-400 font-mono text-sm">Your report has been logged.</p>
          <div className="mt-4 p-4 border border-white/10 bg-black/50 font-mono text-maroon-500">
            ID: {grievanceId}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 font-mono">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Subject</label>
            <input 
              className="w-full bg-black/50 border border-white/20 p-4 text-white placeholder-gray-600 focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 outline-none transition-colors duration-300" 
              placeholder="e.g., Severe Water Leakage" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Detailed_Description</label>
            <textarea 
              className="w-full bg-black/50 border border-white/20 p-4 text-white placeholder-gray-600 h-48 focus:border-maroon-500 focus:ring-1 focus:ring-maroon-500 outline-none transition-colors duration-300 resize-none" 
              placeholder="Please describe the issue in detail..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>
          
          <button type="button" onClick={detectLocation} className="flex items-center text-xs text-gray-400 hover:text-white uppercase tracking-widest transition-colors duration-300">
            <MapPin size={16} className="mr-3" />
            LOC: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
          </button>

          <button 
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-maroon-500 text-white py-5 font-bold flex justify-center items-center hover:bg-maroon-600 transition-colors duration-300 disabled:bg-gray-800 disabled:text-gray-500 uppercase tracking-widest border border-maroon-500 hover:border-maroon-600 disabled:border-gray-800"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="animate-spin mr-3" size={20} />
                Processing with AI...
              </>
            ) : (
              <>
                <Send className="mr-3" size={20} />
                Submit
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default GrievanceForm;