import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Navbar from './components/Navbar';
import CheckoutPage from './pages/Checkoutpage';

const supabaseUrl = 'https://sdbtmvllsjmqvqqbrrgr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYnRtdmxsc2ptcXZxcWJycmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMjg4NjgsImV4cCI6MjA1MDkwNDg2OH0.4mH-9lkCEbu27yl5VbLFeOe3ei5nBLRnbfPlgyF-dc4';
const supabase = createClient(supabaseUrl, supabaseKey);

const PrivateRoute = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    checkSession();
  }, []);

  if (session === null) {
    return <LoginModal />;
  }

  return children;
};

// Login Modal Component
const LoginModal = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setError(error.message);
    } else {
      setError(null);
      alert('Check your email for the login link!');
    }
    setIsLoading(false);
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4">Login to Continue</h2>
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="p-2 mb-4 border border-gray-300 rounded w-full"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Login'}
          </button>
        </form>

        <div className="my-4 text-center">
          <span className="text-gray-600">OR</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="bg-red-500 text-white px-4 py-2 rounded w-full"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
