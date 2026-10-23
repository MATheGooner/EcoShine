import ButtonLink from "../components/ui/ButtonLink";
export default function NotFoundPage() { return <section className="status-page"><div className="status-card"><p className="eyebrow">404 error</p><h1>That page could not be found.</h1><p>The address may have changed, or the page may no longer exist.</p><ButtonLink to="/">Return Home</ButtonLink></div></section>; }
