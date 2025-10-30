"use client";

import Container from "@/components/Container";
import { useCart } from "@/components/cart/CartContext";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function OrderPage() {
  const { state, totalPrice, dispatch } = useCart();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const items = state.items;
  const subtotal = useMemo(() => totalPrice, [totalPrice]);
  // Shipping fee calculation removed
  // Grand total is only the subtotal now
  const grandTotal = useMemo(() => subtotal, [subtotal]);

  function validate(form: FormData) {
    const newErrors: Record<string, string> = {};
    const name = (form.get("fullName") || "").toString().trim();
    const email = (form.get("email") || "").toString().trim();
    const phone = (form.get("phone") || "").toString().trim();
    const address = (form.get("addressLine1") || "").toString().trim();
    const city = (form.get("city") || "").toString().trim();
    const state = (form.get("state") || "").toString().trim();
    const postalCode = (form.get("postalCode") || "").toString().trim();
    const country = (form.get("country") || "").toString().trim();

    if (!name) newErrors.fullName = "Name is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Invalid email address.";
    if (!phone) newErrors.phone = "Phone number is required.";
    else if (!/^\+?\d{10,}$/.test(phone.replace(/\s+/g, "")))
      newErrors.phone = "Phone must be valid.";
    if (!address) newErrors.addressLine1 = "Address is required.";
    if (!city) newErrors.city = "City is required.";
    if (!state) newErrors.state = "State/Province is required.";
    if (!postalCode) newErrors.postalCode = "Postal code is required.";
    if (!country) newErrors.country = "Country is required.";
    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const errorsObj = validate(form);
    setErrors(errorsObj);
    if (Object.keys(errorsObj).length) return;
    const customer = Object.fromEntries(form.entries());
    try {
      setSubmitting(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          // Only send subtotal & grandTotal (equal), do not send shipping
          totals: { subtotal, grandTotal },
          customer,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");
      toast.success("Order placed successfully! Thank you.");
      dispatch({ type: "CLEAR" });
      formElement?.reset();
      setErrors({});
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container className="p-2 sm:p-15 mt-15 m-10 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
      <h1 className="text-2xl ml-3 sm:text-3xl lg:text-4xl font-bold tracking-tight">
        Checkout
      </h1>

      {null}

      <div className="mx-3 grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Summary */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="rounded-xl border bg-[#FAFAFA] p-4 sm:p-6">
            <h2 className="font-semibold text-lg">Order Summary</h2>
            <div className="mt-4 divide-y">
              {items.length === 0 && (
                <p className="text-sm text-neutral-600 py-4">
                  Your cart is empty.
                </p>
              )}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="py-3 sm:py-4 flex items-start sm:items-center gap-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg object-cover border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      ₹{item.price.toFixed(2)} each
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border flex items-center justify-center hover:bg-neutral-50 cursor-pointer text-sm"
                        onClick={() =>
                          dispatch({
                            type: "DECREMENT",
                            payload: { id: item.id },
                          })
                        }
                      >
                        −
                      </button>
                      <span className="text-sm w-6 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border flex items-center justify-center hover:bg-neutral-50 cursor-pointer text-sm"
                        onClick={() =>
                          dispatch({
                            type: "ADD",
                            payload: {
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              image: item.image,
                            },
                          })
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-right flex-shrink-0">
                    <div className="sm:hidden text-xs text-gray-500">Total</div>
                    <div>₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
              <div className="text-[13px] mt-2 text-neutral-600 italic">
                <span>
                  Shipping fee will be communicated to you via phone call.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="rounded-xl border bg-[#FAFAFA] p-4 sm:p-6 space-y-4">
            <h2 className="font-semibold text-lg">Customer Details</h2>
            <div className="grid gap-3 sm:gap-4">
              <label className="text-sm">
                <span className="mb-1 block text-neutral-700">Full name</span>
                <input
                  name="fullName"
                  placeholder="John Doe"
                  className={`h-11 sm:h-12 w-full rounded-xl border px-4 focus:outline-none focus:ring-2 text-base ${
                    errors.fullName ? "border-red-500" : ""
                  }`}
                />
                {errors.fullName && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.fullName}
                  </div>
                )}
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-neutral-700">
                  Email address
                </span>
                <input
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  className={`h-11 sm:h-12 w-full rounded-xl border px-4 focus:outline-none focus:ring-2 text-base ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.email}
                  </div>
                )}
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-neutral-700">
                  Phone number
                </span>
                <input
                  name="phone"
                  placeholder="+1 555 000 1111"
                  className={`h-11 sm:h-12 w-full rounded-xl border px-4 focus:outline-none focus:ring-2 text-base ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                />
                {errors.phone && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.phone}
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="rounded-xl border bg-[#FAFAFA] p-4 sm:p-6 space-y-4">
            <h2 className="font-semibold text-lg">Shipping Address</h2>
            <label className="text-sm">
              <span className="mb-1 block text-neutral-700">
                Address line 1
              </span>
              <input
                name="addressLine1"
                placeholder="123 Main St"
                className={`h-11 sm:h-12 w-full rounded-xl border px-4 focus:outline-none focus:ring-2 text-base ${
                  errors.addressLine1 ? "border-red-500" : ""
                }`}
              />
              {errors.addressLine1 && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.addressLine1}
                </div>
              )}
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-neutral-700">
                Address line 2
              </span>
              <input
                name="addressLine2"
                placeholder="Apartment, suite, etc. (optional)"
                className="h-11 sm:h-12 w-full rounded-xl border px-4 focus:outline-none focus:ring-2 focus:ring-black/10 text-base"
              />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm">
                <span className="mb-1 block text-neutral-700">City</span>
                <input
                  name="city"
                  placeholder="City"
                  className={`h-11 sm:h-12 w-full rounded-xl border px-4 focus:outline-none focus:ring-2 text-base ${
                    errors.city ? "border-red-500" : ""
                  }`}
                />
                {errors.city && (
                  <div className="text-red-500 text-xs mt-1">{errors.city}</div>
                )}
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-neutral-700">
                  State/Province
                </span>
                <input
                  name="state"
                  placeholder="State or province"
                  className={`h-11 sm:h-12 w-full rounded-xl border px-4 focus:outline-none focus:ring-2 text-base ${
                    errors.state ? "border-red-500" : ""
                  }`}
                />
                {errors.state && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.state}
                  </div>
                )}
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm">
                <span className="mb-1 block text-neutral-700">Postal code</span>
                <input
                  name="postalCode"
                  placeholder="ZIP / Postal code"
                  className={`h-11 sm:h-12 w-full rounded-xl border px-4 focus:outline-none focus:ring-2 text-base ${
                    errors.postalCode ? "border-red-500" : ""
                  }`}
                />
                {errors.postalCode && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.postalCode}
                  </div>
                )}
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-neutral-700">Country</span>
                <input
                  name="country"
                  placeholder="Country"
                  className={`h-11 sm:h-12 w-full rounded-xl border px-4 focus:outline-none focus:ring-2 text-base ${
                    errors.country ? "border-red-500" : ""
                  }`}
                />
                {errors.country && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.country}
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="rounded-xl border bg-[#FAFAFA] p-4 sm:p-6 space-y-4">
            <h2 className="font-semibold text-lg">Additional Notes</h2>
            <textarea
              name="notes"
              placeholder="Any delivery notes or special instructions"
              rows={4}
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/10 text-base resize-none"
            />
          </div>

          <button
            className={`h-12 sm:h-14 w-full rounded-full text-white transition-all duration-200 font-medium ${
              submitting
                ? "bg-black/70 cursor-not-allowed"
                : "bg-black hover:bg-gray-900 cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            }`}
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Placing order...
              </div>
            ) : (
              "Place Order"
            )}
          </button>
        </form>
      </div>
    </Container>
  );
}
