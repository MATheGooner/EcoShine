import { Link } from "react-router-dom";
export default function ButtonLink({ to, children, variant = "primary", className = "" }) { return <Link className={`button button--${variant} ${className}`.trim()} to={to}>{children}</Link>; }
