import { useLocation } from "react-router-dom";
import ButtonLink from "../components/ui/ButtonLink";

export default function ThankYouPage() {
  const { state: summary } = useLocation();
  const isLive = summary?.submissionMode === "live";
  return <section className="status-page"><div className="status-card"><span className="status-icon" aria-hidden="true">✓</span><p className="eyebrow">{isLive ? "Request received" : "Demonstration complete"}</p><h1>{isLive ? "Thank you for requesting a quote." : "Your demo quote request is complete."}</h1><p>{isLive ? "EcoShine will review the details and contact you within one business day to confirm pricing and availability." : "In a live service, EcoShine would now review the details and contact you within one business day."}</p>{summary && <dl className="confirmation-summary"><div><dt>Service</dt><dd>{summary.service}</dd></div><div><dt>Frequency</dt><dd>{summary.frequency}</dd></div><div><dt>Preferred date</dt><dd>{summary.date}</dd></div></dl>}{!isLive && <p className="demo-notice">No information was transmitted or retained by this portfolio demonstration.</p>}<ButtonLink to="/">Back to Home</ButtonLink></div></section>;
}
