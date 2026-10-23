import { useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useQuoteForm from "../../hooks/useQuoteForm";
import { addOns, getService, services } from "../../data/services";
import { supportedRoutingKeys } from "../../data/business";
import { frequenciesByService, getRoutingKey, validateQuoteStep } from "../../utils/quoteValidation";
import { submitQuote } from "../../services/submitQuote";
import { ChoiceCard, FormField } from "./FormField";

const steps = ["Service", "Property", "Requirements", "Contact", "Review"];

export default function QuoteForm() {
  const [params] = useSearchParams();
  const prefill = getService(params.get("service")) ? params.get("service") : "";
  const { values, setField, toggleAddon } = useQuoteForm(prefill);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const summaryRef = useRef(null);
  const headingRef = useRef(null);
  const navigate = useNavigate();
  const service = getService(values.service);
  const relevantAddOns = useMemo(() => addOns.filter((item) => item.services.includes(values.service)), [values.service]);
  const earliestDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const update = ({ target }) => {
    setField(target.name, target.type === "checkbox" ? target.checked : target.value);
    if (target.name === "service" && target.value !== values.service) {
      setField("frequency", "");
      setField("addOns", []);
      setField("businessType", "");
      setField("propertyType", "");
    }
    setErrors((current) => ({ ...current, [target.name]: undefined }));
  };

  const moveToStep = (nextStep) => {
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.requestAnimationFrame(() => headingRef.current?.focus());
  };

  const next = () => {
    const found = validateQuoteStep(step, values, supportedRoutingKeys);
    if (Object.keys(found).length) {
      setErrors(found);
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setErrors({});
    moveToStep(Math.min(step + 1, 4));
  };

  const back = () => { setErrors({}); moveToStep(Math.max(step - 1, 0)); };

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const result = await submitQuote(values);
      if (result.mode === "demo") await new Promise((resolve) => window.setTimeout(resolve, 600));
      navigate("/thank-you", { state: { service: service.name, date: values.date, frequency: values.frequency, submissionMode: result.mode } });
    } catch (error) {
      setSubmitError(error.message || "We could not send your request. Please try again.");
      setSubmitting(false);
    }
  };

  return <form className="quote-form" onSubmit={submit} noValidate>
    <div className="quote-progress">
      <p>Step {step + 1} of {steps.length}</p>
      <ol aria-label="Quote request progress">{steps.map((label, index) => <li key={label} className={index === step ? "is-current" : index < step ? "is-complete" : ""} aria-current={index === step ? "step" : undefined}><span>{index < step ? "✓" : index + 1}</span><small>{label}</small></li>)}</ol>
    </div>
    {Object.keys(errors).length > 0 && <div className="error-summary" role="alert" tabIndex="-1" ref={summaryRef}><strong>Please check this step</strong><ul>{Object.values(errors).map((error) => <li key={error}>{error}</li>)}</ul></div>}

    {step === 0 && <fieldset><legend ref={headingRef} tabIndex="-1">What would you like us to clean?</legend><p className="step-intro">Choose the service that best matches the job.</p><div className="choice-grid">{services.map((item) => <ChoiceCard key={item.slug} name="service" value={item.slug} checked={values.service === item.slug} onChange={update} title={item.name} text={item.frequency} />)}</div>{errors.service && <p className="field-error">{errors.service}</p>}</fieldset>}

    {step === 1 && <fieldset><legend ref={headingRef} tabIndex="-1">Tell us about the {values.service === "small-office-cleaning" ? "workplace" : "property"}</legend><FormField id="area" label="Area or Eircode" hint="Example: Dublin 2, D02 X285 or A94" error={errors.area}><input id="area" name="area" value={values.area} onChange={update} autoComplete="postal-code" /></FormField>{values.area && !errors.area && supportedRoutingKeys.includes(getRoutingKey(values.area)) && <p className="coverage-success" role="status">✓ This appears to be within our demonstration service area.</p>}{values.service === "small-office-cleaning" ? <div className="field-grid"><FormField id="businessType" label="Workplace type" error={errors.businessType}><select id="businessType" name="businessType" value={values.businessType} onChange={update}><option value="">Choose one</option><option>Office</option><option>Studio</option><option>Professional practice</option><option>Other small workplace</option></select></FormField><FormField id="size" label="Approximate floor area (m²)" error={errors.size}><input id="size" name="size" type="number" min="1" inputMode="numeric" value={values.size} onChange={update} /></FormField></div> : <><div className="field-grid"><FormField id="propertyType" label="Property type" error={errors.propertyType}><select id="propertyType" name="propertyType" value={values.propertyType} onChange={update}><option value="">Choose one</option><option>Apartment</option><option>Terraced house</option><option>Semi-detached house</option><option>Detached house</option></select></FormField><FormField id="size" label="Approximate size (m², optional)"><input id="size" name="size" type="number" min="1" inputMode="numeric" value={values.size} onChange={update} /></FormField></div><div className="field-grid"><FormField id="bedrooms" label="Bedrooms" error={errors.bedrooms}><select id="bedrooms" name="bedrooms" value={values.bedrooms} onChange={update}><option value="">Choose</option>{["Studio", 1, 2, 3, 4, "5+"].map((number) => <option key={number}>{number}</option>)}</select></FormField><FormField id="bathrooms" label="Bathrooms" error={errors.bathrooms}><select id="bathrooms" name="bathrooms" value={values.bathrooms} onChange={update}><option value="">Choose</option>{[1, 2, 3, "4+"].map((number) => <option key={number}>{number}</option>)}</select></FormField></div></>}</fieldset>}

    {step === 2 && <fieldset><legend ref={headingRef} tabIndex="-1">What does your clean need?</legend><div className="form-field"><span className="label" id="frequency-label">Frequency</span><div className="choice-row" role="radiogroup" aria-labelledby="frequency-label">{(frequenciesByService[values.service] || []).map((item) => <ChoiceCard key={item} name="frequency" value={item} checked={values.frequency === item} onChange={update} title={item} />)}</div>{errors.frequency && <span className="field-error">{errors.frequency}</span>}</div><div className="field-grid"><FormField id="date" label="Preferred date" error={errors.date}><input id="date" name="date" type="date" min={earliestDate} value={values.date} onChange={update} /></FormField><label className="check-control"><input name="flexible" type="checkbox" checked={values.flexible} onChange={update} /><span>My date is flexible</span></label></div>{relevantAddOns.length > 0 && <fieldset className="nested-fieldset"><legend>Optional extras</legend><div className="check-grid">{relevantAddOns.map((item) => <label className="check-control" key={item.id}><input type="checkbox" checked={values.addOns.includes(item.id)} onChange={() => toggleAddon(item.id)} /><span>{item.label}</span></label>)}</div></fieldset>}<FormField id="supplies" label="Products and equipment" error={errors.supplies}><select id="supplies" name="supplies" value={values.supplies} onChange={update}><option value="">Choose an arrangement</option><option>EcoShine should bring products and equipment</option><option>I will provide products and equipment</option><option>Let’s discuss what is needed</option></select></FormField><FormField id="notes" label="Anything else we should know?" hint="Optional — priorities, pets, access or sensitivities"><textarea id="notes" name="notes" rows="4" value={values.notes} onChange={update} /></FormField></fieldset>}

    {step === 3 && <fieldset><legend ref={headingRef} tabIndex="-1">Where should we send your quote?</legend><div className="field-grid"><FormField id="name" label="Full name" error={errors.name}><input id="name" name="name" autoComplete="name" value={values.name} onChange={update} /></FormField><FormField id="phone" label="Irish phone number" error={errors.phone}><input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="087 123 4567" value={values.phone} onChange={update} /></FormField></div><FormField id="email" label="Email address" error={errors.email}><input id="email" name="email" type="email" autoComplete="email" inputMode="email" value={values.email} onChange={update} /></FormField><label className={`check-control consent ${errors.consent ? "has-error" : ""}`}><input name="consent" type="checkbox" checked={values.consent} onChange={update} /><span>I agree that EcoShine may use these details only to respond to this quote request. In demo mode, the information is not transmitted or retained.</span></label>{errors.consent && <p className="field-error">{errors.consent}</p>}</fieldset>}

    {step === 4 && <fieldset><legend ref={headingRef} tabIndex="-1">Review your quote request</legend><p className="step-intro">Nothing is booked yet. EcoShine will confirm the scope, price and availability before you decide whether to proceed.</p><dl className="review-list"><div><dt>Service</dt><dd>{service?.name}</dd></div><div><dt>Property</dt><dd>{values.businessType ? `${values.businessType}, approximately ${values.size} m²` : `${values.propertyType}, ${values.bedrooms} bedroom(s), ${values.bathrooms} bathroom(s)${values.size ? `, approximately ${values.size} m²` : ""}`}</dd></div><div><dt>Area</dt><dd>{values.area}</dd></div><div><dt>Schedule</dt><dd>{values.frequency} · {values.date}{values.flexible ? " (flexible)" : ""}</dd></div><div><dt>Products and equipment</dt><dd>{values.supplies}</dd></div><div><dt>Extras</dt><dd>{values.addOns.length ? values.addOns.map((id) => addOns.find((item) => item.id === id)?.label).join(", ") : "None selected"}</dd></div><div><dt>Contact</dt><dd>{values.name}<br />{values.phone}<br />{values.email}</dd></div>{values.notes && <div><dt>Notes</dt><dd>{values.notes}</dd></div>}</dl></fieldset>}

    {submitError && <div className="error-summary" role="alert"><strong>Request not sent</strong><p>{submitError}</p></div>}
    <div className="form-actions">{step > 0 && <button className="button button--secondary" type="button" onClick={back} disabled={submitting}>Back</button>}{step < 4 ? <button className="button button--primary" type="button" onClick={next}>Continue</button> : <button className="button button--primary" type="submit" disabled={submitting}>{submitting ? "Sending request…" : "Request My Quote"}</button>}</div>
    {step === 4 && <p className="submit-note">No obligation. We’ll confirm pricing and availability within one business day.</p>}
  </form>;
}
