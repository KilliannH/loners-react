import React from "react";
import { NavLink } from "react-router-dom";
import { Home, User, MessageSquare } from "lucide-react";
import { useNotificationStore } from "../features/notifications/notificationStore";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const BottomNav = () => {
  const total = useNotificationStore((s) => s.totalUnread());
  const { t } = useTranslation();

  const navItems = [
    { to: "/chat", icon: MessageSquare, labelKey: "nav.chat" },
    { to: "/home", icon: Home, labelKey: "nav.home" },
    { to: "/profile", icon: User, labelKey: "nav.profile" },
  ];

  return (
    <motion.nav
      className="fixed bottom-0 w-full bg-white border-t flex justify-around py-2 text-sm z-50"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {navItems.map(({ to, icon: Icon, labelKey }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs relative ${isActive ? "text-black font-semibold" : "text-gray-400"
            }`
          }
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Icon size={24} />
            {to === "/chat" && total > 0 && (
              <AnimatePresence>
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center leading-none"
                >
                  {total > 99 ? "99+" : total}
                </motion.span>
              </AnimatePresence>
            )}
          </motion.div>
          <span className="sr-only">{t(labelKey)}</span>
        </NavLink>
      ))}
    </motion.nav>
  );
};

export default BottomNav;
