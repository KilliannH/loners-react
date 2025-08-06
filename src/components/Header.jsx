import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";
import toast from "react-hot-toast";
import logo from "../assets/logo_inverted.png";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Globe, LogOut, Menu, X } from "lucide-react";

const Header = () => {
    const isAuthenticated = useAuthStore((state) => !!state.token);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const { i18n, t } = useTranslation();

    const [langOpen, setLangOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

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
                    {/* Logo */}
                    <Link to="/home" className="flex items-center gap-2">
                        <img src={logo} alt="Loners logo" className="h-10 w-auto" />
                        <span className="text-lg font-bold tracking-wide">Loners</span>
                    </Link>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => setLangOpen((prev) => !prev)}
                            className="hover:text-gray-300 transition"
                            aria-label="Changer de langue"
                        >
                            <Globe size={20} />
                        </button>

                        <AnimatePresence>
                            {langOpen && (
                                <motion.ul
                                    className="absolute right-4 top-16 bg-white text-black rounded shadow-lg text-sm z-50 overflow-hidden"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleLanguageSelect("fr")}>🇫🇷 French</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleLanguageSelect("en")}>🇬🇧 English</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleLanguageSelect("es")}>🇪🇸 Spanish</li>
                                </motion.ul>
                            )}
                        </AnimatePresence>

                        {isAuthenticated && (
                            <motion.button
                                onClick={handleLogout}
                                className="p-2 rounded hover:bg-white/10 transition"
                                aria-label={t("auth.logout")}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <LogOut size={20} />
                            </motion.button>
                        )}
                    </div>

                    {/* Burger menu icon (mobile only) */}
                    <button
                        className="md:hidden"
                        onClick={() => setMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </motion.header>

            {/* 📱 Mobile Menu Slide + Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        {/* 🔲 Overlay */}
                        <motion.div
                            className="fixed inset-0 bg-black/50 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                        />

                        {/* 📱 Slide-in Menu */}
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
                                {/* Langue */}
                                <div>
                                    <p className="text-sm text-gray-600">{t("auth.language")}</p>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => handleLanguageSelect("fr")}>🇫🇷</button>
                                        <button onClick={() => handleLanguageSelect("en")}>🇬🇧</button>
                                        <button onClick={() => handleLanguageSelect("es")}>🇪🇸</button>
                                    </div>
                                </div>

                                {/* 📄 Legal links */}
                                <div>
                                    <p className="text-sm text-gray-600">{t("nav.legal")}</p>
                                    <div className="flex flex-col gap-1 mt-2 text-sm">
                                        <Link to="/legal-terms" className="text-blue-600 hover:underline" onClick={() => setMenuOpen(false)}>
                                            {t("legal.terms")}
                                        </Link>
                                        <Link to="/privacy-policy" className="text-blue-600 hover:underline" onClick={() => setMenuOpen(false)}>
                                            {t("legal.privacy")}
                                        </Link>
                                        <Link to="/cookies" className="text-blue-600 hover:underline" onClick={() => setMenuOpen(false)}>
                                            {t("legal.cookies")}
                                        </Link>
                                    </div>
                                </div>

                                {/* Logout */}
                                {isAuthenticated && (
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 transition"
                                    >
                                        <LogOut size={18} /> {t("auth.logout")}
                                    </button>
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
