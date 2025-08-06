import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";
import toast from "react-hot-toast";
import logo from "../assets/logo_inverted.png";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Globe, LogOut } from "lucide-react";

const Header = () => {
    const isAuthenticated = useAuthStore((state) => !!state.token);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const { i18n, t } = useTranslation();
    const [langOpen, setLangOpen] = useState(false);

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
        <motion.header
            className="bg-black text-white flex justify-between items-center px-4 py-3 relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Logo */}
            <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Link to="/home" className="flex items-center gap-2">
                    <img src={logo} alt="Loners logo" className="h-10 w-auto" />
                    <span className="text-lg font-bold tracking-wide">
                        Loners
                    </span>
                </Link>
            </motion.div>

            {/* Actions */}
            <div className="flex items-center gap-3 relative">
                {/* Icône langue */}
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
                            className="absolute right-0 top-10 bg-white text-black rounded shadow-lg text-sm z-50 overflow-hidden"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleLanguageSelect("fr")}
                            >
                                🇫🇷 French
                            </li>
                            <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleLanguageSelect("en")}
                            >
                                🇬🇧 English
                            </li>
                            <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleLanguageSelect("es")}
                            >
                                🇪🇸 Spanish
                            </li>
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
        </motion.header>
    );
};

export default Header;
