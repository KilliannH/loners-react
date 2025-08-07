import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useTranslation } from "react-i18next";
import CustomHelmet from "../components/CustomHelmet";

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <CustomHelmet
        titleKey="landing.seo.title"
        descriptionKey="landing.seo.description"
      />
      <div className="flex flex-col items-center text-center px-6 py-10 space-y-16 pb-24">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl space-y-6"
        >
          <h1 className="text-4xl font-bold leading-tight">
            {t("landing.hero.title")}
          </h1>
          <p className="text-lg text-gray-600">
            {t("landing.hero.subtitle")}
          </p>
          <Button onClick={() => navigate("/register")} size="lg">
            {t("landing.hero.cta")}
          </Button>
        </motion.section>

        {/* Subhero section — full-width bg + animation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <div className="w-full bg-gray-50 py-16">
            <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
              {/* Text content */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4">{t("landing.subhero.title")}</h2>
                <p className="text-gray-600 mb-6">
                  {t("landing.subhero.subtitle")}
                </p>
              </div>

              {/* Image preview */}
              <div className="flex-1">
                <img
                  src="/preview2.png"
                  alt="Aperçu Loners"
                  className="rounded-xl shadow-lg w-full max-w-md mx-auto"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section className="grid gap-10 max-w-4xl md:grid-cols-3">
          {[
            {
              title: t("landing.features.nearby.title"),
              desc: t("landing.features.nearby.desc"),
            },
            {
              title: t("landing.features.chat.title"),
              desc: t("landing.features.chat.desc"),
            },
            {
              title: t("landing.features.organize.title"),
              desc: t("landing.features.organize.desc"),
            },
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white p-6 rounded-2xl shadow space-y-2"
            >
              <h3 className="text-xl font-semibold">{feat.title}</h3>
              <p className="text-sm text-gray-500">{feat.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Screenshots or Preview (Placeholder) */}
        <section className="max-w-xl space-y-4">
          <h2 className="text-2xl font-bold">{t("landing.preview.title")}</h2>
          <div className="rounded-xl shadow overflow-hidden">
            <img src="/preview.png" alt="Preview Loners" className="w-full" />
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center space-y-4">
          <h3 className="text-xl font-semibold">
            {t("landing.cta.title")}
          </h3>
          <Button size="lg" onClick={() => navigate("/register")}>{t("landing.cta.button")}</Button>
        </section>
      </div>
    </>
  );
}
