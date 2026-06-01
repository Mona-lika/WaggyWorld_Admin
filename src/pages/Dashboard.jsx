import React, { useEffect, useState } from 'react';
import { Bell, Search, Check, X, Users, PawPrint, FileText, Heart, ShieldCheck, Trash2, ShieldAlert, TrendingUp, Calendar, Download, Filter, MoreVertical, Eye, UserPlus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import API from '../api';
import '../styles/Dashboard.css';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [timeRange, setTimeRange] = useState('week');

    const fetchOverview = async () => {
        try {
            const res = await API.get('/admin/overview');
            setData(res.data);
        } catch (e) {
            console.error("Fetch Error:", e);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Pending";
        const date = new Date(dateString);
        // Check if the date is actually valid
        if (isNaN(date.getTime())) return "Recently"; 
        
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };


    useEffect(() => {
        fetchOverview();
    }, []);

    const handleVerifyShelter = async (id, status) => {
        try {
            await API.put(`/admin/verify-shelter/${id}`, { isVerified: status });
            alert(status ? "Shelter Approved!" : "Shelter Rejected");
            fetchOverview();
        } catch (err) {
            console.error(err);
            alert("Error: " + (err.response?.data?.error || "Unknown error"));
        }
    };

    if (!data) return <div className="loader-modern">Loading...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-left">
                    <h1 className="page-title">Dashboard Overview</h1>
                    <p className="page-subtitle">Welcome back, Admin! Here's what's happening today.</p>
                </div>
                <div className="header-right">
                    <div className="search-wrapper">
                        <Search size={18} />
                        <input type="text" placeholder="Search anything..." className="search-input" />
                    </div>
                    <button className="notification-btn">
                        <Bell size={20} />
                        <span className="notification-badge">3</span>
                    </button>
                    <div className="admin-avatar">
                        <img src="profile.png" alt="Admin" />
                    </div>
                </div>
            </header>

            {/* STAT CARDS */}
            <div className="stats-grid">
                <StatCard 
                    label="Total Users" 
                    value={data.stats.users}
                    subtext="Joined this week"
                    icon={<Users size={22} color="#46ab4d" />} 
                    color="#E8F5E9"
                />
                <StatCard 
                    label="Total Shelters" 
                    value={data.stats.shelters} 
                    subtext="Verified Partners"
                    icon={<ShieldCheck size={22} color="#1A237E" />} 
                    color="#E8EAF6" 
                />
                <StatCard 
                    label="Total Pets" 
                    value={data.stats.pets}
                    subtext="Last updated: Today"
                    icon={<PawPrint size={22} color="#20b8f4" />} 
                    color="#E3F2FD"
                />
                <StatCard 
                    label="Total Adoption Applications" 
                    value={data.stats.apps}
                    subtext="3 Pending Review"
                    icon={<FileText size={22} color="#f3d146" />} 
                    color="#FFF9E1"
                />
                <StatCard 
                    label="Donation Posts" 
                    value={data.stats.donations} 
                    subtext="Campaigns Active"
                    icon={<Heart size={20} color="#ef4444" />} 
                    color="#FFEBEE"
                />
            </div>

            {/* TWO COLUMN LAYOUT */}
            <div className="two-column-layout">
                {/* LEFT COLUMN - TABLES */}
                <div className="left-column">
                    {/* Recent Applications Table */}
                    <div className="table-card">
                        <div className="table-header">
                            <h3>Recent Adoption Applications</h3>
                            <button className="view-all-btn">View All →</button>
                        </div>
                        <div className="table-responsive">
                            <table className="data-table-modern">
                                <thead>
                                    <tr>
                                        <th>Applicant</th>
                                        <th>Pet Name</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recentApps.slice(0, 5).map(app => (
                                        <tr key={app.id}>
                                            <td>
                                                <div className="applicant-info">
                                                    <div className="applicant-avatar">{app.userName.charAt(0)}</div>
                                                    <span>{app.userName}</span>
                                                </div>
                                            </td>
                                            <td>{app.petName}</td>
                                            <td>{formatDate(app.date)}</td>
                                            <td>
                                                <span className={`status-badge-modern ${app.status}`}>
                                                    {app.status === 'pending' && '⏳ Pending'}
                                                    {app.status === 'approved' && '✓ Approved'}
                                                    {app.status === 'rejected' && '✗ Rejected'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="action-icon accept"><Check size={16} /></button>
                                                    <button className="action-icon reject"><X size={16} /></button>
                                                    <button className="action-icon view"><Eye size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Shelter Verification Table */}
                    <div className="table-card">
                        <div className="table-header">
                            <h3>Shelter Verification Requests</h3>
                            <ShieldAlert size={18} color="#f39c12" />
                        </div>
                        <div className="table-responsive">
                            <table className="data-table-modern">
                                <thead>
                                    <tr>
                                        <th>Shelter Name</th>
                                        <th>Contact</th>
                                        <th>Submitted</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.pendingShelters && data.pendingShelters.length > 0 ? (
                                        data.pendingShelters.slice(0, 5).map(shelter => (
                                            <tr key={shelter.id}>
                                                <td>
                                                    <div className="shelter-name">
                                                        <strong>{shelter.name}</strong>
                                                    </div>
                                                </td>
                                                <td>{shelter.email}</td>
                                                <td>{new Date(shelter.submittedDate).toLocaleDateString()}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button 
                                                            className="action-icon accept" 
                                                            onClick={() => handleVerifyShelter(shelter.id, true)}
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button 
                                                            className="action-icon reject"
                                                            onClick={() => handleVerifyShelter(shelter.id, false)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{textAlign: 'center', padding: '40px', color: '#999'}}>
                                                No pending verification requests
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - CHARTS */}
                <div className="right-column">
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>Adoption Trends</h3>
                            <div className="chart-actions">
                                <button className={`time-btn ${timeRange === 'week' ? 'active' : ''}`} onClick={() => setTimeRange('week')}>Week</button>
                                <button className={`time-btn ${timeRange === 'month' ? 'active' : ''}`} onClick={() => setTimeRange('month')}>Month</button>
                                <button className={`time-btn ${timeRange === 'year' ? 'active' : ''}`} onClick={() => setTimeRange('year')}>Year</button>
                            </div>
                        </div>
                        <ResponsiveContainer height={280}>
                            <AreaChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip />
                                <Area type="monotone" dataKey="uv" stroke="#4f46e5" fill="#eef2ff" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <h3>Pet Distribution</h3>
                        <ResponsiveContainer height={260}>
                            <PieChart>
                                <Pie data={pieData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" label>
                                    {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pie-legend">
                            {pieData.map((item, index) => (
                                <div key={index} className="legend-item">
                                    <div className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span>{item.name}: {item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const StatCard = ({ label, value, subtext, icon, color }) => (
    <div className="stat-card">
        <div className="stat-card-top" style={{ backgroundColor: color }}>
            <div className="stat-icon-wrapper">
                {icon}
            </div>
            <span className="stat-label-main">{label}</span>
            <h2 className="stat-value-large">{value || 0}</h2>
        </div>
        <div className="stat-card-bottom">
            <span className="stat-subtext">{subtext}</span>
        </div>
    </div>
);

const chartData = [
    { name: 'Mon', uv: 120 },
    { name: 'Tue', uv: 150 },
    { name: 'Wed', uv: 180 },
    { name: 'Thu', uv: 220 },
    { name: 'Fri', uv: 280 },
    { name: 'Sat', uv: 350 },
    { name: 'Sun', uv: 310 }
];

const pieData = [
    { name: 'Dogs', value: 450 },
    { name: 'Cats', value: 320 },
    { name: 'Birds', value: 80 },
    { name: 'Others', value: 50 }
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];