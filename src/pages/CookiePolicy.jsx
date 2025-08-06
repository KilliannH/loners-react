import React from "react";
import { useTranslation } from "react-i18next";
import CustomHelmet from "../components/CustomHelmet";
import ReactMarkdown from "react-markdown";

const CookiePolicy = () => {
  const { t } = useTranslation();
  return (
    <>
    <CustomHelmet
          titleKey="legal.cookies.seo.title"
          descriptionKey="legal.cookies.seo.description"
        />
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{t("legal.cookies")}</h1>
      <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
        <ReactMarkdown>{t("privacy.content")}</ReactMarkdown>
      </div>
    </div>
    </>
  );
};

export default CookiePolicy;