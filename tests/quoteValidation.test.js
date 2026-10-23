import test from "node:test";
import assert from "node:assert/strict";
import { frequenciesByService, getRoutingKey, isFutureDate, isIrishPhone, validateQuoteStep } from "../src/utils/quoteValidation.js";

test("normalises Dublin area names and Eircode routing keys", () => {
  assert.equal(getRoutingKey("Dublin 2"), "D02");
  assert.equal(getRoutingKey("Dublin 6W"), "D6W");
  assert.equal(getRoutingKey("A94 X2N3"), "A94");
});

test("limits one-off services to one-off frequency", () => {
  assert.deepEqual(frequenciesByService["deep-cleaning"], ["One-off"]);
  assert.deepEqual(frequenciesByService["end-of-tenancy-cleaning"], ["One-off"]);
});

test("validates common Irish phone formats", () => {
  assert.equal(isIrishPhone("087 123 4567"), true);
  assert.equal(isIrishPhone("+353 87 123 4567"), true);
  assert.equal(isIrishPhone("555-12"), false);
});

test("rejects today and accepts a future preferred date", () => {
  const tomorrow = new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10);
  assert.equal(isFutureDate(tomorrow), true);
  assert.equal(isFutureDate(new Date().toISOString().slice(0, 10)), false);
});

test("commercial property validation does not require residential fields", () => {
  const values = { service: "small-office-cleaning", area: "D02", businessType: "Office", size: "120", propertyType: "", bedrooms: "", bathrooms: "" };
  assert.deepEqual(validateQuoteStep(1, values, ["D02"]), {});
});

test("residential property validation requires residential details", () => {
  const values = { service: "regular-home-cleaning", area: "D02", businessType: "", size: "", propertyType: "", bedrooms: "", bathrooms: "" };
  const errors = validateQuoteStep(1, values, ["D02"]);
  assert.ok(errors.propertyType);
  assert.ok(errors.bedrooms);
  assert.ok(errors.bathrooms);
});
