import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Activity, Heart, Shield, 
  Download, RefreshCw, Eye, User, Pill, Stethoscope, 
  Calendar, AlertCircle, CheckCircle, Clock, Users
} from 'lucide-react';
import API from '../api';
import '../styles/Users.css';

export default function HealthLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await API.get('/admin/health-logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching health logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const search = searchTerm.toLowerCase();
    return log.petName?.toLowerCase().includes(search) || 
           log.ownerName?.toLowerCase().includes(search) ||
           log.breed?.toLowerCase().includes(search);
  });

  if (loading) return <div className="loader-modern">Loading health records...</div>;

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1 className="page-title">Pet Health Monitoring</h1>
          <p className="page-subtitle">Oversee medical records and tracker logs for all registered pets</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary"><Download size={18} /> Export Health Data</button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-mini-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}><Activity size={20} /></div>
          <div><h4>Total Pets</h4><p>{logs.length}</p></div>
        </div>
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#ecfdf5', color: '#059669' }}><Shield size={20} /></div>
          <div><h4>Vaccinated</h4><p>{logs.filter(l => l.lastVaccine).length}</p></div>
        </div>
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#fffbeb', color: '#d97706' }}><Calendar size={20} /></div>
          <div><h4>Upcoming Visits</h4><p>{logs.filter(l => l.nextVetVisit).length}</p></div>
        </div>
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#fef2f2', color: '#dc2626' }}><AlertCircle size={20} /></div>
          <div><h4>Conditions</h4><p>{logs.filter(l => l.medicalConditions).length}</p></div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="filters-bar">
        <div className="search-filter" style={{ flex: 1 }}>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by pet name, owner, or breed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="refresh-btn" onClick={fetchLogs}><RefreshCw size={18} /></button>
      </div>

      {/* Data Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Pet</th>
              <th>Owner</th>
              <th>Sharing Members</th>
              <th>Vaccinations</th>
              <th>Vet Visits</th>
              <th>Medical Issues</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id}>
                <td className="user-cell">
                  <div className="user-info">
                    <div className="user-avatar-table" style={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      {log.imageUrl ? (
                        <img src={log.imageUrl} alt={log.petName} style={{ objectFit: 'cover' }} />
                      ) : (
                        <div className="avatar-placeholder-small" style={{ background: '#f1f5f9', color: '#94a3b8' }}>
                          <Activity size={16} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="user-name-table">{log.petName}</div>
                      <div className="user-email-table">{log.breed || log.species}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <User size={14} color="#94a3b8" />
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>
                        {log.primaryOwner || 'N/A'}
                    </span>
                    </div>
                </td>

                {/* SHARING MEMBERS COLUMN */}
                <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Users size={14} color="#94a3b8" />
                    <span style={{ 
                        fontSize: '13px', 
                        color: log.sharingMembers === 'None' ? '#cbd5e1' : '#475569',
                        fontStyle: log.sharingMembers === 'None' ? 'italic' : 'normal'
                    }}>
                        {log.sharingMembers}
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '12px' }}>
                    <div style={{ color: '#059669' }}><CheckCircle size={10} style={{display:'inline'}}/> Last: {log.lastVaccine || 'None'}</div>
                    <div style={{ color: '#4f46e5', fontWeight: '600' }}><Clock size={10} style={{display:'inline'}}/> Next: {log.nextVaccine || '—'}</div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '12px' }}>
                    <div style={{ color: '#64748b' }}><Stethoscope size={10} style={{display:'inline'}}/> Last: {log.lastVetVisit || '—'}</div>
                    <div style={{ color: '#d97706', fontWeight: '600' }}><Calendar size={10} style={{display:'inline'}}/> Next: {log.nextVetVisit || '—'}</div>
                  </div>
                </td>
                <td>
                  <span style={{ 
                    fontSize: '12px', 
                    color: log.medicalConditions ? '#dc2626' : '#94a3b8',
                    fontStyle: log.medicalConditions ? 'normal' : 'italic'
                  }}>
                    {log.medicalConditions ? (log.medicalConditions.substring(0, 20) + '...') : 'Healthy'}
                  </span>
                </td>
                <td>
                  <button className="action-btn view-btn" title="View Full Health History">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="empty-state">
            <Activity size={48} color="#cbd5e1" />
            <h3>No health logs found</h3>
          </div>
        )}
      </div>
    </div>
  );
}