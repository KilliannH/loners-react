import React from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

const PrivacyPolicy = () => {
    const { t } = useTranslation();
    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">{t("legal.privacy")}</h1>
            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                <ReactMarkdown>{t("terms.content")}</ReactMarkdown>
            </div>
        </div>
    );
};

export default PrivacyPolicy;