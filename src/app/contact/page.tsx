"use client";

import Container from "@/components/ui/Container";
import { useCart } from "@/components/cart/CartContext";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";

export default function OrderPage() {
  const { state, totalPrice, dispatch } = useCart();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const items = state.items;
  const subtotal = useMemo(() => totalPrice, [totalPrice]);
  const shipping = useMemo(() => (subtotal > 0 ? 25 : 0), [subtotal]);
  const grandTotal = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const customer = Object.fromEntries(form.entries());
    try {
      setSubmitting(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          totals: { subtotal, shipping, grandTotal },
          customer,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");
      toast.success("Order placed successfully! Thank you.");
      dispatch({ type: "CLEAR" });
      formElement?.reset();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container className="py-12 space-y-8">
      <h1 className="text-4xl font-extrabold tracking-tight">Checkout</h1>

      {null}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-white p-6">
            <h2 className="font-semibold text-lg">Order Summary</h2>
            <div className="mt-4 divide-y">
              {items.length === 0 && (
                <p className="text-sm text-neutral-600">Your cart is empty.</p>
              )}
              {items.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 rounded-lg object-cover border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-neutral-50 cursor-pointer"
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
                        className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-neutral-50 cursor-pointer"
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
                  <div className="text-sm font-medium w-16 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-xl border bg-white p-6 space-y-4">
            <h2 className="font-semibold text-lg">Customer Details</h2>
            <div className="grid gap-3">
              <label className="text-sm">
                <span className="mb-1 block text-neutral-700">Full name</span>
                <input
                  name="fullName"
                  required
                  placeholder="John Doe"
                  className="h-12 w-full rounded-xl border px-4 focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-neutral-700">
                  Email address
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="h-12 w-full rounded-xl border px-4 focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-neutral-700">
                  Phone number
                </span>
                <input
                  name="phone"
                  required
                  placeholder="+1 555 000 1111"
                  className="h-12 w-full rounded-xl border px-4 focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </label>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 space-y-4">
            <h2 className="font-semibold text-lg">Shipping Address</h2>
            <label className="text-sm">
              <span className="mb-1 block text-neutral-700">
                Address line 1
              </span>
              <input
                name="addressLine1"
                required
                placeholder="123 Main St"
                className="h-12 w-full rounded-xl border px-4 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-neutral-700">
                Address line 2
              </span>
              <input
                name="addressLine2"
                placeholder="Apartment, suite, etc. (optional)"
                className="h-12 w-full rounded-xl border px-4 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">
                <span className="mb-1 block text-neutral-700">City</span>
                <input
                  name="city"
                  required
                  placeholder="City"
                  className="h-12 w-full rounded-xl border px-4 focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-neutral-700">
                  State/Province
                </span>
                <input
                  name="state"
                  required
                  placeholder="State or province"
                  className="h-12 w-full rounded-xl border px-4 focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">
                <span className="mb-1 block text-neutral-700">Postal code</span>
                <input
                  name="postalCode"
                  required
                  placeholder="ZIP / Postal code"
                  className="h-12 w-full rounded-xl border px-4 focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-neutral-700">Country</span>
                <input
                  name="country"
                  required
                  placeholder="Country"
                  className="h-12 w-full rounded-xl border px-4 focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </label>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 space-y-4">
            <h2 className="font-semibold text-lg">Additional Notes</h2>
            <textarea
              name="notes"
              placeholder="Any delivery notes or special instructions"
              rows={4}
              className="rounded-xl border px-4 py-3"
            />
          </div>

          <button
            className={`h-12 w-full rounded-full text-white transition-colors ${
              submitting
                ? "bg-black/70 cursor-not-allowed"
                : "bg-black hover:bg-gray-900 cursor-pointer"
            }`}
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Placing order..." : "Place Order"}
          </button>
        </form>
      </div>
    </Container>
  );
}
