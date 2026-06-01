import React, { useState, useEffect } from 'react';
import {
  Search, Filter, MoreVertical, Mail, Phone, MapPin,
  Calendar, CheckCircle, XCircle, Eye, Edit, Trash2,
  UserPlus, Shield, Download, ChevronDown, Star,
  AlertCircle, RefreshCw, MessageCircle, Ban, Users, Clock,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import API from '../api';
import '../styles/Users.css';
import defaultProfile from '../assets/profile.png';

export default function Adopters() {
  const [adopters, setAdopters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchAdopters();
  }, []);

  const fetchAdopters = async () => {
    try {
      const response = await API.get('/admin/adopters');
      setAdopters(response.data);
    } catch (error) {
      console.error('Error fetching adopters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await API.delete(`/admin/users/${userId}`);
      fetchAdopters();
      setShowDeleteConfirm(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await API.patch(`/admin/users/${userId}/status`, { status: newStatus });
      fetchAdopters();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      await API.post('/admin/users', { ...userData, role: 'adopter' });
      fetchAdopters();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const filteredAdopters = adopters.filter(adopter => {
    if (searchTerm && !adopter.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !adopter.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterStatus !== 'all' && adopter.status !== filterStatus) return false;
    return true;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAdopters.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAdopters.length / itemsPerPage);

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'status-active';
      case 'pending': return 'status-pending';
      case 'suspended': return 'status-suspended';
      default: return 'status-inactive';
    }
  };

  if (loading) return <div className="loader-modern">Loading adopters...</div>;

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1 className="page-title">Adopter Management</h1>
          <p className="page-subtitle">Manage and monitor all adopter accounts</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <Download size={18} />
            Export
          </button>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <UserPlus size={18} />
            Add Adopter
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-mini-grid">
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>
            <Users size={20} />
          </div>
          <div>
            <h4>Total Adopters</h4>
            <p>{adopters.length}</p>
          </div>
        </div>
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <Ban size={20} />
          </div>
          <div>
            <h4>Suspended</h4>
            <p>{adopters.filter(u => u.status === 'suspended').length}</p>
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
        <button className="refresh-btn" onClick={fetchAdopters}>
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Adoptions</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(adopter => (
              <tr key={adopter.id}>
                <td className="user-cell">
                  <div className="user-info">
                    <div className="user-avatar-table" style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                      <img 
                      src={adopter.profileImage ? adopter.profileImage : defaultProfile} 
                      alt={adopter.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                    <div>
                      <div className="user-name-table">{adopter.name}</div>
                      <div className="user-email-table">{adopter.email}</div>
                    </div>
                  </div>
                </td>
                <td>{adopter.phone || '—'}</td>
                <td>{adopter.address || '—'}</td>
                <td>{new Date(adopter.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="joined-date">
                    <Calendar size={14} />
                    <span>{new Date(adopter.createdAt).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="actions-cell">
                  <div className="table-actions">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => handleViewDetails(adopter)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="action-btn status-btn"
                      onClick={() => handleStatusChange(adopter.id, adopter.status === 'active' ? 'suspended' : 'active')}
                      title={adopter.status === 'active' ? 'Suspend' : 'Activate'}
                    >
                      <Ban size={16} />
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => {
                        setSelectedUser(adopter);
                        setShowDeleteConfirm(true);
                      }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAdopters.length === 0 && (
          <div className="empty-state">
            <Users size={48} />
            <h3>No adopters found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        {filteredAdopters.length > 0 && (
          <div className="pagination">
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <div className="pagination-info">
              Page {currentPage} of {totalPages}
            </div>
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <UserModal 
          onClose={() => setShowAddModal(false)}
          onSave={handleAddUser}
          type="adopter"
        />
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedUser && (
        <AdopterDetailsModal
          user={selectedUser}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedUser(null);
          }}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedUser && (
        <DeleteConfirmModal
          user={selectedUser}
          onConfirm={() => handleDeleteUser(selectedUser.id)}
          onClose={() => {
            setShowDeleteConfirm(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}

// Adopter Details Modal Component (Updated class names)
const AdopterDetailsModal = ({ user, onClose, onStatusChange }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>User Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="adopter-details-modal">
          <div className="adopter-details-header">
            <div className="adopter-avatar-large">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <div className="avatar-placeholder" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontSize: '48px' }}>
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="details-header-info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </div>
          
          <div className="details-section">
            <h4>Contact Information</h4>
            <div className="details-grid">
              <div className="detail-item">
                <Phone size={16} />
                <strong>Phone:</strong>
                <span>{user.phone || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <Mail size={16} />
                <strong>Email:</strong>
                <span>{user.email}</span>
              </div>
              <div className="detail-item">
                <MapPin size={16} />
                <strong>Address:</strong>
                <span>{user.address || 'Not set'}</span>
              </div>
              <div className="detail-item">
                <Calendar size={16} />
                <strong>Joined:</strong>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h4>Activity Statistics</h4>
            <div className="adopter-stats-grid">
              <div className="adopter-stat-card">
                <div className="stat-value">{user.adoptionsCount || 0}</div>
                <div className="stat-label">Total Adoptions</div>
              </div>
              <div className="adopter-stat-card">
                <div className="stat-value">{user.applicationsCount || 0}</div>
                <div className="stat-label">Applications</div>
              </div>
              <div className="adopter-stat-card">
                <div className="stat-value">{user.reportsCount || 0}</div>
                <div className="stat-label">Reports</div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-actions">
          <button 
            className="btn-secondary"
            onClick={() => onStatusChange(user.id, user.status === 'active' ? 'suspended' : 'active')}
          >
            <Ban size={16} />
            {user.status === 'active' ? 'Suspend User' : 'Activate User'}
          </button>
          <button className="btn-cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

const UserModal = ({ onClose, onSave, type }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New {type === 'adopter' ? 'Adopter' : 'Shelter'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter full name"
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
            <button type="submit" className="btn-save">Add User</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ user, onConfirm, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2>Confirm Delete</h2>
      </div>
      <div className="modal-body">
        <AlertCircle size={48} color="#dc2626" />
        <p>Are you sure you want to delete <strong>{user?.name}</strong>?</p>
        <p className="text-muted">This action cannot be undone.</p>
      </div>
      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-danger" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);