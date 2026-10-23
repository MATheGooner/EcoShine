import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { business, serviceAreas } from "../../data/business";
import { getService, services } from "../../data/services";

const defaultDescription = "Insured, eco-conscious home and small-office cleaning across Dublin. Request a free, no-obligation quote from EcoShine.";

const routeMetadata = {
  "/": { title: "Home Cleaning in Dublin | EcoShine", description: defaultDescription },
  "/quote": { title: "Request a Cleaning Quote | EcoShine Dublin", description: "Tell EcoShine about your Dublin property and receive a tailored cleaning quote within one business day." },
  "/thank-you": { title: "Quote Request Summary | EcoShine", description: "Review the confirmation for your EcoShine portfolio demonstration quote request." },
};

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) { element = document.createElement("meta"); document.head.appendChild(element); }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

export default function Seo() {
  const { pathname } = useLocation();
  const serviceSlug = pathname.match(/^\/services\/([^/]+)$/)?.[1];
  useEffect(() => {
    const service = getService(serviceSlug);
    const metadata = service ? { title: `${service.name} Dublin | EcoShine`, description: `${service.summary} ${service.pricing}` } : routeMetadata[pathname] || { title: "Page Not Found | EcoShine", description: "Return to EcoShine for residential and small-office cleaning services across Dublin." };
    const configuredUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "");
    const siteUrl = configuredUrl || window.location.origin;
    const canonicalUrl = `${siteUrl}${pathname === "/" ? "" : pathname}`;
    const sharingImage = `${siteUrl}/images/cleaning-hero.jpg`;
    document.title = metadata.title;
    setMeta('meta[name="description"]', { name: "description", content: metadata.description });
    setMeta('meta[property="og:title"]', { property: "og:title", content: metadata.title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: metadata.description });
    setMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    setMeta('meta[property="og:image"]', { property: "og:image", content: sharingImage });
    setMeta('meta[property="og:locale"]', { property: "og:locale", content: "en_IE" });
    setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: metadata.title });
    setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: metadata.description });
    setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: sharingImage });
    const shouldIndex = pathname !== "/thank-you" && (service || routeMetadata[pathname]);
    setMeta('meta[name="robots"]', { name: "robots", content: shouldIndex ? "index, follow" : "noindex, follow" });
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = canonicalUrl;

    const businessSchema = {
      "@context": "https://schema.org", "@type": ["LocalBusiness", "HomeAndConstructionBusiness"], "@id": `${siteUrl}/#business`, name: business.name,
      description: defaultDescription, url: siteUrl, telephone: business.phoneInternational, email: business.email,
      image: sharingImage, priceRange: "€€", currenciesAccepted: "EUR", areaServed: serviceAreas.map((area) => area.name),
      address: { "@type": "PostalAddress", addressLocality: "Dublin", addressCountry: "IE" },
      openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "08:00", closes: "18:00" }],
      hasOfferCatalog: { "@type": "OfferCatalog", name: "Cleaning services", itemListElement: services.map((item) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: item.name, description: item.summary } })) },
    };
    const schema = service ? {
      "@context": "https://schema.org", "@type": "Service", name: service.name, description: service.summary,
      provider: { "@id": `${siteUrl}/#business`, name: business.name },
      areaServed: serviceAreas.map((area) => ({ "@type": "AdministrativeArea", name: area.name })),
    } : pathname === "/" ? businessSchema : { "@context": "https://schema.org", "@type": "WebPage", name: metadata.title, description: metadata.description, url: canonicalUrl, isPartOf: { "@type": "WebSite", name: business.name, url: siteUrl } };
    let script = document.getElementById("ecoshine-structured-data");
    if (!script) { script = document.createElement("script"); script.id = "ecoshine-structured-data"; script.type = "application/ld+json"; document.head.appendChild(script); }
    script.textContent = JSON.stringify(schema);
  }, [pathname, serviceSlug]);
  return null;
}
