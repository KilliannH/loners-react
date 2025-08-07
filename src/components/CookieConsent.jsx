import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CookieConsent = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "false");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <motion.div
      className="fixed bottom-10 inset-x-0 bg-white border-t border-gray-200 px-4 py-4 z-50 shadow-md"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-700">
        <p className="text-center sm:text-left">
          {t("cookies.message")}{" "}
          <Link to="/cookies" className="underline hover:text-blue-600">
            {t("cookies.link")}
          </Link>
        </p>

        <div className="flex gap-2">
          <button
            onClick={handleReject}
            className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            {t("cookies.reject")}
          </button>

          <button
            onClick={handleAccept}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out"
          >
            {t("cookies.accept")}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CookieConsent;
