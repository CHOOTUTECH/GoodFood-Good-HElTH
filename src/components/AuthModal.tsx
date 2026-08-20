import React, { useState } from 'react';
import { Leaf, Lock, Mail, User as UserIcon, Phone, MapPin, X, ArrowRight, ShieldCheck, CheckCircle2, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * ==============================================================================
 * AUTHENTICATION MODAL (LOGIN & REGISTER)
 * ==============================================================================
 * 
 * 📌 HINDI / ENGLISH INSTRUCTIONS:
 * - Login: `loginUser({ email, password, rememberMe })` -> POST /api/auth/login
 * - Register: `registerUser({ name, email, password, phone, address })` -> POST /api/auth/register
 * - Successful login/registration automatically syncs with user session, orders, and cart.
 */

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalMode, setAuthModalMode, loginUser, registerUser } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSwitchMode = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    resetForm();
  };

  // ==============================================================================
  // 🔗 [API INTEGRATION POINT: HANDLE USER LOGIN]
  // ==============================================================================
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    try {
      setIsLoading(true);
      /*
      // 👉 REAL API CALL:
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, rememberMe })
      // });
      */
      const result = await loginUser({ email, password, rememberMe });
      if (!result.success) {
        setErrorMessage(result.message || 'Login failed. Please verify credentials.');
      } else {
        setSuccessMessage('Welcome back to Verdant Grove!');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  // ==============================================================================
  // 🔗 [API INTEGRATION POINT: HANDLE USER REGISTRATION]
  // ==============================================================================
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill in your full name, email, and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      /*
      // 👉 REAL API CALL:
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name,
      //     email,
      //     password,
      //     phone,
      //     address: { street, city, state, zip }
      //   })
      // });
      */
      const result = await registerUser({
        name,
        email,
        password,
        phone,
        address: street ? { street, city, state, zip } : undefined
      });

      if (!result.success) {
        setErrorMessage(result.message || 'Registration failed. Please try again.');
      } else {
        setSuccessMessage('Account created successfully! Welcome to the family.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo autofill for fast testing
  const fillDemoAccount = () => {
    setEmail('jairamsingh.tech@gmail.com');
    setPassword('OrganicProvisions2026!');
    setName('Jairam Singh');
    setPhone('+1 (555) 382-9104');
    setStreet('742 Organic Harvest Way, Suite 4B');
    setCity('Portland');
    setState('OR');
    setZip('97201');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsAuthModalOpen(false)}
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#fbfbf9] rounded-2xl shadow-2xl border border-[#e4e7de] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header Ribbon */}
        <div className="bg-[#153e26] text-white p-5 sm:p-6 relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            aria-label="Close"
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-[#a3e635] text-[#153e26] flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="font-serif text-lg font-bold tracking-tight">Verdant Grove Provisions</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-serif text-white">
            {authModalMode === 'login' ? 'Welcome Back, Nature Lover' : 'Create Your Organic Account'}
          </h2>
          <p className="text-xs sm:text-sm text-[#c5dfcb] mt-1">
            {authModalMode === 'login'
              ? 'Sign in to access your order history, live eco-tracking, and saved favorites.'
              : 'Join our community for 10% off your first order, harvest tracking, and farm updates.'}
          </p>

          {/* Mode Switch Tabs */}
          <div className="flex bg-[#0f2e1c] rounded-xl p-1 mt-4">
            <button
              onClick={() => handleSwitchMode('login')}
              type="button"
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                authModalMode === 'login'
                  ? 'bg-white text-[#153e26] shadow-sm'
                  : 'text-[#c0dec7] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleSwitchMode('register')}
              type="button"
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                authModalMode === 'register'
                  ? 'bg-white text-[#153e26] shadow-sm'
                  : 'text-[#c0dec7] hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Quick Demo Autofill Banner */}
          <div className="bg-[#f2f7ed] border border-[#d6e5cc] p-3 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-[#285732]">
              <Sparkles className="w-4 h-4 text-[#4a9354] shrink-0" />
              <span>Quick Test: Fill verified demo customer details</span>
            </div>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="text-[11px] font-bold text-[#153e26] bg-white border border-[#b8d6b9] px-2.5 py-1 rounded-md hover:bg-[#e4efe0] transition-colors cursor-pointer shrink-0"
            >
              Autofill
            </button>
          </div>

          {/* Error / Success Notifications */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2">
              <span className="font-bold">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {authModalMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jairam.tech@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#153e26] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to demo email: jairamsingh.tech@gmail.com')}
                    className="text-xs text-[#2e7d32] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#153e26] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#153e26] focus:ring-[#153e26] w-4 h-4"
                  />
                  <span>Remember me on this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#153e26] hover:bg-[#1f5435] text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in securely...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jairam Singh"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#153e26] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jairam@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#153e26] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#153e26]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#153e26]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number (For Delivery SMS Updates)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-3.5 py-2 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#153e26]"
                  />
                </div>
              </div>

              {/* Shipping Address Section (Optional for fast register) */}
              <div className="pt-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2e7d32]" />
                  <span>Default Shipping Address (Optional)</span>
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street Address (e.g. 742 Harvest Way)"
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-[#153e26]"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#153e26]"
                  />
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#153e26]"
                  />
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="ZIP Code"
                    className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#153e26]"
                  />
                </div>
              </div>

              <div className="text-[11px] text-gray-500 leading-relaxed pt-1">
                By creating an account, you agree to Verdant Grove's Organic Terms of Service and Privacy Policy.
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#153e26] hover:bg-[#1f5435] text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account & Join</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Trust Banner */}
          <div className="pt-2 border-t border-gray-200 flex items-center justify-center gap-4 text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2e7d32]" />
              256-bit SSL Security
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-[#2e7d32]" />
              Zero Spam Guarantee
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
