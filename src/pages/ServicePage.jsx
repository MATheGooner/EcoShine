import { Link, Navigate, useParams } from "react-router-dom";
import Accordion from "../components/ui/Accordion";
import ButtonLink from "../components/ui/ButtonLink";
import { getService } from "../data/services";

export default function ServicePage() {
  const { serviceSlug } = useParams();
  const service = getService(serviceSlug);
  if (!service) return <Navigate to="/not-found" replace />;

  return <>
    <section className="page-hero"><div className="container page-hero__inner"><Link className="back-link" to="/#services">← All services</Link><p className="eyebrow">{service.eyebrow}</p><h1>{service.name} in Dublin</h1><p>{service.summary}</p><div className="hero__actions"><ButtonLink to={`/quote?service=${service.slug}`}>Request this Service</ButtonLink><a className="text-link" href="#included">See what’s included</a></div></div></section>
    <section className="section" id="included"><div className="container service-detail"><div><p className="eyebrow">At a glance</p><h2>Cleaning shaped around the job.</h2><dl className="detail-list"><div><dt>Best suited for</dt><dd>{service.bestFor}</dd></div><div><dt>Available as</dt><dd>{service.frequency}</dd></div><div><dt>Pricing guidance</dt><dd>{service.pricing} Final pricing is confirmed after we review your request.</dd></div></dl></div><div className="included-card"><h2>What’s included</h2><ul>{service.included.map((item) => <li key={item}>{item}</li>)}</ul></div></div></section>
    <section className="section service-extras"><div className="container two-column"><div><p className="eyebrow">Optional extras</p><h2>Add what your property needs.</h2><p>Extras are priced with your main quote so the full scope is clear before you approve it.</p></div><ul className="tag-list">{service.extras.map((extra) => <li key={extra}>{extra}</li>)}</ul></div></section>
    <section className="section"><div className="container faq-layout"><div><p className="eyebrow">Service questions</p><h2>Before you request a quote.</h2></div><Accordion items={service.faqs} /></div></section>
    <section className="section final-cta"><div className="container final-cta__panel"><div><p className="eyebrow">No-obligation quote</p><h2>Is {service.shortName.toLowerCase()} right for you?</h2><p>Share your property details and preferred date. We’ll confirm the scope, price and availability.</p></div><ButtonLink to={`/quote?service=${service.slug}`}>Request this Service</ButtonLink></div></section>
  </>;
}
