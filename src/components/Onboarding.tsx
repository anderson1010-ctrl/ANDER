import { useState, FormEvent } from 'react';
import { ViewType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Mail, Lock, User } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

type AuthMode = 'signup' | 'login' | null;

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [slide, setSlide] = useState<1 | 2>(1);
  const [authMode, setAuthMode] = useState<AuthMode>(null);

  // Signup form state
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [formError, setFormError] = useState('');

  const handleSignupSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setFormError('Completa todos los campos para continuar.');
      return;
    }
    if (signupPassword.length < 6) {
      setFormError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setFormError('');
    onComplete();
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setFormError('Ingresa tu correo y contraseña para continuar.');
      return;
    }
    setFormError('');
    onComplete();
  };

  const openAuthMode = (mode: AuthMode) => {
    setFormError('');
    setAuthMode(mode);
  };

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center px-6 py-10 overflow-hidden font-sans">
      {/* Subtle Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-secondary-container/30 rounded-full blur-[120px]"></div>
      </div>

      <AnimatePresence mode="wait">
        {slide === 1 ? (
          <motion.div
            key="slide1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md flex flex-col items-center text-center"
          >
            {/* Title */}
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-[#5a4a42] uppercase mb-4 leading-tight">
              WELCOME TO <br />
              <span className="text-primary">FURRY FRIENDS!</span>
            </h1>

            {/* Main Illustration */}
            <div className="relative w-full mb-8 hero-illustration-float max-w-[320px]">
              <img
                alt="Amigables perro y gato abrazados"
                className="w-full h-auto drop-shadow-2xl rounded-2xl object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCes9A5qrqjd7a2EShPzCDuhXFl7_kuz8SsL9nfinS-6-qi0It-_CbNE-EQNoRYMCilK93W_H1dR5cyMDg48kNQSBWVlpxmBBQQYsuZO8K6_JY6DTR65W5xa41QCKbRCpd_TeLCsMi-sx4Uc55VLTmo02VxKcB3AuqrS3KrEtSpzio66qSOxFD0CUYICkC7IE7fCsOzjFwX5m88hTmjw7oFqZcH1ILWKHaz9PY10pEm1oc2aCm-fGpx"
              />
            </div>

            {/* Subtext */}
            <p className="text-gray-600 font-sans text-base leading-relaxed max-w-[300px] mb-8">
              Find your perfect companion and start a new journey together.
            </p>

            {/* Indicators */}
            <div className="flex gap-2 mb-8">
              <span className="w-6 h-2 rounded-full bg-primary transition-all duration-300"></span>
              <span className="w-2 h-2 rounded-full bg-gray-300 transition-all duration-300"></span>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setSlide(2)}
              className="px-10 py-4 bg-[#3b82f6] hover:bg-blue-600 text-white font-headline font-bold rounded-full shadow-lg hover:shadow-xl transform active:scale-95 transition-all duration-300"
              id="get-started-btn"
            >
              GET STARTED
            </button>
          </motion.div>
        ) : authMode ? (
          <motion.div
            key={`auth-${authMode}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md flex flex-col items-center text-center"
          >
            {/* Logo Header */}
            <header className="mb-6">
              <img
                alt="Logo PetRescue"
                className="h-16 w-auto object-contain mx-auto mb-2"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYtGHuRmBb0tffqAhxCzkjUYgLIe1b21wjxntI22FebLo-CNFELvz09w-HAEL8JekRG2QfMdMiFeZPyAFQdp6HpQ-buxBWGhz5LEO87oyI3nQzFVFXs3PXrsac5_rYzuzaGCk-J78u8rMPBQqnFCzP9D_VFE-M3dN1zRZ8yVR1CRaUEMoWHibpgHd6sSPHGSBSfIh_v6Ks86djoORq1-7HMwb20pcyVmdO-CjbYOP1Ax17BJ4tK2SU"
              />
            </header>

            <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8 space-y-6 text-left">
              {/* Back button + title */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => openAuthMode(null)}
                  className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                  id="auth-back-btn"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="font-headline text-2xl font-extrabold text-on-surface">
                  {authMode === 'signup' ? 'Crea tu cuenta' : 'Inicia sesión'}
                </h1>
              </div>
              <p className="text-sm text-on-surface-variant -mt-4">
                {authMode === 'signup'
                  ? 'Únete a PetRescue para adoptar, reportar y ayudar a mascotas de tu comunidad.'
                  : 'Ingresa tus datos para continuar donde te quedaste.'}
              </p>

              {authMode === 'signup' ? (
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
                      Nombre completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ej: Sofía Martínez"
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                        id="signup-name-input"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="tucorreo@ejemplo.com"
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                        id="signup-email-input"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                        id="signup-password-input"
                      />
                    </div>
                  </div>

                  {formError && (
                    <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="group w-full py-4 px-6 bg-primary text-white font-headline font-bold text-base rounded-full shadow-lg hover:shadow-xl hover:bg-primary-container active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                    id="submit-signup-btn"
                  >
                    <span>Crear Cuenta</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>

                  <p className="text-center text-xs text-on-surface-variant">
                    ¿Ya tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => openAuthMode('login')}
                      className="text-primary font-bold hover:underline"
                      id="switch-to-login-btn"
                    >
                      Inicia sesión
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="tucorreo@ejemplo.com"
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                        id="login-email-input"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Tu contraseña"
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                        id="login-password-input"
                      />
                    </div>
                  </div>

                  {formError && (
                    <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="group w-full py-4 px-6 bg-primary text-white font-headline font-bold text-base rounded-full shadow-lg hover:shadow-xl hover:bg-primary-container active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                    id="submit-login-btn"
                  >
                    <span>Iniciar Sesión</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>

                  <p className="text-center text-xs text-on-surface-variant">
                    ¿No tienes cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => openAuthMode('signup')}
                      className="text-primary font-bold hover:underline"
                      id="switch-to-signup-btn"
                    >
                      Regístrate
                    </button>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="slide2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md flex flex-col items-center text-center"
          >
            {/* Logo Header */}
            <header className="mb-6">
              <img
                alt="Logo PetRescue"
                className="h-16 w-auto object-contain mx-auto mb-2"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYtGHuRmBb0tffqAhxCzkjUYgLIe1b21wjxntI22FebLo-CNFELvz09w-HAEL8JekRG2QfMdMiFeZPyAFQdp6HpQ-buxBWGhz5LEO87oyI3nQzFVFXs3PXrsac5_rYzuzaGCk-J78u8rMPBQqnFCzP9D_VFE-M3dN1zRZ8yVR1CRaUEMoWHibpgHd6sSPHGSBSfIh_v6Ks86djoORq1-7HMwb20pcyVmdO-CjbYOP1Ax17BJ4tK2SU"
              />
            </header>

            {/* Floating Bento Deck Style Image Container */}
            <div className="relative w-full mb-8 max-w-[300px]">
              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xl relative rotate-2 scale-95 z-10">
                <img
                  alt="PetRescue Welcome"
                  className="w-full h-auto rounded-2xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCes9A5qrqjd7a2EShPzCDuhXFl7_kuz8SsL9nfinS-6-qi0It-_CbNE-EQNoRYMCilK93W_H1dR5cyMDg48kNQSBWVlpxmBBQQYsuZO8K6_JY6DTR65W5xa41QCKbRCpd_TeLCsMi-sx4Uc55VLTmo02VxKcB3AuqrS3KrEtSpzio66qSOxFD0CUYICkC7IE7fCsOzjFwX5m88hTmjw7oFqZcH1ILWKHaz9PY10pEm1oc2aCm-fGpx"
                />
                <span className="absolute -top-3 -right-3 bg-white p-2.5 rounded-full shadow-lg border border-gray-100 text-red-500 hover:scale-110 transition-transform">
                  ♥
                </span>
                <span className="absolute -bottom-3 -left-3 bg-white p-2.5 rounded-full shadow-lg border border-gray-100 text-primary animate-pulse">
                  🐾
                </span>
              </div>
            </div>

            {/* Typography Content */}
            <section className="space-y-2 mb-8">
              <h1 className="font-headline text-3xl font-extrabold text-on-surface leading-tight">
                Bienvenido a <span className="text-primary">PetRescue</span>
              </h1>
              <p className="font-sans text-base text-on-surface-variant max-w-[320px] mx-auto leading-relaxed">
                Tu plataforma de confianza para encontrar y ayudar a mascotas.
              </p>
            </section>

            {/* Action Cluster */}
            <div className="w-full space-y-4 mb-6 px-4">
              <button
                onClick={() => openAuthMode('signup')}
                className="group w-full py-4 px-6 bg-primary text-white font-headline font-bold text-base rounded-full shadow-lg hover:shadow-xl hover:bg-primary-container active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                id="crear-cuenta-btn"
              >
                <span>Crear Cuenta</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => openAuthMode('login')}
                className="w-full py-4 px-6 bg-white border-2 border-primary/20 text-primary font-headline font-bold text-base rounded-full hover:bg-gray-50 active:scale-[0.98] transition-all duration-300 shadow-sm"
                id="iniciar-sesion-btn"
              >
                Iniciar Sesión
              </button>
            </div>

            {/* Footer Social Signup */}
            <footer className="w-full px-4 mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                O únete con
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={onComplete}
                  className="px-6 py-3 bg-white hover:bg-gray-50 active:scale-95 transition-all duration-200 border border-gray-200 rounded-full shadow-sm flex items-center gap-2 text-sm font-semibold text-gray-700"
                  id="google-login-btn"
                >
                  <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">G</span>
                  GOOGLE
                </button>
                <button
                  onClick={onComplete}
                  className="p-3 bg-white hover:bg-gray-50 active:scale-95 transition-all duration-200 border border-gray-200 rounded-full shadow-sm text-gray-700 flex items-center justify-center"
                  id="email-login-btn"
                  title="Otro método"
                >
                  ✉️
                </button>
              </div>
            </footer>

            {/* Onboarding Indicators */}
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-300 transition-all duration-300"></span>
              <span className="w-6 h-2 rounded-full bg-primary transition-all duration-300"></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
