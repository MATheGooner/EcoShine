export const business = { name: "EcoShine", phoneDisplay: "01 687 4120", phoneHref: "+35316874120", phoneInternational: "+353 1 687 4120", email: "hello@ecoshine.ie", hours: "Monday–Saturday, 08:00–18:00" };
export const serviceAreas = [
  { name: "Dublin City", keys: ["D01", "D02", "D03", "D04", "D06", "D07", "D08"] },
  { name: "South Dublin", keys: ["D6W", "D12", "D14", "D16", "D18", "D22", "D24"] },
  { name: "North Dublin", keys: ["D05", "D09", "D11", "D13", "D15", "D17"] },
  { name: "Coastal Dublin", keys: ["A94", "A96", "K36"] },
];
export const supportedRoutingKeys = serviceAreas.flatMap((area) => area.keys);
export const trustPromises = [
  { title: "Fully insured", text: "Covered for work carried out in your home or workplace." },
  { title: "Vetted cleaners", text: "Every cleaner is identity-checked, reference-checked and introduced before their first visit." },
  { title: "Eco-conscious products", text: "We favour effective, lower-odour products and adapt for children, pets and sensitivities." },
  { title: "Clear arrival updates", text: "We confirm the visit in advance and let you know if an arrival window changes." },
  { title: "Re-clean promise", text: "Tell us within 24 hours if an agreed area was missed and we will arrange to put it right." },
  { title: "Equipment made clear", text: "Your quote states whether EcoShine or the customer supplies products and equipment." },
];
export const processSteps = [["01", "Tell us about your property", "Choose a service and share the details needed for an accurate quote."], ["02", "We review and confirm", "We check the scope, answer questions, and confirm pricing and availability."], ["03", "We arrange the clean", "Once you approve the quote, we agree the visit details and introduce your cleaner."]];
