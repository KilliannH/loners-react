import { useState } from "react";
import { motion } from "framer-motion";
import { resendVerification } from "../services/authApi";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const ResendVerification = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleResend = async () => {
    if (!email) return toast.error(t("resend.emailRequired"));

    try {
      setIsSending(true);
      await resendVerification(email);
      toast.success(t("resend.sent"));
    } catch (err) {
      toast.error(
        err?.response?.data?.message || t("resend.error")
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full text-center space-y-4">
        <h2 className="text-xl font-semibold">{t("resend.title")}</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("resend.placeholder")}
          className="w-full px-4 py-2 border rounded"
        />
        <button
          onClick={handleResend}
          disabled={isSending}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg hover:scale-105 transition disabled:opacity-50"
        >
          {isSending ? t("resend.sending") : t("resend.button")}
        </button>
      </div>
    </motion.div>
  );
};

export default ResendVerification;