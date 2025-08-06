import { Helmet } from "react-helmet-async";

export default function EventJsonLd({ event }) {
  if (!event) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: event.date,
    endDate: event.date,
    description: event.description,
    location: {
      "@type": "Place",
      name: event.location?.name || "Lieu à venir",
      address: {
        "@type": "PostalAddress",
        streetAddress: event.location?.address || "",
      },
    },
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: `https://loners.com/fr/events/${event._id}`,
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}