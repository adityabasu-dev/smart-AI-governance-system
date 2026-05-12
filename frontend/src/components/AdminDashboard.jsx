import React, { useEffect, useState } from 'react';
import api from '../api/config';
import { AlertTriangle, CheckCircle2, Clock, Trash2, Check, Flag } from 'lucide-react';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [flaggedIds, setFlaggedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('flaggedGrievances')) || [];
    } catch {
      return [];
    }
  });

  const fetchReports = async () => {
    try {
      const response = await api.get('/admin/prioritized-list');
      setReports(response.data);
    } catch (err) {
      console.error("SYS.ERR: Failed to fetch dashboard data.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // Short polling every 5 seconds for real-time feel without Firebase snapshot
    const interval = setInterval(fetchReports, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFlag = (id) => {
    setFlaggedIds(prev => {
      const newIds = prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id];
      localStorage.setItem('flaggedGrievances', JSON.stringify(newIds));
      return newIds;
    });
  };

  const handleDismiss = async (id) => {
    try {
      // Optimistic fade-out
      setReports(reports.map(r => r.id === id ? { ...r, isRemoving: true } : r));
      
      await api.delete(`/admin/grievance/${id}`);
      
      // Remove after animation completes
      setTimeout(() => {
        setReports(current => current.filter(r => r.id !== id));
      }, 300);
    } catch (err) {
      console.error("SYS.ERR: Failed to dismiss grievance.", err);
      alert("SYS.ERR: Could not delete entry.");
      // revert optimistic update
      setReports(reports.map(r => r.id === id ? { ...r, isRemoving: false } : r));
    }
  };

  const handleResolve = async (id) => {
    try {
      await api.patch(`/admin/resolve/${id}`);
      // Optimistically update the UI
      setReports(reports.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
    } catch (err) {
      console.error("SYS.ERR: Failed to resolve grievance.", err);
      alert("SYS.ERR: Could not update status.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-mono">
      <header className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Admin_Terminal</h2>
          <p className="text-maroon-500 text-sm tracking-widest uppercase mt-1">AI-Prioritized Response Queue</p>
        </div>
        <div className="text-xs text-gray-500 uppercase flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-maroon-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-maroon-500"></span>
          </span>
          <span>Live Sync</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Active_Queue" value={reports.filter(r => r.status !== 'resolved').length} icon={<Clock className="text-gray-400" />} />
        <StatCard title="Critical_Alerts" value={reports.filter(r => (r.urgency_score || 0) > 80 && r.status !== 'resolved').length} icon={<AlertTriangle className="text-maroon-500" />} />
        <StatCard title="Resolved" value={reports.filter(r => r.status === 'resolved').length} icon={<CheckCircle2 className="text-gray-600" />} />
      </div>

      <div className="glass-panel overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-widest text-gray-400">
              <tr>
                <th className="p-5 font-bold">Grievance_ID</th>
                <th className="p-5 font-bold">Category_AI</th>
                <th className="p-5 font-bold">Urgency_Lvl</th>
                <th className="p-5 font-bold">Status</th>
                <th className="p-5 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading && reports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500 uppercase tracking-widest">
                    Initializing Data Stream...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500 uppercase tracking-widest">
                    Queue Empty
                  </td>
                </tr>
              ) : reports.map((report) => (
                <React.Fragment key={report.id}>
                <tr className={`hover:bg-white/5 transition-all duration-300 group ${report.isRemoving ? 'opacity-0 -translate-x-4' : 'opacity-100'}`}>
                  <td className="p-5">
                    <div 
                      className="font-bold text-white mb-1 group-hover:text-maroon-500 transition-colors cursor-pointer flex items-center"
                      onClick={() => setExpandedRow(expandedRow === report.id ? null : report.id)}
                    >
                      {report.title}
                      <span className="ml-2 text-[10px] text-gray-500 transition-transform duration-300 transform" style={{ transform: expandedRow === report.id ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                    </div>
                    <div className="text-xs text-gray-600 tracking-wider uppercase mt-1">ID: {report.id?.substring(0, 8)}...</div>
                  </td>
                  <td className="p-5">
                    <span className={`px-2 py-1 text-xs border uppercase tracking-wider ${getCategoryStyle(report.category)}`}>
                      {report.category || 'ANALYZING...'}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center space-x-3">
                      <div className="text-xs font-bold w-8">{report.urgency_score || 0}%</div>
                      <div className="flex-1 bg-white/10 h-1 max-w-[120px]">
                        <div 
                          className={`h-1 transition-all duration-1000 ${report.urgency_score > 70 ? 'bg-maroon-500' : 'bg-gray-400'}`} 
                          style={{ width: `${Math.min(100, Math.max(0, report.urgency_score || 0))}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    {flaggedIds.includes(report.id) && report.status !== 'resolved' ? (
                      <span className="flex items-center text-xs text-[#800000] uppercase tracking-wider font-bold animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full mr-2 bg-[#800000]"></span>
                        [ FLAGGED ]
                      </span>
                    ) : (
                      <span className="flex items-center text-xs text-gray-400 uppercase tracking-wider">
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${report.status === 'resolved' ? 'bg-maroon-500' : 'bg-gray-500'}`}></span>
                        {report.status}
                      </span>
                    )}
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {report.status !== 'resolved' && (
                        <>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleFlag(report.id); }}
                            className={`${flaggedIds.includes(report.id) ? 'text-[#800000]' : 'text-gray-400 hover:text-[#800000]'} transition-colors duration-300 p-1 relative group/flag`}
                          >
                            <Flag size={18} className={flaggedIds.includes(report.id) ? 'fill-current' : ''} />
                            <span className="absolute bottom-full right-0 mb-2 w-max px-2 py-1 bg-black/80 backdrop-blur-sm text-xs text-gray-300 rounded opacity-0 group-hover/flag:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                              {flaggedIds.includes(report.id) ? 'Remove Flag' : 'Flag for review'}
                            </span>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleResolve(report.id); }}
                            className="text-gray-400 hover:text-green-400 transition-colors duration-300 p-1 relative group/resolve"
                          >
                            <Check size={18} />
                            <span className="absolute bottom-full right-0 mb-2 w-max px-2 py-1 bg-black/80 backdrop-blur-sm text-xs text-gray-300 rounded opacity-0 group-hover/resolve:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                              Mark as Resolved
                            </span>
                          </button>
                        </>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDismiss(report.id); }}
                        className="text-gray-500 hover:text-red-500 transition-colors duration-300 p-1 relative group/tooltip"
                      >
                        <Trash2 size={18} />
                        <span className="absolute bottom-full right-0 mb-2 w-max px-2 py-1 bg-black/80 backdrop-blur-sm text-xs text-gray-300 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                          Remove from system
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className={`transition-all duration-300 ${report.isRemoving ? 'opacity-0' : 'opacity-100'}`}>
                  <td colSpan="5" className="p-0 border-0">
                    <div 
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        expandedRow === report.id ? 'max-h-[500px] opacity-100 border-b border-white/5' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="p-6 bg-white/5 border-l-4 border-[#800000] m-2 rounded-r-md">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div className="md:col-span-3">
                            <h4 className="text-xs text-gray-400 uppercase tracking-widest mb-2">Full_Description</h4>
                            <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed font-mono">{report.description || 'No description provided.'}</p>
                          </div>
                          <div className="space-y-4 font-mono">
                            <div>
                              <h4 className="text-xs text-gray-400 uppercase tracking-widest mb-1">AI_Category</h4>
                              <span className={`inline-block px-2 py-1 text-xs border uppercase tracking-wider ${getCategoryStyle(report.category)}`}>
                                {report.category || 'ANALYZING...'}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-xs text-gray-400 uppercase tracking-widest mb-1">Confidence_Score</h4>
                              <div className="text-white text-sm font-bold">
                                {report.confidence ? `${(report.confidence * 100).toFixed(1)}%` : report.confidence_score ? `${report.confidence_score}%` : 'N/A'} <span className="text-xs text-gray-500 font-normal ml-1">BART</span>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs text-gray-400 uppercase tracking-widest mb-1">Ward_Number</h4>
                              <div className="text-white text-sm">
                                {report.ward || report.ward_number || 'Unassigned'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="glass-panel p-6 border-l-4 border-l-maroon-500 hover:border-l-white transition-colors duration-500">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{title}</p>
        <p className="text-4xl font-bold text-white mt-2 font-sans tracking-tight">{value}</p>
      </div>
      <div className="p-2 bg-white/5 border border-white/10">{icon}</div>
    </div>
  </div>
);

const getCategoryStyle = (cat) => {
  const styles = {
    'Public Safety': 'border-maroon-500 text-maroon-500 bg-maroon-500/10',
    'Infrastructure': 'border-gray-400 text-gray-300 bg-gray-400/10',
    'Sanitation': 'border-gray-500 text-gray-400 bg-gray-500/10',
    'Health': 'border-white text-white bg-white/10'
  };
  return styles[cat] || 'border-gray-700 text-gray-500 bg-black/50';
};

export default AdminDashboard;