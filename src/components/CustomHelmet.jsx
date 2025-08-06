import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

export default function CustomHelmet({ titleKey, descriptionKey, path = "", title, description }) {
    const { t, i18n } = useTranslation();

    const finalTitle = title || (titleKey ? t(titleKey) : "Loners");
    const finalDescription = description || (descriptionKey ? t(descriptionKey) : "");

    const lang = i18n.language || "fr";
    const baseUrl = "https://loners.com";
    const fullUrl = `${baseUrl}/${lang}${path}`;

    return (
        <Helmet htmlAttributes={{ lang }} key={fullUrl}>
            <title>{finalTitle}</title>
            {!finalTitle && (
                <meta name="robots" content="noindex, nofollow" />
            )}
            <meta name="description" content={finalDescription} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:image" content={baseUrl + "/og-image.png"} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={baseUrl + "/og-image.png"} />

            {/* Canonical & hreflang */}
            <link rel="canonical" href={fullUrl} />
            <link rel="alternate" href={`${baseUrl}/fr${path}`} hreflang="fr" />
            <link rel="alternate" href={`${baseUrl}/en${path}`} hreflang="en" />
            <link rel="alternate" href={`${baseUrl}${path}`} hreflang="x-default" />
        </Helmet>
    );
}