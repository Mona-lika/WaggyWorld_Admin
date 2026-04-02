import React, { useEffect, useState } from 'react';
import { Bell, Search, Check, X, Users, PawPrint, FileText, Heart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import API from '../api';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get('/admin/overview').then(res => setData(res.data)).catch(e => console.log(e));
  }, []);

  if (!data) return <div style={styles.loader}>Loading...</div>;

  return (
    <div style={styles.outerContainer}>
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.greeting}>Hello, Admin! </h2>
        <div style={styles.headerRight}>
          <div style={styles.searchBar}>
            <Search size={18} color="#cbd5e1" />
            <input type="text" placeholder="Search ..." style={styles.searchInput} />
          </div>
          <div style={styles.iconCircle}><Bell size={20} color="#64748b" /></div>
          <div style={styles.avatar}></div>
        </div>
      </div>

      {/* TOP STAT CARDS (Eduka Gradients) */}
      <div style={styles.statsGrid}>
        <GradientCard label="Total Adopters" value={data.stats.users} icon={<Users color="#fff"/>} colors={['#00b09b', '#96c93d']} />
        <GradientCard label="Total Pets" value={data.stats.pets} icon={<PawPrint color="#fff"/>} colors={['#20b8f4', '#1A237E']} />
        <GradientCard label="Total Adoption Requests" value={data.stats.apps} icon={<FileText color="#fff"/>} colors={['#8E2DE2', '#4A00E0']} />
        <GradientCard label="Total Donation Posts" value="12" icon={<Heart color="#fff"/>} colors={['#f3d146', '#f39c12']} />
      </div>

      {/* MAIN CONTENT BENTO GRID */}
      <div style={styles.mainGrid}>
        
        {/* LEFT COLUMN: DATA TABLE */}
        <div style={styles.leftCol}>
          <div style={styles.bentoBox}>
            <div style={styles.boxHeader}>
                <h3 style={styles.boxTitle}>Recent Adoption Requests</h3>
                <span style={styles.seeAll}>See All</span>
            </div>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th>Adopter</th>
                  <th>Pet</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.recentApps.map(app => (
                  <tr key={app.id} style={styles.trRow}>
                    <td style={styles.tdUser}>{app.userName}</td>
                    <td style={styles.tdPet}>{app.petName}</td>
                    <td><span style={{...styles.badge, backgroundColor: app.status === 'pending' ? '#FEF3C7' : '#D1FAE5', color: app.status === 'pending' ? '#D97706' : '#059669'}}>{app.status}</span></td>
                    <td style={styles.tdActions}>
                      <button style={styles.actionBtn}><Check size={14} color="#059669"/></button>
                      <button style={styles.actionBtn}><X size={14} color="#DC2626"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: ANALYTICS */}
        <div style={styles.rightCol}>
           <div style={styles.bentoBox}>
              <h3 style={styles.boxTitle}>Adoption Participation</h3>
              <div style={{height: '200px', marginTop: '20px'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                    <XAxis dataKey="name" hide />
                    <Tooltip />
                    <Area type="monotone" dataKey="uv" stroke="#20b8f4" fill="#e0f2fe" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div style={{...styles.bentoBox, marginTop: '20px'}}>
              <h3 style={styles.boxTitle}>Species Distribution</h3>
              <div style={{height: '180px'}}>
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                     </Pie>
                   </PieChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

      </div>
    </div>
    </div>
  );
}

// SUB-COMPONENTS
const GradientCard = ({ label, value, icon, colors }) => (
  <div style={{...styles.statCard, background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`}}>
    <div>
        <p style={styles.cardLabel}>{label}</p>
        <h2 style={styles.cardValue}>{value}</h2>
    </div>
    <div style={styles.cardIcon}>{icon}</div>
  </div>
);

const chartData = [{name: 'a', uv: 400}, {name: 'b', uv: 300}, {name: 'c', uv: 600}, {name: 'd', uv: 200}, {name: 'e', uv: 500}];
const pieData = [{ name: 'Dogs', value: 400 }, { name: 'Cats', value: 300 }, { name: 'Others', value: 100 }];
const COLORS = ['#20b8f4', '#f3d146', '#1A237E'];

const styles = {
  outerContainer: { flex: 1, backgroundColor: '#FFFFFF', padding: '25px 40px 25px 0px', height: '100vh', boxSizing: 'border-box', display: 'flex' },
  container: { flex: 1, backgroundColor: '#fcefba', borderRadius: '40px', padding: '40px', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', boxSizing: 'border-box' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  greeting: { fontSize: '24px', fontWeight: '800', color: '#1e293b' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  searchBar: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '10px 20px', borderRadius: '12px', width: '250px' },
  searchInput: { border: 'none', marginLeft: '10px', outline: 'none', fontSize: '14px' },
  iconCircle: { width: '45px', height: '45px', borderRadius: '12px', backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' },
  avatar: { width: '45px', height: '45px', borderRadius: '12px', backgroundColor: '#cbd5e1' },
  
  statsGrid: { display: 'flex', gap: '25px', marginBottom: '30px' },
statCard: { 
    flex: 1, 
    height: '110px', // Reduced height
    borderRadius: '24px', 
    padding: '20px', // Reduced padding
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    boxShadow: '0 8px 15px rgba(0,0,0,0.05)' 
  },  cardLabel: { color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '600' },
  cardValue: { color: '#fff', fontSize: '28px', fontWeight: '800', marginTop: '5px' },
  cardIcon: { backgroundColor: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '15px' },

  mainGrid: { display: 'flex', gap: '25px' },
  leftCol: { flex: 2 },
  rightCol: { flex: 1 },
  bentoBox: { backgroundColor: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
  boxHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  boxTitle: { fontSize: '17px', fontWeight: '800', color: '#1e293b' },
  seeAll: { fontSize: '13px', color: '#20b8f4', fontWeight: '700', cursor: 'pointer' },
  
  table: { width: '100%', borderCollapse: 'collapse' },
  thRow: { textAlign: 'left', color: '#94a3b8', fontSize: '13px', borderBottom: '1px solid #f1f5f9' },
  trRow: { borderBottom: '1px solid #f8fafc' },
  tdUser: { padding: '18px 0', fontSize: '14px', fontWeight: '700', color: '#334155' },
  tdPet: { fontSize: '14px', color: '#64748b' },
  badge: { padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' },
  actionBtn: { border: 'none', backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '8px', marginLeft: '5px', cursor: 'pointer' },
  loader: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#20b8f4' }
};