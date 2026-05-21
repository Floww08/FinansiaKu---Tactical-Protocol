"use client";

import { useState, useEffect, useRef } from "react";
import { auth } from "../lib/firebase"; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import gsap from "gsap";
import { Eye, EyeOff, Loader2, ScanLine, ChevronRight } from "lucide-react";

export default function AuthPage() {
    const [isFlipped, setIsFlipped] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    
    const [error, setError] = useState("");
    const [regError, setRegError] = useState("");
    const [loading, setLoading] = useState(false);
    const [regLoading, setRegLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const cardRef = useRef(null);
    const bgRef = useRef(null);

    // GSAP: Menggantikan fungsi Anime.js untuk HUD dan Background
    useEffect(() => {
        // 1. Animasi HUD masuk secara berurutan (Stagger)
        gsap.fromTo('.hud-element', 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "expo.out", delay: 0.3 }
        );

        // 2. Setup & Animasi Partikel Grid Background
        if (bgRef.current) {
            bgRef.current.innerHTML = "";
            const particles = [];
            
            for (let i = 0; i < 30; i++) {
                const node = document.createElement("div");
                node.className = "absolute bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.5)]";
                node.style.width = `${Math.random() * 40 + 10}px`;
                node.style.height = `2px`;
                node.style.left = `${Math.random() * 100}vw`;
                node.style.top = `${Math.random() * 100}vh`;
                node.style.opacity = 0;
                bgRef.current.appendChild(node);
                particles.push(node);
            }

            particles.forEach((particle) => {
                gsap.to(particle, {
                    x: () => gsap.utils.random(-50, 50),
                    opacity: () => gsap.utils.random(0.1, 0.8),
                    duration: () => gsap.utils.random(2, 5),
                    delay: () => gsap.utils.random(0, 2),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            });
        }
    }, []);

    const toggleAuthMode = () => {
        setError("");
        setRegError("");
        setSuccessMessage("");
        setIsFlipped(!isFlipped);
    };

    // GSAP: Efek Glitch tajam saat input salah
    const triggerErrorGlitch = () => {
        gsap.to(cardRef.current, {
            x: () => gsap.utils.random(-12, 12),
            y: () => gsap.utils.random(-2, 2),
            duration: 0.05,
            repeat: 6,
            yoyo: true,
            ease: "none",
            onComplete: () => gsap.set(cardRef.current, { x: 0, y: 0 })
        });
    };

    // LOGIKA LOGIN GOOGLE (BARU)
    const handleGoogleAuth = async () => {
        setError("");
        setRegError("");
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            window.location.href = "/dashboard";
        } catch (err) {
            setError("GOOGLE OVERRIDE FAILED.");
            setRegError("GOOGLE OVERRIDE FAILED.");
            triggerErrorGlitch();
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email.trim(), password.trim());
            window.location.href = "/dashboard"; 
        } catch (err) {
            setLoading(false);
            setError("AUTHORIZATION FAILED. INVALID CREDENTIALS.");
            triggerErrorGlitch();
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegError("");
        
        if (regPassword.trim().length < 6) {
            setRegError("PASSWORD SECURITY LOW. MINIMUM 6 CHARACTERS.");
            triggerErrorGlitch();
            return;
        }

        setRegLoading(true);

        try {
            await createUserWithEmailAndPassword(auth, regEmail.trim(), regPassword.trim());
            setRegLoading(false);
            setSuccessMessage("IDENTITY CREATED. REROUTING...");
            
            setTimeout(() => {
                setRegEmail("");
                setRegPassword("");
                toggleAuthMode();
            }, 1500);
        } catch (err) {
            setRegLoading(false);
            if (err.code === "auth/email-already-in-use") {
                setRegError("IDENTITY ALREADY EXISTS IN DATABASE.");
            } else {
                setRegError("INITIALIZATION FAILED. VERIFY DATA.");
            }
            triggerErrorGlitch();
        }
    };

    const handleForgotPassword = async () => {
        if (!email.trim()) {
            setError("INPUT EMAIL ADDRESS FOR RECOVERY.");
            triggerErrorGlitch();
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email.trim());
            setSuccessMessage("RECOVERY PROTOCOL SENT TO EMAIL.");
            setError("");
        } catch (err) {
            setError("RECOVERY FAILED. VERIFY EMAIL ADDRESS.");
            triggerErrorGlitch();
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#050507] text-gray-200 flex items-center justify-center overflow-hidden p-4 font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
            
            <div 
                className="absolute inset-0 pointer-events-none z-0 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            ></div>
            <div ref={bgRef} className="absolute inset-0 pointer-events-none z-0"></div>

            <div className="w-full max-w-[420px] h-[580px] perspective-1500 z-10">
                <div 
                    ref={cardRef} 
                    className={`relative w-full h-full preserve-3d transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isFlipped ? "rotateY-180" : ""}`}
                >
                    
                    {/* --- SISI DEPAN: FORM LOGIN --- */}
                    <div className="absolute inset-0 w-full h-full backface-hidden flex flex-col justify-between">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 z-20 opacity-70"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 z-20 opacity-70"></div>

                        <div className="w-full h-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[0_0_40px_rgba(0,0,0,0.8)] p-8 flex flex-col justify-between relative overflow-hidden [clip-path:polygon(0_0,_100%_0,_100%_calc(100%-20px),_calc(100%-20px)_100%,_0_100%)]">
                            
                            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent"></div>

                            <div className="hud-element">
                                <div className="flex items-center gap-2 mb-2">
                                    <ScanLine className="text-cyan-400" size={20} />
                                    <span className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase">System Login</span>
                                </div>
                                <h2 className="text-2xl font-bold tracking-wide text-white uppercase mt-4">Authorization</h2>
                                <p className="text-xs text-gray-400 tracking-wider uppercase mt-1">Provide credentials to enter vault</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4 mt-6 hud-element">
                                <div className="space-y-1.5 relative group">
                                    <label htmlFor="login-email" className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] group-focus-within:text-cyan-400 transition-colors">Target_Email</label>
                                    <input 
                                        id="login-email"
                                        type="email" 
                                        required 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-10 bg-transparent border-b border-gray-700/50 px-1 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors rounded-none"
                                    />
                                </div>

                                <div className="space-y-1.5 relative group">
                                    <div className="flex justify-between items-end">
                                        <label htmlFor="login-password" className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] group-focus-within:text-cyan-400 transition-colors">Access_Key</label>
                                        <button 
                                            type="button" 
                                            onClick={handleForgotPassword}
                                            className="text-[10px] text-gray-500 hover:text-cyan-400 transition-colors tracking-widest uppercase"
                                        >
                                            Override?
                                        </button>
                                    </div>
                                    <div className="relative flex items-center border-b border-gray-700/50 focus-within:border-cyan-400 transition-colors">
                                        <input 
                                            id="login-password"
                                            type={showPassword ? "text" : "password"} 
                                            required 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full h-10 bg-transparent px-1 text-sm text-white focus:outline-none tracking-widest rounded-none"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-1 text-gray-500 hover:text-white transition"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="min-h-[20px] flex items-center justify-center">
                                    {error && <p className="text-[10px] text-red-500 font-bold tracking-widest text-center uppercase">{error}</p>}
                                    {successMessage && !isFlipped && <p className="text-[10px] text-cyan-400 font-bold tracking-widest text-center uppercase">{successMessage}</p>}
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="relative w-full h-10 bg-white text-black font-bold text-xs tracking-[0.2em] uppercase hover:bg-cyan-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 [clip-path:polygon(0_0,_100%_0,_100%_calc(100%-12px),_calc(100%-12px)_100%,_0_100%)]"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={16} /> : "Initiate Login"}
                                    {!loading && <ChevronRight size={16} />}
                                </button>
                            </form>

                            {/* TOMBOL GOOGLE LOGIN */}
                            <div className="mt-4 pt-4 border-t border-gray-800/60 w-full hud-element">
                                <button
                                    type="button"
                                    onClick={handleGoogleAuth}
                                    className="relative w-full h-10 bg-transparent border border-cyan-500/40 text-cyan-400 font-bold text-xs tracking-[0.2em] uppercase hover:bg-cyan-500/10 hover:border-cyan-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2 [clip-path:polygon(8px_0,_100%_0,_100%_calc(100%-8px),_calc(100%-8px)_100%,_0_100%,_0_8px)]"
                                >
                                    <i className="fab fa-google text-sm"></i> Override via Google
                                </button>
                            </div>

                            <div className="hud-element text-center text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase mt-5">
                                Unregistered?{" "}
                                <button onClick={toggleAuthMode} className="text-white hover:text-cyan-400 transition-colors ml-1">
                                    Request Access
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- SISI BELAKANG: FORM REGISTRASI --- */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotateY-180 flex flex-col justify-between">
                        
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange-500 z-20 opacity-70"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-orange-500 z-20 opacity-70"></div>

                        <div className="w-full h-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[0_0_40px_rgba(0,0,0,0.8)] p-8 flex flex-col justify-between relative overflow-hidden [clip-path:polygon(20px_0,_100%_0,_100%_100%,_0_100%,_0_20px)]">
                            
                            <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-orange-500/50 to-transparent"></div>

                            <div className="hud-element">
                                <div className="flex items-center gap-2 mb-2">
                                    <ScanLine className="text-orange-500" size={20} />
                                    <span className="text-xs font-bold tracking-[0.3em] text-orange-500 uppercase">New Protocol</span>
                                </div>
                                <h2 className="text-2xl font-bold tracking-wide text-white uppercase mt-4">Registration</h2>
                                <p className="text-xs text-gray-400 tracking-wider uppercase mt-1">Initialize new secure identity</p>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-4 mt-6 hud-element">
                                <div className="space-y-1.5 relative group">
                                    <label htmlFor="reg-email" className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] group-focus-within:text-orange-500 transition-colors">Target_Email</label>
                                    <input 
                                        id="reg-email"
                                        type="email" 
                                        required 
                                        value={regEmail}
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        className="w-full h-10 bg-transparent border-b border-gray-700/50 px-1 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors rounded-none"
                                    />
                                </div>

                                <div className="space-y-1.5 relative group">
                                    <label htmlFor="reg-password" className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] group-focus-within:text-orange-500 transition-colors">Security_Key</label>
                                    <input 
                                        id="reg-password"
                                        type="password" 
                                        required 
                                        value={regPassword}
                                        onChange={(e) => setRegPassword(e.target.value)}
                                        className="w-full h-10 bg-transparent border-b border-gray-700/50 px-1 text-sm text-white focus:outline-none focus:border-orange-500 tracking-widest rounded-none"
                                    />
                                </div>

                                <div className="min-h-[20px] flex items-center justify-center">
                                    {regError && <p className="text-[10px] text-red-500 font-bold tracking-widest text-center uppercase">{regError}</p>}
                                    {successMessage && isFlipped && <p className="text-[10px] text-orange-400 font-bold tracking-widest text-center uppercase">{successMessage}</p>}
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={regLoading}
                                    className="relative w-full h-10 bg-white text-black font-bold text-xs tracking-[0.2em] uppercase hover:bg-orange-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 [clip-path:polygon(12px_0,_100%_0,_100%_100%,_0_100%,_0_12px)]"
                                >
                                    {regLoading ? <Loader2 className="animate-spin" size={16} /> : "Create Identity"}
                                    {!regLoading && <ChevronRight size={16} />}
                                </button>
                            </form>

                            {/* TOMBOL GOOGLE REGISTER */}
                            <div className="mt-4 pt-4 border-t border-gray-800/60 w-full hud-element">
                                <button
                                    type="button"
                                    onClick={handleGoogleAuth}
                                    className="relative w-full h-10 bg-transparent border border-orange-500/40 text-orange-500 font-bold text-xs tracking-[0.2em] uppercase hover:bg-orange-500/10 hover:border-orange-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 [clip-path:polygon(8px_0,_100%_0,_100%_calc(100%-8px),_calc(100%-8px)_100%,_0_100%,_0_8px)]"
                                >
                                    <i className="fab fa-google text-sm"></i> Override via Google
                                </button>
                            </div>

                            <div className="hud-element text-center text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase mt-5">
                                Existing Identity?{" "}
                                <button onClick={toggleAuthMode} className="text-white hover:text-orange-500 transition-colors ml-1">
                                    Return to Login
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}