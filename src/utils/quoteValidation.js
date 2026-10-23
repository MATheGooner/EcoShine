export const frequenciesByService = {
  "regular-home-cleaning": ["Weekly", "Fortnightly", "Monthly", "One-off"],
  "deep-cleaning": ["One-off"],
  "end-of-tenancy-cleaning": ["One-off"],
  "small-office-cleaning": ["Weekly", "Fortnightly", "Monthly", "One-off"],
};

export function getRoutingKey(value = "") {
  const normalized = value.trim().toUpperCase();
  const district = normalized.match(/^DUBLIN\s*(\d{1,2}|6W)$/);
  if (district) return district[1] === "6W" ? "D6W" : `D${district[1].padStart(2, "0")}`;
  return normalized.replace(/\s/g, "").slice(0, 3);
}

export function isFutureDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const selected = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !Number.isNaN(selected.getTime()) && selected > today;
}

export function isIrishPhone(value = "") {
  const compact = value.replace(/[\s()-]/g, "");
  return /^(?:\+353|00353|0)[1-9]\d{7,9}$/.test(compact);
}

export function validateQuoteStep(step, values, supportedRoutingKeys) {
  const errors = {};
  if (step === 0 && !values.service) errors.service = "Choose a cleaning service.";
  if (step === 1) {
    if (!values.area.trim()) errors.area = "Enter an area or Eircode.";
    else if (!supportedRoutingKeys.includes(getRoutingKey(values.area))) errors.area = "This appears outside our demonstration service area. Try D02, D14 or A94.";
    if (values.service === "small-office-cleaning") {
      if (!values.businessType) errors.businessType = "Choose a workplace type.";
      if (!values.size || Number(values.size) <= 0) errors.size = "Enter an approximate floor area.";
    } else {
      if (!values.propertyType) errors.propertyType = "Choose a property type.";
      if (!values.bedrooms) errors.bedrooms = "Choose the number of bedrooms.";
      if (!values.bathrooms) errors.bathrooms = "Choose the number of bathrooms.";
    }
  }
  if (step === 2) {
    if (!values.frequency) errors.frequency = "Choose a cleaning frequency.";
    else if (!frequenciesByService[values.service]?.includes(values.frequency)) errors.frequency = "Choose a frequency available for this service.";
    if (!values.date) errors.date = "Choose a preferred date.";
    else if (!isFutureDate(values.date)) errors.date = "Choose a date after today.";
    if (!values.supplies) errors.supplies = "Choose a products and equipment arrangement.";
  }
  if (step === 3) {
    if (!values.name.trim()) errors.name = "Enter your name.";
    if (!isIrishPhone(values.phone)) errors.phone = "Enter a valid Irish phone number, such as 087 123 4567.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Enter a valid email address.";
    if (!values.consent) errors.consent = "Consent is required so we can respond.";
  }
  return errors;
}
