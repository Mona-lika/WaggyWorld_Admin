import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminLogin({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Connect to your existing Node.js Backend
      const response = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // STRICTOR SECURITY: Only allow users with 'admin' role
      if (user.role !== 'admin') {
        alert("ACCESS DENIED: You do not have Administrator privileges.");
        setLoading(false);
        return;
      }

      // Save session in browser memory
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      
      // Update parent state to show dashboard
      setToken(token);

    } catch (error) {
      const errorMsg = error.response?.data?.error || "Login failed. Please check your connection.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Left side matches your design requirement (Light Blue) */}
      <div style={styles.leftSide}></div>

      <div style={styles.rightSide}>
        <div style={styles.loginCard}>
          <img 
            src="/WaggyWorld.png" // Ensure this is in public folder
            alt="Logo" 
            style={styles.logo} 
          />
          
          <h2 style={styles.title}>Get Started!</h2>
          <p style={styles.subtitle}>Welcome back ! - Sign in to your account.</p>

          <form onSubmit={handleLogin} style={styles.form}>
            <label style={styles.label}>Email</label>
            <input 
              type="email" 
              placeholder="admin_waggyworld@gmail.com"
              style={styles.input}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label style={styles.label}>Password</label>
            <div style={styles.passwordContainer}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••"
                style={styles.passwordInput}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* FIXED: Using 'button' with type='button' instead of TouchableOpacity */}
              <button 
                type="button"
                style={styles.eyeIcon} 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
              </button>
            </div>

            <p style={styles.forgotPass}>Forgot password ?</p>

            <button type="submit" style={styles.loginBtn} disabled={loading}>
              {loading ? "Verifying..." : "Log in"}
            </button>

            <div style={styles.separatorRow}>
              <div style={styles.line} />
              <span style={styles.orText}>OR</span>
              <div style={styles.line} />
            </div>

            <button type="button" style={styles.socialBtn}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Reference_Icon.svg" style={styles.socialIcon} alt="google" />
                Sign in with Google
            </button>

            <button type="button" style={styles.socialBtn}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" style={styles.socialIcon} alt="apple" />
                Sign in with Apple
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', height: '100vh', backgroundColor: '#d1effa' },
  leftSide: { flex: 1 },
  rightSide: { flex: 1.2, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  loginCard: { 
    width: '450px', backgroundColor: '#fff', padding: '50px', borderRadius: '40px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.05)', textAlign: 'center' 
  },
  logo: { width: '100px', height: '100px', marginBottom: '10px', objectFit: 'contain' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1384b1', marginBottom: '5px' },
  subtitle: { color: '#999', fontSize: '14px', marginBottom: '30px' },
  form: { textAlign: 'left' },
  label: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#444', marginBottom: '8px' },
  input: { 
    width: '100%', padding: '12px 15px', borderRadius: '15px', border: '1.5px solid #20b8f4',
    marginBottom: '20px', outline: 'none', fontSize: '14px', boxSizing: 'border-box'
  },
  passwordContainer: { position: 'relative', width: '100%' },
  passwordInput: { 
    width: '100%', padding: '12px 15px', borderRadius: '15px', border: '1.5px solid #20b8f4',
    outline: 'none', boxSizing: 'border-box'
  },
  eyeIcon: { position: 'absolute', right: '15px', top: '10px', border: 'none', background: 'none', cursor: 'pointer' },
  forgotPass: { textAlign: 'right', color: '#1384b1', fontSize: '12px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' },
  loginBtn: { 
    width: '100%', padding: '14px', backgroundColor: '#20b8f4', color: '#fff', 
    border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', 
    marginTop: '30px', cursor: 'pointer' 
  },
  separatorRow: { display: 'flex', alignItems: 'center', margin: '25px 0' },
  line: { flex: 1, height: '1px', backgroundColor: '#eee' },
  orText: { padding: '0 15px', color: '#ccc', fontSize: '12px' },
  socialBtn: { 
    width: '100%', padding: '12px', backgroundColor: '#fff', border: '1px solid #eee', 
    borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center',
    gap: '10px', marginBottom: '10px', cursor: 'pointer', fontSize: '14px', color: '#444' 
  },
  socialIcon: { width: '18px' }
};