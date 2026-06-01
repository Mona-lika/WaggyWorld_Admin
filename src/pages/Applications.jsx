import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, FileText, CheckCircle, XCircle, 
  Clock, Download, RefreshCw, Eye, Calendar, Building, User
} from 'lucide-react';
import API from '../api';
import '../styles/Users.css';
import defaultProfile from '../assets/profile.png';

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const response = await API.get('/admin/applications');
      setApps(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'approved': return { bg: '#ecfdf5', color: '#059669', label: 'Approved' };
      case 'rejected': return { bg: '#fef2f2', color: '#dc2626', label: 'Rejected' };
      case 'completed': return { bg: '#eff6ff', color: '#2563eb', label: 'Adopted' };
      default: return { bg: '#fffbeb', color: '#d97706', label: 'Pending' };
    }
  };

  const filteredApps = apps.filter(app => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = app.adopterName?.toLowerCase().includes(search) || 
                         app.petName?.toLowerCase().includes(search);
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="loader-modern">Loading applications...</div>;

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1 className="page-title">Adoption Applications</h1>
          <p className="page-subtitle">Monitor and review all adoption requests globally</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary"><Download size={18} /> Export CSV</button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-mini-grid">
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}><FileText size={20} /></div>
          <div><h4>Total Requests</h4><p>{apps.length}</p></div>
        </div>
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#d1fae5', color: '#10b981' }}><CheckCircle size={20} /></div>
          <div><h4>Approved</h4><p>{apps.filter(a => a.status === 'approved').length}</p></div>
        </div>
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <XCircle size={20} />
          </div>
          <div>
            <h4>Rejected</h4>
            <p>{apps.filter(a => a.status === 'rejected').length}</p>
          </div>
        </div>
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#fef3c7', color: '#d97706' }}><Clock size={20} /></div>
          <div><h4>Pending</h4><p>{apps.filter(a => a.status === 'pending').length}</p></div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filters-bar">
        <div className="search-filter" style={{ flex: 1 }}>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by adopter or pet name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="status-filter">
          <Filter size={18} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button className="refresh-btn" onClick={fetchApps}><RefreshCw size={18} /></button>
      </div>

      {/* Data Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Adopter</th>
              <th>Pet Details</th>
              <th>Shelter</th>
              <th>Applied On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map(app => {
              const style = getStatusStyle(app.status);
              return (
                <tr key={app.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        overflow: 'hidden', 
                        backgroundColor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #e2e8f0'
                        }}>
                        <img 
                            // Use profileImage from DB, fallback to local profile.png
                            src={app.profileImage ? app.profileImage : defaultProfile} 
                            alt={app.adopterName} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        </div>
                      <span style={{ fontWeight: '600' }}>{app.adopterName}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{app.petName}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#64748b' }}>
                      <Building size={14} /> {app.shelterName}
                    </div>
                  </td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span style={{
                      backgroundColor: style.bg,
                      color: style.color,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '800',
                      textTransform: 'uppercase'
                    }}>
                      {style.label}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn view-btn" title="View Full Application">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredApps.length === 0 && (
          <div className="empty-state">
            <FileText size={48} color="#cbd5e1" />
            <h3>No applications found</h3>
          </div>
        )}
      </div>
    </div>
  );
}