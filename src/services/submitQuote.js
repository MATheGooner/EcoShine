const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT?.trim();

export async function submitQuote(values) {
  if (!endpoint) return { mode: "demo" };
  if (!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)) throw new Error("The configured form endpoint is invalid.");
  const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(values) });
  if (!response.ok) throw new Error("We could not send your request. Please try again or call EcoShine.");
  return { mode: "live" };
}
