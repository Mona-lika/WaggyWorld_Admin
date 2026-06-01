import React, { useEffect, useState } from 'react';
import {
  Search, Filter, Trash2, Eye, PawPrint, CheckCircle, 
  Clock, Download, RefreshCw, ChevronLeft, ChevronRight,
  MapPin, Heart, AlertCircle
} from 'lucide-react';
import API from '../api';
import '../styles/Users.css';

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // 2 rows of 4
  const [selectedPet, setSelectedPet] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await API.get('/pets/admin/all');
      setPets(response.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (petId) => {
    if (window.confirm("Are you sure you want to remove this pet listing?")) {
      try {
        await API.delete(`/pets/${petId}`);
        fetchPets();
      } catch (error) {
        console.error('Error deleting pet:', error);
      }
    }
  };

  // Filter Logic
  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || pet.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPets.length / itemsPerPage);

  if (loading) return <div className="loader-modern">Loading pet listings...</div>;

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1 className="page-title">Pet Management</h1>
          <p className="page-subtitle">Monitor and manage all pets across all shelters</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-mini-grid">
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>
            <PawPrint size={20} />
          </div>
          <div>
            <h4>Total Pets</h4>
            <p>{pets.length}</p>
          </div>
        </div>
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#d1fae5', color: '#10b981' }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <h4>Available</h4>
            <p>{pets.filter(p => p.status === 'available').length}</p>
          </div>
        </div>
        <div className="stat-mini-card">
          <div className="stat-mini-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Heart size={20} />
          </div>
          <div>
            <h4>Adopted</h4>
            <p>{pets.filter(p => p.status === 'adopted').length}</p>
          </div>
        </div>
        
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="search-filter">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by name or breed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="status-filter">
          <Filter size={18} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="adopted">Adopted</option>
          </select>
        </div>
        <button className="refresh-btn" onClick={fetchPets}>
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Pets Grid - 4 Columns */}
      <div style={customStyles.petGrid}>
        {currentItems.map(pet => (
          <div key={pet.id} className="pet-admin-card" style={customStyles.card}>
            <div style={customStyles.imageContainer}>
                <img 
                    src={Array.isArray(pet.imageUrl) ? pet.imageUrl[0] : pet.imageUrl} 
                    alt={pet.name} 
                    style={customStyles.petImage} 
                />
                <span style={{
                  ...customStyles.badgeBase, 
                  ...(pet.status === 'available' ? customStyles.availableBadge : customStyles.adoptedBadge)
              }}>
                  {pet.status}
              </span>
            </div>
            
            <div style={customStyles.cardContent}>
                <h3 style={customStyles.petName}>{pet.name}</h3>
                <p style={customStyles.breedText}>{pet.breed} • {pet.species}</p>
                
                <div style={customStyles.shelterInfo}>
                    <MapPin size={12} color="#94a3b8" />
                    <span>Shelter: <strong>{pet.shelterName}</strong></span>
                </div>

                <div style={customStyles.cardActions}>
                    <button className="action-btn view-btn" onClick={() => { setSelectedPet(pet); setShowDetailsModal(true); }}>
                        <Eye size={16} /> View
                    </button>
                    <button className="action-btn delete-btn" onClick={() => handleDeletePet(pet.id)}>
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPets.length === 0 && (
        <div className="empty-state">
          <PawPrint size={48} />
          <h3>No pets found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      )}

      {/* Pagination */}
      {filteredPets.length > 0 && (
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

      {/* Pet Details Modal can be added here similar to Adopters */}
    </div>
  );
}

// Internal styles to handle the 4-column grid and card specifics
const customStyles = {
  petGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)', // Exactly 4 columns
    gap: '20px',
    marginTop: '20px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column'
  },
  imageContainer: {
    position: 'relative',
    height: '160px',
    width: '100%'
  },
  petImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  badge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    margin: 0
  },
  cardContent: {
    padding: '15px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  petName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px'
  },
  breedText: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '12px'
  },
  shelterInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#94a3b8',
    marginBottom: '15px'
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    marginTop: 'auto'
  },
  badgeBase: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    border: '1px solid transparent'
  },
  
  // 2. Green highlight for Available
  availableBadge: {
    backgroundColor: '#ecfdf5',
    color: '#059669',
    borderColor: '#10b981'
  },

  // 3. Red highlight for Adopted
  adoptedBadge: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    borderColor: '#fecaca'
  },
  
};