import { motion } from "framer-motion";
import React, { useState } from "react";
import { X, Download, Users, MessageCircle, Calendar, Sparkles, ArrowRight } from "lucide-react";
import CustomHelmet from "../components/CustomHelmet";
import { useTranslation } from "react-i18next";

// Modern Button Component
const Button = ({ children, onClick, size = "md", variant = "primary", className = "" }) => {
  const baseStyles = "relative overflow-hidden font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl";
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700",
    secondary: "bg-white text-gray-800 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
  };
  const sizes = {
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

// Download Modal Component
const DownloadModal = ({ open, onClose }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: open ? 1 : 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ 
          opacity: open ? 1 : 0, 
          scale: open ? 1 : 0.8, 
          y: open ? 0 : 50 
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-100"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <Download className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("downloadModal.title")}
            </h2>
            <p className="text-gray-600">
              {t("downloadModal.subtitle")}
            </p>
          </div>

          {/* Download Buttons */}
          <div className="space-y-3">
            <a
              href="https://apps.apple.com/app/idXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-black text-white py-4 px-6 rounded-2xl hover:bg-gray-800 transition-all duration-200 font-medium group"
            >
              <span className="text-2xl">🍏</span>
              <div className="text-left">
                <div className="text-xs opacity-80">{t("downloadModal.download1Part1")}</div>
                <div className="text-sm font-semibold">{t("downloadModal.download1Part2")}</div>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium group"
            >
              <span className="text-2xl">🤖</span>
              <div className="text-left">
                <div className="text-xs opacity-80">{t("downloadModal.download2Part1")}</div>
                <div className="text-sm font-semibold">{t("downloadModal.download2Part2")}</div>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-500">
            {t("downloadModal.labels")}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Phone Mockup Component
const PhoneMockup = ({ src, alt, className = "" }) => (
  <div className={`relative ${className}`}>
    <div className="relative w-64 md:w-72">
      {/* Phone Frame */}
      <div className="relative rounded-[3rem] border-[6px] border-gray-900 shadow-2xl overflow-hidden bg-gray-900">
        <img
          src={src || "/api/placeholder/300/600"}
          alt={alt}
          className="w-full h-auto rounded-[2.2rem]"
        />
        {/* Screen Reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[2.2rem]" />
      </div>
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-2xl" />
      {/* Dynamic Island */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-gray-900 rounded-full" />
    </div>
  </div>
);

// Main Landing Component
export default function Landing() {
  const { t } = useTranslation();
  const [isDownloadOpen, setDownloadOpen] = useState(false);

  const features = [
    {
      icon: Users,
      title: t("landing.feature1.title"),
      desc: t("landing.feature1.desc"),
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: MessageCircle,
      title: t("landing.feature2.title"),
      desc: t("landing.feature2.desc"),
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Calendar,
      title: t("landing.feature3.title"),
      desc: t("landing.feature3.desc"),
      color: "from-blue-600 to-indigo-600"
    }
  ];

  return (
    <>
    <CustomHelmet
              titleKey="landing.seo.title"
              descriptionKey="landing.seo.description"
            />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-blue-600/5" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-6 py-2 text-blue-700 font-medium"
            >
              <Sparkles className="w-4 h-4" />
              {t("landing.hero.badge")}
            </motion.div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
              {t("landing.hero.titlePart1")}
              <br />
              <span className="text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text">
                {t("landing.hero.titlePart2")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t("landing.hero.subtitle")}
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button 
                onClick={() => setDownloadOpen(true)} 
                size="lg"
                className="group"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                {t("landing.hero.cta")}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Text Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {t("landing.appPreview.titlePart1")}
                  <span className="text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text block">
                    {t("landing.appPreview.titlePart2")}
                  </span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {t("landing.appPreview.subtitle")}
                </p>
              </div>
            </div>

            {/* Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex justify-center lg:justify-end"
            >
              <PhoneMockup 
                src="/screenshot1.png" 
                alt="Aperçu de l'application Loners"
                className="hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t("landing.features.titlePart1")}
              <span className="text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text"> 
                {" "}{t("landing.features.titlePart2")}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("landing.features.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200"
              >
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Gallery */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t("landing.screenshots.title")}
            </h2>
            <p className="text-xl text-gray-600">
              {t("landing.screenshots.subtitle")}
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8">
            {["/screenshot2.png", "/screenshot3.png"].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.3 }}
              >
                <PhoneMockup 
                  src={src} 
                  alt={`Aperçu ${i + 2}`}
                  className="hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-bold">
              {t("landing.finalCTA.titlePart1")}
              <span className="block text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                {t("landing.finalCTA.titlePart2")}
              </span>
            </h2>
            
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {t("landing.finalCTA.subtitle")}
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => setDownloadOpen(true)} 
                size="lg"
                className="bg-white text-white hover:bg-gray-100 shadow-2xl group"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                {t("landing.finalCTA.button")}
              </Button>
            </motion.div>

            <p className="text-sm text-blue-200">
              {t("landing.finalCTA.labels")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Download Modal */}
      <DownloadModal open={isDownloadOpen} onClose={() => setDownloadOpen(false)} />
    </div>
    </>
  );
}