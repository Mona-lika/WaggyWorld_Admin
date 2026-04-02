import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, PawPrint, ClipboardList, 
  Activity, Settings, HelpCircle, LogOut, ChevronDown, ChevronUp 
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. STATE TO MANAGE DROPDOWN
  const [isUsersOpen, setIsUsersOpen] = useState(true);

  const menuItems = [
    { icon: <LayoutDashboard size={20}/>, label: "Dashboard", path: "/dashboard" },
    // We will handle 'Users' separately because it has sub-items
    { icon: <PawPrint size={20}/>, label: "Pets", path: "/pets" },
    { icon: <ClipboardList size={20}/>, label: "Applications", path: "/applications" },
    { icon: <Activity size={20}/>, label: "Health Logs", path: "/health" },
    { icon: <Settings size={20}/>, label: "Settings", path: "/settings" },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logoSection}>
        <img src="/WaggyWorld.png" alt="Logo" style={styles.sidebarLogo} />
      </div>

      <nav style={styles.nav}>
        {/* DASHBOARD ITEM */}
        <div onClick={() => navigate('/dashboard')} style={styles.navItemContainer}>
          {location.pathname === '/dashboard' && <div style={styles.activeIndicator} />}
          <div style={{...styles.navItem, color: location.pathname === '/dashboard' ? '#20b8f4' : '#94a3b8'}}>
            <LayoutDashboard size={20} />
            <span style={{...styles.navLabel, fontWeight: location.pathname === '/dashboard' ? '700' : '500'}}>Dashboard</span>
          </div>
        </div>

        {/* 2. NESTED USERS MENU */}
        <div style={styles.menuGroup}>
          <div onClick={() => setIsUsersOpen(!isUsersOpen)} style={styles.navItemContainer}>
            <div style={{...styles.navItem, color: '#94a3b8'}}>
              <Users size={20} />
              <span style={styles.navLabel}>Users</span>
              {isUsersOpen ? <ChevronUp size={16} style={{marginLeft: 'auto'}}/> : <ChevronDown size={16} style={{marginLeft: 'auto'}}/>}
            </div>
          </div>

          {isUsersOpen && (
            <div style={styles.subMenuContainer}>
              {/* Vertical line indicator */}
              <div style={styles.subMenuLine} />
              
              <div style={styles.subMenuItems}>
                <SubNavItem 
                  label="Shelters" 
                  isActive={location.pathname === '/users/shelters'} 
                  onClick={() => navigate('/users/shelters')} 
                />
                <SubNavItem 
                  label="Adopters" 
                  isActive={location.pathname === '/users/adopters'} 
                  onClick={() => navigate('/users/adopters')} 
                />
              </div>
            </div>
          )}
        </div>

        {/* REST OF THE ITEMS */}
        {menuItems.slice(1).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div key={item.label} onClick={() => navigate(item.path)} style={styles.navItemContainer}>
              {isActive && <div style={styles.activeIndicator} />}
              <div style={{...styles.navItem, color: isActive ? '#20b8f4' : '#94a3b8'}}>
                {item.icon}
                <span style={{...styles.navLabel, fontWeight: isActive ? '700' : '500'}}>{item.label}</span>
              </div>
            </div>
          );
        })}
      </nav>

      <div style={styles.sidebarFooter}>
        <div style={styles.footerItem}><HelpCircle size={20} color="#94a3b8" /><span style={styles.footerLabel}>Support</span></div>
        <div style={styles.footerItem} onClick={() => {localStorage.clear(); window.location.href='/';}}>
          <LogOut size={20} color="#ef4444" />
          <span style={{...styles.footerLabel, color: '#ef4444'}}>Logout</span>
        </div>
      </div>
    </div>
  );
}

// 3. SUB-NAV ITEM COMPONENT
const SubNavItem = ({ label, isActive, onClick }) => (
  <div onClick={onClick} style={{
    ...styles.subNavItem,
    color: isActive ? '#20b8f4' : '#94a3b8',
    backgroundColor: isActive ? '#f0faff' : 'transparent',
  }}>
    {isActive && <div style={styles.subMenuActiveBar} />}
    <span style={{fontWeight: isActive ? '700' : '500'}}>{label}</span>
  </div>
);

const styles = {
  sidebar: { width: '200px', height: '100vh', backgroundColor: '#fff', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column' },
  logoSection: { padding: '30px', display: 'flex', justifyContent: 'center', marginBottom: '10px' },
  sidebarLogo: { width: '90px', height: 'auto', objectFit: 'contain' },
  nav: { flex: 1 },
  navItemContainer: { position: 'relative', display: 'flex', alignItems: 'center', height: '50px', cursor: 'pointer', marginBottom: '5px' },
  activeIndicator: { position: 'absolute', left: 0, width: '6px', height: '32px', backgroundColor: '#20b8f4', borderTopRightRadius: '6px', borderBottomRightRadius: '6px' },
  navItem: { display: 'flex', alignItems: 'center', padding: '0 30px', width: '100%', boxSizing: 'border-box' },
  navLabel: { marginLeft: '15px', fontSize: '15px' },

  // --- NESTED MENU STYLES ---
  subMenuContainer: { position: 'relative', marginLeft: '40px', display: 'flex' },
  subMenuLine: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '1px', backgroundColor: '#f1f5f9' },
  subMenuItems: { flex: 1 },
  subNavItem: { position: 'relative', padding: '10px 20px', borderRadius: '10px', marginBottom: '5px', cursor: 'pointer', fontSize: '14px', marginLeft: '15px' },
  subMenuActiveBar: { position: 'absolute', left: -16, top: '25%', width: '3px', height: '50%', backgroundColor: '#20b8f4', borderRadius: '2px' },

  sidebarFooter: { padding: '30px', borderTop: '1px solid #f1f5f9' },
  footerItem: { display: 'flex', alignItems: 'center', marginBottom: '20px', cursor: 'pointer' },
  footerLabel: { marginLeft: '15px', fontSize: '14px', color: '#64748b', fontWeight: '600' }
};