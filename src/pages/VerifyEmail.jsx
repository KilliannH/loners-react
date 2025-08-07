import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { verifyEmail } from "../services/authApi";
import { useTranslation } from "react-i18next";

const VerifyEmail = () => {
  const { token } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
        toast.success(t("verify.success"));
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        setStatus("error");
        toast.error(t("verify.error"));
      }
    };

    if (token) verify();
  }, [token]);

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center space-y-4">
        {status === "loading" && <p>{t("verify.loading")}</p>}
        {status === "success" && <p>{t("verify.successMessage")}</p>}
        {status === "error" && (
          <>
            <p>{t("verify.errorMessage")}</p>
            <button
              onClick={() => navigate("/resend-verification")}
              className="underline text-sm text-blue-600 hover:text-blue-800"
            >
              {t("verify.resendLink")}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default VerifyEmail;