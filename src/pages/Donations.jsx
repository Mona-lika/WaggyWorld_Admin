import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Heart, DollarSign, Package, 
  Calendar, Eye, Trash2, Building, RefreshCw, Download , MapPin
} from 'lucide-react';
import API from '../api';
import '../styles/Users.css';

export default function Donations() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await API.get('/admin/donations');
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseDatabaseDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    
    // Check if it's already ISO format (YYYY-MM-DD)
    const isoDate = new Date(dateStr);
    if (!isNaN(isoDate.getTime())) return isoDate;

    // Handle DD/MM/YYYY format manually
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      // month is 0-indexed in JS (January is 0)
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    Part}
    
    return isoDate;
  };

  const getStatus = (endDate, collected, target, donationType) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    const expiry = parseDatabaseDate(endDate);
    expiry.setHours(23, 59, 59, 999);

    const isFund = donationType === 'Fund';
    const goalReached = isFund && parseFloat(collected || 0) >= parseFloat(target || 0);

    if (goalReached) {
        return { label: 'Goal Reached', color: '#059669', bg: '#ecfdf5' };
    }
    
    if (today > expiry) {
        return { label: 'Expired', color: '#dc2626', bg: '#fef2f2' };
    }

    return { label: 'Active', color: '#2563eb', bg: '#eff6ff' };
  };

  const filteredCampaigns = campaigns.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.shelterName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loader-modern">Loading donation campaigns...</div>;

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1 className="page-title">Donation Management</h1>
          <p className="page-subtitle">Track fundraising progress and supply contributions</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary"><Download size={18} /> Export Report</button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-mini-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}><Heart size={20} /></div>
          <div><h4>Total Campaigns</h4><p>{campaigns.length}</p></div>
        </div>
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#ecfdf5', color: '#10b981' }}><DollarSign size={20} /></div>
          <div><h4>Funds Type</h4><p>{campaigns.filter(c => c.donationType === 'Fund').length}</p></div>
        </div>
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#fef3c7', color: '#d97706' }}><Package size={20} /></div>
          <div><h4>Supplies Type</h4><p>{campaigns.filter(c => c.donationType === 'Supplies').length}</p></div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filters-bar">
        <div className="search-filter" style={{ flex: 1 }}>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by title or shelter..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="refresh-btn" onClick={fetchCampaigns}><RefreshCw size={18} /></button>
      </div>

      {/* Donations Grid - 4 Columns */}
      <div style={styles.grid}>
        {filteredCampaigns.map(camp => {
          const status = getStatus(camp.endDate, camp.collectedAmount, camp.targetAmount, camp.donationType);
          const isFund = camp.donationType === 'Fund';
          const progress = isFund ? Math.min(Math.round((parseFloat(camp.collectedAmount || 0) / parseFloat(camp.targetAmount)) * 100), 100) : 0;

          return (
            <div key={camp.id} style={styles.card}>
              <div style={styles.imageWrapper}>
                <img 
                   src={camp.imageUrls?.[0] || '/placeholder-don.png'} 
                   style={styles.cardImg} 
                   alt="Donation"
                />
                <span style={{...styles.typeBadge, backgroundColor: isFund ? '#eff6ff' : '#f5f3ff', color: isFund ? '#2563eb' : '#7c3aed'}}>
                    {camp.donationType}
                </span>
                <span style={{...styles.statusBadge, backgroundColor: status.bg, color: status.color}}>
                    {status.label}
                </span>
              </div>

              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{camp.title}</h3>
                <div style={styles.shelterInfo}>
                    <MapPin size={12} /> <span>{camp.shelterName}</span>
                </div>
                
                <p style={styles.description}>
                  {camp.description.length > 60 ? camp.description.substring(0, 60) + "..." : camp.description}
                </p>

                <div style={styles.statsContainer}>
                    {isFund ? (
                        <>
                            <div style={styles.statRow}>
                                <span style={styles.statLabel}>Raised:</span>
                                <span style={styles.statValue}>Rs. {camp.collectedAmount || 0}</span>
                            </div>
                            <div style={styles.progressBarBg}>
                                <div style={{...styles.progressBarFill, width: `${progress}%`}} />
                            </div>
                            <span style={styles.progressText}>{progress}% of Rs. {camp.targetAmount}</span>
                        </>
                    ) : (
                        <>
                            <div style={styles.statRow}>
                                <span style={styles.statLabel}>Category:</span>
                                <span style={{...styles.statValue, color: '#7c3aed'}}>{camp.suppliesCategory}</span>
                            </div>
                            <div style={{...styles.statRow, marginTop: '8px'}}>
                                <Package size={14} color="#64748b" />
                                <span style={{marginLeft: '5px', fontSize: '13px', fontWeight: 'bold', color: '#1e293b'}}>
                                    {camp.dropOffCount || 0} items received
                                </span>
                            </div>
                        </>
                    )}
                </div>

                <div style={styles.cardFooter}>
                    <button style={styles.viewBtn}><Eye size={16} /> View </button>
                    <button style={styles.deleteBtn}><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px' },
  card: { backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' },
  imageWrapper: { position: 'relative', height: '140px' },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover' },
  typeBadge: { position: 'absolute', bottom: '10px', left: '10px', padding: '3px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' },
  statusBadge: { position: 'absolute', top: '10px', right: '10px', padding: '3px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold' },
  cardBody: { padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  shelterInfo: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#64748b', marginBottom: '10px' },
  description: { fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', marginBottom: '15px', height: '36px', overflow: 'hidden' },
  statsContainer: { backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px', marginBottom: '15px' },
  statRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { fontSize: '11px', color: '#64748b', fontWeight: '600' },
  statValue: { fontSize: '13px', fontWeight: 'bold', color: '#059669' },
  progressBarBg: { height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', marginTop: '8px' },
  progressBarFill: { height: '100%', backgroundColor: '#20b8f4', borderRadius: '3px' },
  progressText: { fontSize: '10px', color: '#94a3b8', marginTop: '4px', display: 'block', textAlign: 'right' },
  cardFooter: { display: 'flex', gap: '10px', marginTop: 'auto' },
  viewBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#f0faff', color: '#20b8f4', fontWeight: 'bold', cursor: 'pointer' },
  deleteBtn: { padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#fef2f2', color: '#ef4444', cursor: 'pointer' }
};