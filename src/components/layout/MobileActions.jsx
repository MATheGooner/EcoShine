import { Link } from "react-router-dom"; import { business } from "../../data/business";
export default function MobileActions() { return <div className="mobile-actions"><a href={`tel:${business.phoneHref}`}>Call EcoShine</a><Link to="/quote">Request a Quote</Link></div>; }
