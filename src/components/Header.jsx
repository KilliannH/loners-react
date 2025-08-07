import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";
import toast from "react-hot-toast";
import logo from "../assets/logo_inverted.png";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
    LogOut,
    Menu,
    X,
    Home,
    User,
    MessageSquare,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

const Header = () => {
    const isAuthenticated = useAuthStore((state) => !!state.token);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const { i18n, t } = useTranslation();

    const [menuOpen, setMenuOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [legalOpen, setLegalOpen] = useState(false);

    const handleLogout = () => {
        logout();
        toast.success(t("auth.logoutSuccess"));
        navigate("/login");
    };

    const handleLanguageSelect = (lang) => {
        i18n.changeLanguage(lang);
        setLangOpen(false);
    };

    return (
        <>
            <motion.header
                className="bg-black text-white px-4 py-3 relative z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="Loners logo" className="h-10 w-auto" />
                        <span className="text-lg font-bold tracking-wide">Loners</span>
                    </Link>
                    <button onClick={() => setMenuOpen(true)} aria-label="Open menu">
                        <Menu size={24} />
                    </button>
                </div>
            </motion.header>

            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/50 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                        />
                        <motion.div
                            className="fixed top-0 right-0 w-64 h-full bg-white text-black shadow-lg z-50 flex flex-col p-6 gap-6"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">{t("nav.menu")}</h2>
                                <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">

                                {/* 🔗 Navigation principale */}
                                <div className="flex flex-col gap-3 text-sm">
                                    <Link
                                        to="/home"
                                        className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <Home size={18} /> {t("nav.home") || "Accueil"}
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <User size={18} /> {t("nav.profile") || "Profil"}
                                    </Link>
                                    <Link
                                        to="/chat"
                                        className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <MessageSquare size={18} /> {t("nav.chat") || "Chat"}
                                    </Link>
                                </div>

                                {/* 🌐 Langues — collapsible */}
                                <div className="text-sm text-gray-800">
                                    <button
                                        onClick={() => setLangOpen(!langOpen)}
                                        className="flex justify-between items-center w-full"
                                    >
                                        <span>{t("auth.language")}</span>
                                        {langOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>
                                    <AnimatePresence>
                                        {langOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="mt-2 flex gap-2 overflow-hidden"
                                            >
                                                <button onClick={() => handleLanguageSelect("fr")}>🇫🇷</button>
                                                <button onClick={() => handleLanguageSelect("en")}>🇬🇧</button>
                                                <button onClick={() => handleLanguageSelect("es")}>🇪🇸</button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* 📄 Mentions légales — collapsible */}
                                <div className="text-sm text-gray-800">
                                    <button
                                        onClick={() => setLegalOpen(!legalOpen)}
                                        className="flex justify-between items-center w-full"
                                    >
                                        <span>{t("nav.legal")}</span>
                                        {legalOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>
                                    <AnimatePresence>
                                        {legalOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="mt-2 flex flex-col gap-1 overflow-hidden"
                                            >
                                                <Link
                                                    to="/legal-terms"
                                                    className="hover:underline"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    {t("legal.terms")}
                                                </Link>
                                                <Link
                                                    to="/privacy-policy"
                                                    className="hover:underline"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    {t("legal.privacy")}
                                                </Link>
                                                <Link
                                                    to="/cookies"
                                                    className="hover:underline"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    {t("legal.cookies")}
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* 🚪 Déconnexion */}
                                {isAuthenticated ? (
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 transition"
                                    >
                                        <LogOut size={18} /> {t("auth.logout")}
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-2 text-sm text-gray-800 hover:text-blue-600 transition"
                                    >
                                        <LogOut size={18} /> {t("auth.login") || "Se connecter"}
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
