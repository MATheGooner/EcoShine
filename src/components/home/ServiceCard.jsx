import { Link } from "react-router-dom";

export default function ServiceCard({ service, index }) {
  return <article className="service-card"><div className="service-card__top"><span aria-hidden="true">0{index}</span><p>{service.eyebrow}</p></div><h3>{service.shortName}</h3><p>{service.summary}</p><div className="service-card__footer"><small>{service.pricing}</small><Link to={`/services/${service.slug}`} aria-label={`Explore ${service.name}`}>Explore service <span aria-hidden="true">↗</span></Link></div></article>;
}
