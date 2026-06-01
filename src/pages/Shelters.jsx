import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, MoreVertical, Mail, Phone, MapPin, 
  Calendar, CheckCircle, XCircle, Eye, Edit, Trash2, 
  UserPlus, Shield, Download, ChevronDown, Building,
  AlertCircle, RefreshCw, MessageCircle, Ban, FileText,
  Award, Clock, Verified, Heart, DollarSign
} from 'lucide-react';
import API from '../api';
import '../styles/Users.css';
import defaultProfile from '../assets/profile.png';

export default function Shelters() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVerification, setFilterVerification] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchShelters();
  }, []);

  const fetchShelters = async () => {
    try {
      const response = await API.get('/admin/shelters');
      setShelters(response.data);
    } catch (error) {
      console.error('Error fetching shelters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShelter = async (shelterId) => {
    try {
      await API.delete(`/admin/users/shelters/${shelterId}`);
      fetchShelters();
      setShowDeleteConfirm(false);
      setSelectedShelter(null);
    } catch (error) {
      console.error('Error deleting shelter:', error);
    }
  };

  const handleVerifyShelter = async (shelterId, verified) => {
    try {
      await API.put(`/admin/shelters/${shelterId}/verify`, { verified });
      fetchShelters();
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  };

  const handleStatusChange = async (shelterId, newStatus) => {
    try {
      await API.patch(`/admin/shelters/${shelterId}/status`, { status: newStatus });
      fetchShelters();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAddShelter = async (shelterData) => {
    try {
      await API.post('/admin/shelters', shelterData);
      fetchShelters();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding shelter:', error);
    }
  };

  const handleViewDetails = (shelter) => {
    setSelectedShelter(shelter);
    setShowDetailsModal(true);
  };

  const filteredShelters = shelters.filter(shelter => {
    if (searchTerm && !shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !shelter.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterStatus !== 'all' && shelter.status !== filterStatus) return false;
    if (filterVerification !== 'all') {
      const isVerified = filterVerification === 'verified';
      if (shelter.isVerified !== isVerified) return false;
    }
    return true;
  });

  if (loading) return <div className="loader-modern">Loading shelters...</div>;

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1 className="page-title">Shelter Management</h1>
          <p className="page-subtitle">Manage and monitor all shelter accounts</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <Download size={18} />
            Export
          </button>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <UserPlus size={18} />
            Add Shelter
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-mini-grid">
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>
            <Building size={20} />
          </div>
          <div>
            <h4>Total Shelters</h4>
            <p>{shelters.length}</p>
          </div>
        </div>
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#d1fae5', color: '#10b981' }}>
            <Verified size={20} />
          </div>
          <div>
            <h4>Verified</h4>
            <p>{shelters.filter(s => s.isVerified).length}</p>
          </div>
        </div>
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Clock size={20} />
          </div>
          <div>
            <h4>Pending Verification</h4>
            <p>{shelters.filter(s => !s.isVerified && s.status === 'active').length}</p>
          </div>
        </div>
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <Ban size={20} />
          </div>
          <div>
            <h4>Suspended</h4>
            <p>{shelters.filter(s => s.status === 'suspended').length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-filter">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="status-filter">
          <Filter size={18} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <div className="status-filter">
          <Shield size={18} />
          <select value={filterVerification} onChange={(e) => setFilterVerification(e.target.value)}>
            <option value="all">All Verification</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
        <button className="refresh-btn" onClick={fetchShelters}>
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Shelters Grid - Larger cards, up to 4 per row */}
      <div className="shelters-grid">
        {filteredShelters.map(shelter => (
          <ShelterCard 
            key={shelter.id} 
            shelter={shelter}
            onStatusChange={handleStatusChange}
            onVerify={handleVerifyShelter}
            onDelete={handleDeleteShelter}
            onViewDetails={() => handleViewDetails(shelter)}
          />
        ))}
      </div>

      {filteredShelters.length === 0 && (
        <div className="empty-state">
          <Building size={48} />
          <h3>No shelters found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <ShelterModal 
          onClose={() => setShowAddModal(false)}
          onSave={handleAddShelter}
        />
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedShelter && (
        <ShelterDetailsModal
          shelter={selectedShelter}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedShelter(null);
          }}
          onStatusChange={handleStatusChange}
          onVerify={handleVerifyShelter}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedShelter && (
        <DeleteConfirmModal
          shelter={selectedShelter}
          onConfirm={() => handleDeleteShelter(selectedShelter.id)}
          onClose={() => {
            setShowDeleteConfirm(false);
            setSelectedShelter(null);
          }}
        />
      )}
    </div>
  );
}

// Larger Shelter Card Component
const ShelterCard = ({ shelter, onStatusChange, onVerify, onDelete, onViewDetails }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'status-active';
      case 'pending': return 'status-pending';
      case 'suspended': return 'status-suspended';
      default: return 'status-inactive';
    }
  };

  return (
    <div className="shelter-card">
      <div className="shelter-card-header">
        <div className="shelter-avatar" style={{ width: 60, height: 60, borderRadius: '15px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
          <img 
            src={shelter.profileImage ? shelter.profileImage : defaultProfile} 
            alt={shelter.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
      </div>
        <div className="shelter-header-info">
          <h3 className="shelter-name">{shelter.name}</h3>
          <div className="shelter-badges">
            <span className={`status-badge ${getStatusColor(shelter.status)}`}>
              {shelter.status === 'active' && <CheckCircle size={12} />}
              {shelter.status === 'suspended' && <XCircle size={12} />}
              {shelter.status}
            </span>
            {shelter.isVerified && (
              <span className="verified-badge-small">
                <Verified size={12} />
                Verified
              </span>
            )}
          </div>
        </div>
        <div className="shelter-actions">
          <button className="menu-btn" onClick={() => setShowMenu(!showMenu)}>
            <MoreVertical size={18} />
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={onViewDetails}><Eye size={14} /> View Details</button>
              {!shelter.isVerified && (
                <button onClick={() => onVerify(shelter.id, true)}>
                  <Award size={14} /> Verify Shelter
                </button>
              )}
              <button onClick={() => onStatusChange(shelter.id, shelter.status === 'active' ? 'suspended' : 'active')}>
                <Ban size={14} /> {shelter.status === 'active' ? 'Suspend' : 'Activate'}
              </button>
              <button className="danger" onClick={() => onDelete(shelter.id)}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="shelter-card-body">
        <div className="shelter-contact-info">
          <div className="contact-detail">
            <Mail size={14} />
            <span>{shelter.email}</span>
          </div>
          <div className="contact-detail">
            <Phone size={14} />
            <span>{shelter.phone || 'Not provided'}</span>
          </div>
          <div className="contact-detail">
            <MapPin size={14} />
            <span>{shelter.address || 'Address not set'}</span>
          </div>
          <div className="contact-detail">
            <Calendar size={14} />
            <span>Joined {new Date(shelter.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="shelter-stats">
          <div className="stat-box">
            <div className="stat-icon">
              <Heart size={18} />
            </div>
            <div>
              <div className="stat-value">{shelter.petsCount}</div>
              <div className="stat-label">Pets Listed</div>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">
              <CheckCircle size={18} />
            </div>
            <div>
              <div className="stat-value">{shelter.adoptionsCount}</div>
              <div className="stat-label">Adoptions</div>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">
              <DollarSign size={18} />
            </div>
            <div>
              <div className="stat-value">{shelter.donationPostsCount}</div>
              <div className="stat-label">Donation Posts</div>
            </div>
          </div>
        </div>

        <div className="shelter-card-footer">
          <button className="btn-view-details" onClick={onViewDetails}>
            <Eye size={16} />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

// Shelter Details Modal
const ShelterDetailsModal = ({ shelter, onClose, onStatusChange, onVerify }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Shelter Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="shelter-details-modal">
          <div className="details-header">
            <div className="shelter-avatar-large">
              {shelter.logo ? (
                <img src={shelter.logo} alt={shelter.name} />
              ) : (
                <div className="avatar-placeholder" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', fontSize: '48px' }}>
                  {shelter.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="details-header-info">
              <h3>{shelter.name}</h3>
              <p>{shelter.email}</p>
              <div className="badges-group">
                <span className={`status-badge ${shelter.status === 'active' ? 'status-active' : 'status-suspended'}`}>
                  {shelter.status}
                </span>
                {shelter.isVerified && (
                  <span className="verified-badge">
                    <Verified size={14} />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="details-section">
            <h4>Contact Information</h4>
            <div className="details-grid">
              <div className="detail-item">
                <Phone size={16} />
                <strong>Phone:</strong>
                <span>{shelter.phone || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <Mail size={16} />
                <strong>Email:</strong>
                <span>{shelter.email}</span>
              </div>
              <div className="detail-item">
                <MapPin size={16} />
                <strong>Address:</strong>
                <span>{shelter.address || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <Calendar size={16} />
                <strong>Joined:</strong>
                <span>{new Date(shelter.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {shelter.description && (
            <div className="details-section">
              <h4>Description</h4>
              <p className="shelter-description">{shelter.description}</p>
            </div>
          )}

          <div className="details-section">
            <h4>Activity Statistics</h4>
            <div className="stats-grid-3">
              <div className="stat-card">
                <Heart size={24} />
                <div className="stat-value">{shelter.petsCount || 0}</div>
                <div className="stat-label">Pets Listed</div>
              </div>
              <div className="stat-card">
                <CheckCircle size={24} />
                <div className="stat-value">{shelter.adoptionsCount || 0}</div>
                <div className="stat-label">Successful Adoptions</div>
              </div>
              <div className="stat-card">
                <DollarSign size={24} />
                <div className="stat-value">{shelter.donationPostsCount || 0}</div>
                <div className="stat-label">Donation Posts</div>
              </div>
            </div>
          </div>

          {shelter.recentDonationPosts && shelter.recentDonationPosts.length > 0 && (
            <div className="details-section">
              <h4>Recent Donation Posts</h4>
              <div className="donation-posts-list">
                {shelter.recentDonationPosts.map((post, index) => (
                  <div key={index} className="donation-post-item">
                    <div className="donation-post-title">{post.title}</div>
                    <div className="donation-post-meta">
                      <span>Goal: ${post.goalAmount}</span>
                      <span>Raised: ${post.raisedAmount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="modal-actions">
          {!shelter.isVerified && (
            <button 
              className="btn-primary"
              onClick={() => onVerify(shelter.id, true)}
            >
              <Award size={16} />
              Verify Shelter
            </button>
          )}
          <button 
            className="btn-secondary"
            onClick={() => onStatusChange(shelter.id, shelter.status === 'active' ? 'suspended' : 'active')}
          >
            <Ban size={16} />
            {shelter.status === 'active' ? 'Suspend Shelter' : 'Activate Shelter'}
          </button>
          <button className="btn-cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

const ShelterModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Shelter</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Shelter Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter shelter name"
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Enter address"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Enter shelter description"
            />
          </div>
          <div className="form-group">
            <label>Temporary Password *</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Enter temporary password"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">Add Shelter</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ shelter, onConfirm, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2>Confirm Delete</h2>
      </div>
      <div className="modal-body">
        <AlertCircle size={48} color="#dc2626" />
        <p>Are you sure you want to delete <strong>{shelter?.name}</strong>?</p>
        <p className="text-muted">This will also remove all pets, donation posts, and data associated with this shelter.</p>
      </div>
      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-danger" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);