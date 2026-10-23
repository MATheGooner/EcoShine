import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return undefined;
    menuRef.current?.querySelector("a")?.focus();
    const keydown = (event) => {
      if (event.key === "Escape") { setOpen(false); toggleRef.current?.focus(); }
      if (event.key === "Tab") {
        const focusable = [toggleRef.current, ...menuRef.current.querySelectorAll("a")];
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const pointerdown = (event) => {
      if (!menuRef.current?.contains(event.target) && !toggleRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("keydown", keydown);
    document.addEventListener("pointerdown", pointerdown);
    return () => { document.removeEventListener("keydown", keydown); document.removeEventListener("pointerdown", pointerdown); };
  }, [open]);

  return <header className="site-header"><nav className="nav container" aria-label="Primary navigation"><Link className="brand" to="/" aria-label="EcoShine home"><img src="/images/ecoshine-logo.png" width="500" height="500" alt="" /><span>EcoShine</span></Link><button ref={toggleRef} className={`menu-toggle ${open ? "is-open" : ""}`} type="button" aria-expanded={open} aria-controls="primary-menu" aria-label={`${open ? "Close" : "Open"} navigation menu`} onClick={() => setOpen(!open)}><span /><span /><span /></button><div ref={menuRef} id="primary-menu" className={`nav__menu ${open ? "is-open" : ""}`}><NavLink to="/#services">Services</NavLink><NavLink to="/#how-it-works">How It Works</NavLink><NavLink to="/#pricing">Pricing</NavLink><NavLink to="/#areas">Areas</NavLink><NavLink to="/#faq">FAQs</NavLink><NavLink className="button button--primary nav__cta" to="/quote">Request a Quote</NavLink></div></nav></header>;
}
