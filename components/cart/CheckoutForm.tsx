"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import Container from "@/components/Container";
import { useCart } from "@/components/cart/CartProvider";
import { authClient } from "@/lib/auth-client";
import { createOrder, type CreateOrderRequest, type DeliveryZone } from "@/lib/api/orders";
import { clearCart } from "@/lib/cart";
import { saveOrderConfirmation } from "@/lib/order-confirmation";
import { useRouter } from "next/navigation";

type CheckoutValues = {
  name: string;
  phone: string;
  addressLine: string;
  area: string;
  city: string;
  district: string;
  postalCode: string;
  deliveryZone: DeliveryZone;
  customerNote: string;
};
type FieldErrors = Partial<Record<keyof CheckoutValues, string>>;

const initialValues: CheckoutValues = {
  name: "", phone: "", addressLine: "", area: "", city: "", district: "",
  postalCode: "", deliveryZone: "dhaka", customerNote: "",
};
const money = (amount: number) => `৳${amount.toLocaleString("en-BD")}`;
const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-line bg-white px-4 text-sm text-navy outline-none transition-colors placeholder:text-ink/40 focus:border-blue focus:ring-2 focus:ring-blue/15";

function validate(values: CheckoutValues): FieldErrors {
  const errors: FieldErrors = {};
  if (values.name.trim().length < 2 || values.name.trim().length > 100) errors.name = "Enter a name between 2 and 100 characters.";
  const phone = values.phone.trim().replace(/[\s()-]/g, "");
  if (!/^\+?[0-9]{7,15}$/.test(phone)) errors.phone = "Enter a valid phone number, including +880 if needed.";
  if (values.addressLine.trim().length < 5 || values.addressLine.trim().length > 200) errors.addressLine = "Enter an address between 5 and 200 characters.";
  if (values.area.trim().length < 2 || values.area.trim().length > 100) errors.area = "Enter an area between 2 and 100 characters.";
  if (values.city.trim().length < 2 || values.city.trim().length > 100) errors.city = "Enter a city between 2 and 100 characters.";
  if (values.district.trim().length < 2 || values.district.trim().length > 100) errors.district = "Enter a district between 2 and 100 characters.";
  if (values.postalCode.trim().length > 20) errors.postalCode = "Postal code cannot exceed 20 characters.";
  if (values.customerNote.trim().length > 1000) errors.customerNote = "Note cannot exceed 1000 characters.";
  return errors;
}

function messageFromError(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const data = error as { message?: unknown; errorMessages?: unknown };
    if (typeof data.message === "string") return data.message;
    if (Array.isArray(data.errorMessages)) {
      const firstMessage = data.errorMessages.find((item) => typeof item?.message === "string")?.message;
      if (typeof firstMessage === "string") return firstMessage;
    }
  }
  return "We couldn't place your order. Please check your details and try again.";
}

function Field({
  label, name, value, onChange, error, type = "text", autoComplete, required,
}: {
  label: string;
  name: keyof CheckoutValues;
  value: string;
  onChange: (name: keyof CheckoutValues, value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="text-sm font-bold text-navy">{label}{required && <span aria-hidden="true" className="text-red-600"> *</span>}</label>
      <input id={name} name={name} type={type} autoComplete={autoComplete} required={required} value={value} onChange={(event) => onChange(name, event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className={`${inputClass} ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/15" : ""}`} />
      {error && <p id={errorId} className="mt-1.5 text-xs text-red-700">{error}</p>}
    </div>
  );
}

export default function CheckoutForm() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const { items, subtotal, hydrated } = useCart();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const submissionLock = useRef(false);

  const change = (name: keyof CheckoutValues, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setRequestError("");
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionLock.current) return;
    if (!items.length) {
      setRequestError("Your cart is empty. Add a product before checkout.");
      return;
    }
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }
    if (!session?.user) {
      setRequestError("Please sign in to place an order. Your account email is used for order updates.");
      return;
    }

    submissionLock.current = true;
    setIsSubmitting(true);
    setRequestError("");
    const phone = values.phone.trim().replace(/[\s()-]/g, "");
    const payload: CreateOrderRequest = {
      items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      customer: { name: values.name.trim(), phone },
      deliveryAddress: {
        addressLine: values.addressLine.trim(),
        area: values.area.trim(),
        city: values.city.trim(),
        district: values.district.trim(),
        ...(values.postalCode.trim() ? { postalCode: values.postalCode.trim() } : {}),
      },
      deliveryZone: values.deliveryZone,
      ...(values.customerNote.trim() ? { customerNote: values.customerNote.trim() } : {}),
    };

    try {
      const order = await createOrder(payload);
      saveOrderConfirmation(order);
      clearCart();
      toast.success("Your order has been placed.");
      router.push("/checkout/success");
    } catch (error: unknown) {
      const message = messageFromError(error);
      setRequestError(message);
      toast.error(message);
      submissionLock.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-mist/45 py-14 max-[600px]:py-9">
      <Container>
        <div className="mx-auto max-w-[1180px]">
          <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-blue hover:text-deep"><ArrowLeft size={16} aria-hidden="true" /> Back to cart</Link>
          <div className="mt-4">
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">Secure checkout</p>
            <h1 className="text-[clamp(32px,4vw,48px)] font-extrabold leading-tight tracking-[-0.04em] text-navy">Delivery details</h1>
            <p className="mt-2 text-sm leading-6 text-ink/65">Your order will be paid by cash on delivery.</p>
          </div>

          {!hydrated ? <div className="mt-8 rounded-2xl border border-line bg-white p-6" role="status">Loading your cart…</div> : items.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-line bg-white p-7">
              <h2 className="font-bold text-navy">Your cart is empty</h2>
              <p className="mt-2 text-sm text-ink/65">Add products before starting checkout.</p>
              <Link href="/products" className="mt-4 inline-flex font-bold text-blue hover:text-deep">Browse products <ArrowRight size={16} className="ml-2" /></Link>
            </div>
          ) : (
            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-line bg-white p-7 shadow-[0_10px_30px_rgba(0,51,78,0.04)] max-[600px]:p-5">
                <fieldset disabled={isSubmitting || sessionPending} className="min-w-0">
                  <legend className="text-lg font-extrabold text-navy">Customer and delivery</legend>
                  <p className="mt-1 text-sm text-ink/60">Fields marked with * are required.</p>
                  {!sessionPending && !session?.user && <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">The order service requires an account so it can send your order confirmation. <Link href="/login?callbackUrl=%2Fcheckout" className="font-bold underline underline-offset-2">Sign in or create an account</Link>, then return to checkout.</div>}

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <Field label="Customer name" name="name" value={values.name} onChange={change} error={errors.name} autoComplete="name" required />
                    <Field label="Phone number" name="phone" type="tel" value={values.phone} onChange={change} error={errors.phone} autoComplete="tel" required />
                    <div className="sm:col-span-2"><Field label="Delivery address" name="addressLine" value={values.addressLine} onChange={change} error={errors.addressLine} autoComplete="street-address" required /></div>
                    <Field label="Area" name="area" value={values.area} onChange={change} error={errors.area} autoComplete="address-level3" required />
                    <Field label="City" name="city" value={values.city} onChange={change} error={errors.city} autoComplete="address-level2" required />
                    <Field label="District" name="district" value={values.district} onChange={change} error={errors.district} autoComplete="address-level1" required />
                    <Field label="Postal code" name="postalCode" value={values.postalCode} onChange={change} error={errors.postalCode} autoComplete="postal-code" />
                    <div className="sm:col-span-2">
                      <label htmlFor="deliveryZone" className="text-sm font-bold text-navy">Delivery zone <span aria-hidden="true" className="text-red-600">*</span></label>
                      <select id="deliveryZone" name="deliveryZone" value={values.deliveryZone} onChange={(event) => change("deliveryZone", event.target.value)} className={inputClass}>
                        <option value="dhaka">Inside Dhaka</option>
                        <option value="outside_dhaka">Outside Dhaka</option>
                      </select>
                      <p className="mt-1.5 text-xs leading-5 text-ink/55">The delivery fee and final total are confirmed by the server when the order is placed.</p>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="customerNote" className="text-sm font-bold text-navy">Note for delivery <span className="font-normal text-ink/55">(optional)</span></label>
                      <textarea id="customerNote" name="customerNote" rows={3} maxLength={1000} value={values.customerNote} onChange={(event) => change("customerNote", event.target.value)} aria-invalid={Boolean(errors.customerNote)} aria-describedby={errors.customerNote ? "customerNote-error" : undefined} className={`${inputClass} resize-y py-3`} />
                      {errors.customerNote && <p id="customerNote-error" className="mt-1.5 text-xs text-red-700">{errors.customerNote}</p>}
                    </div>
                  </div>
                </fieldset>
                {requestError && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800" role="alert">{requestError}</p>}
                <button type="submit" disabled={isSubmitting || sessionPending || !session?.user || items.length === 0} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-blue px-5 text-sm font-bold text-white transition-colors hover:bg-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:cursor-not-allowed disabled:bg-ink/35">
                  {isSubmitting ? <><span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> Placing order…</> : <>Place order <ArrowRight size={16} aria-hidden="true" /></>}
                </button>
                <p className="mt-3 flex items-center justify-center gap-2 text-xs text-ink/55"><ShieldCheck size={15} aria-hidden="true" /> Cash on delivery · Prices and stock verified at order time</p>
              </form>

              <aside className="rounded-2xl border border-line bg-white p-6 shadow-[0_10px_30px_rgba(0,51,78,0.06)] lg:sticky lg:top-28">
                <h2 className="text-lg font-extrabold text-navy">Order summary</h2>
                <ul className="mt-4 divide-y divide-line">
                  {items.map((item) => <li key={item.productId} className="flex justify-between gap-4 py-3 text-sm"><span className="min-w-0 text-ink/75">{item.name} <span className="whitespace-nowrap text-ink/50">× {item.quantity}</span></span><span className="shrink-0 font-semibold tabular-nums text-navy">{money(item.price * item.quantity)}</span></li>)}
                </ul>
                <div className="mt-2 flex justify-between border-t border-line pt-4 text-sm"><span className="text-ink/65">Estimated subtotal</span><span className="font-bold tabular-nums text-navy">{money(subtotal)}</span></div>
                <div className="mt-3 flex justify-between text-sm"><span className="text-ink/65">Delivery</span><span className="text-right text-xs leading-5 text-ink/60">Confirmed after order placement</span></div>
                <div className="mt-3 flex justify-between border-t border-line pt-4"><span className="text-sm font-bold text-navy">Final total</span><span className="max-w-[170px] text-right text-xs leading-5 text-ink/60">Shown using server-confirmed prices and delivery</span></div>
                <p className="mt-4 rounded-xl bg-mist p-3 text-xs leading-5 text-ink/65">Displayed prices are estimates from the cart. The backend verifies current stock and prices before accepting your order.</p>
              </aside>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
