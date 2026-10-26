"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import Container from "@/components/Container";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  createOrder,
  type CreateOrderRequest,
  type DeliveryZone,
} from "@/lib/api/orders";
import { authClient } from "@/lib/auth-client";
import { clearCart } from "@/lib/cart";

import EmptyCart from "@/components/cart/EmptyCart";
import CheckoutLoader from "./CheckoutLoader";

const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter a name between 2 and 100 characters.")
    .max(100, "Enter a name between 2 and 100 characters."),
  phone: z
    .string()
    .trim()
    .refine(
      (value) =>
        /^\+?[0-9]{7,15}$/.test(value.replace(/[\s()-]/g, "")),
      "Enter a valid phone number, including +880 if needed.",
    ),
  addressLine: z
    .string()
    .trim()
    .min(5, "Enter an address between 5 and 200 characters.")
    .max(200, "Enter an address between 5 and 200 characters."),
  area: z
    .string()
    .trim()
    .min(2, "Enter an area between 2 and 100 characters.")
    .max(100, "Enter an area between 2 and 100 characters."),
  city: z
    .string()
    .trim()
    .min(2, "Enter a city between 2 and 100 characters.")
    .max(100, "Enter a city between 2 and 100 characters."),
  district: z
    .string()
    .trim()
    .min(2, "Enter a district between 2 and 100 characters.")
    .max(100, "Enter a district between 2 and 100 characters."),
  postalCode: z
    .string()
    .trim()
    .max(20, "Postal code cannot exceed 20 characters."),
  deliveryZone: z.enum(["dhaka", "outside_dhaka"]),
  customerNote: z
    .string()
    .trim()
    .max(1000, "Note cannot exceed 1000 characters."),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

const initialValues: CheckoutValues = {
  name: "",
  phone: "",
  addressLine: "",
  area: "",
  city: "",
  district: "",
  postalCode: "",
  deliveryZone: "dhaka",
  customerNote: "",
};

const money = (amount: number) =>
  `৳${amount.toLocaleString("en-BD")}`;

function messageFromError(error: unknown): string {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const data = error as {
      message?: unknown;
      errorMessages?: unknown;
    };

    if (typeof data.message === "string") return data.message;

    if (Array.isArray(data.errorMessages)) {
      const firstMessage = data.errorMessages.find(
        (item) => typeof item?.message === "string",
      )?.message;

      if (typeof firstMessage === "string") return firstMessage;
    }
  }

  return "We couldn't place your order. Please check your details and try again.";
}

const fieldClassName =
  "min-h-12 rounded-xl border-line bg-white text-sm text-navy shadow-none placeholder:text-ink/40 focus-visible:border-blue focus-visible:ring-2 focus-visible:ring-blue/15";

export default function CheckoutForm() {
  const router = useRouter();

  const { data: session, isPending: sessionPending } =
    authClient.useSession();
  const { items, subtotal, hydrated } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const submissionLock = useRef(false);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: initialValues,
    mode: "onTouched",
  });

  const { control, handleSubmit, setValue, formState } = form;

  // Prefill profile data without overwriting anything the customer has entered.
  useEffect(() => {
    if (!session?.user) return;

    if (!form.getValues("name") && session.user.name) {
      setValue("name", session.user.name, {
        shouldDirty: false,
        shouldValidate: formState.touchedFields.name,
      });
    }

    if (!form.getValues("phone") && session.user.phone) {
      setValue("phone", session.user.phone, {
        shouldDirty: false,
        shouldValidate: formState.touchedFields.phone,
      });
    }
  }, [
    session?.user,
    form,
    setValue,
    formState.touchedFields.name,
    formState.touchedFields.phone,
  ]);

  const onSubmit = async (values: CheckoutValues) => {
    if (submissionLock.current) return;

    if (!items.length) {
      const message =
        "Your cart is empty. Add a product before checkout.";
      setRequestError(message);
      return;
    }

    if (!session?.user) {
      const message =
        "Please sign in to place an order. Your account email is used for order updates.";
      setRequestError(message);
      return;
    }

    submissionLock.current = true;
    setIsSubmitting(true);
    setRequestError("");

    const phone = values.phone.trim().replace(/[\s()-]/g, "");

    const payload: CreateOrderRequest = {
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      customer: {
        name: values.name.trim(),
        phone,
      },
      deliveryAddress: {
        addressLine: values.addressLine.trim(),
        area: values.area.trim(),
        city: values.city.trim(),
        district: values.district.trim(),
        ...(values.postalCode.trim()
          ? { postalCode: values.postalCode.trim() }
          : {}),
      },
      deliveryZone: values.deliveryZone as DeliveryZone,
      ...(values.customerNote.trim()
        ? { customerNote: values.customerNote.trim() }
        : {}),
    };

    try {
      const order = await createOrder(payload);

      clearCart();
      toast.success("Your order has been placed.");

      router.push(
        `/checkout/success?orderId=${encodeURIComponent(order._id)}`,
      );
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
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue transition-colors hover:text-deep"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to cart
          </Link>

          <div className="mt-4">
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">
              Secure checkout
            </p>
            <h1 className="text-[clamp(32px,4vw,48px)] font-extrabold leading-tight tracking-[-0.04em] text-navy">
              Delivery details
            </h1>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              Your order will be paid by cash on delivery.
            </p>
          </div>

          {!hydrated ? (
            <CheckoutLoader />
          ) : items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="min-w-0 rounded-2xl border border-line bg-white p-7 shadow-[0_10px_30px_rgba(0,51,78,0.04)] max-[600px]:p-5"
              >
                <fieldset
                  disabled={isSubmitting || sessionPending}
                  className="min-w-0"
                >
                  <legend className="text-lg font-extrabold text-navy">
                    Customer and delivery
                  </legend>
                  <p className="mt-1 text-sm text-ink/60">
                    Fields marked with{" "}
                    <span aria-hidden="true">*</span> are required.
                  </p>

                  {!sessionPending && !session?.user && (
                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                      The order service requires an account so it can
                      send your order confirmation.{" "}
                      <Link
                        href="/login?callbackUrl=%2Fcheckout"
                        className="font-bold underline underline-offset-2"
                      >
                        Sign in or create an account
                      </Link>
                      , then return to checkout.
                    </div>
                  )}

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="text-sm font-bold text-navy"
                      >
                        Customer name{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <Input
                        id="name"
                        autoComplete="name"
                        placeholder="Your full name"
                        aria-invalid={Boolean(formState.errors.name)}
                        aria-describedby={
                          formState.errors.name
                            ? "name-error"
                            : undefined
                        }
                        {...form.register("name")}
                        className={`${fieldClassName} mt-2`}
                      />
                      {formState.errors.name && (
                        <p
                          id="name-error"
                          className="mt-1.5 text-xs text-red-700"
                        >
                          {formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="text-sm font-bold text-navy"
                      >
                        Phone number{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+880 1XXXXXXXXX"
                        aria-invalid={Boolean(formState.errors.phone)}
                        aria-describedby={
                          formState.errors.phone
                            ? "phone-error"
                            : undefined
                        }
                        {...form.register("phone")}
                        className={`${fieldClassName} mt-2`}
                      />
                      {formState.errors.phone && (
                        <p
                          id="phone-error"
                          className="mt-1.5 text-xs text-red-700"
                        >
                          {formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="addressLine"
                        className="text-sm font-bold text-navy"
                      >
                        Delivery address{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <Input
                        id="addressLine"
                        autoComplete="street-address"
                        placeholder="House, road, building, or street"
                        aria-invalid={Boolean(
                          formState.errors.addressLine,
                        )}
                        aria-describedby={
                          formState.errors.addressLine
                            ? "addressLine-error"
                            : undefined
                        }
                        {...form.register("addressLine")}
                        className={`${fieldClassName} mt-2`}
                      />
                      {formState.errors.addressLine && (
                        <p
                          id="addressLine-error"
                          className="mt-1.5 text-xs text-red-700"
                        >
                          {formState.errors.addressLine.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="area"
                        className="text-sm font-bold text-navy"
                      >
                        Area <span className="text-red-600">*</span>
                      </label>
                      <Input
                        id="area"
                        autoComplete="address-level3"
                        placeholder="Your area"
                        aria-invalid={Boolean(formState.errors.area)}
                        aria-describedby={
                          formState.errors.area
                            ? "area-error"
                            : undefined
                        }
                        {...form.register("area")}
                        className={`${fieldClassName} mt-2`}
                      />
                      {formState.errors.area && (
                        <p
                          id="area-error"
                          className="mt-1.5 text-xs text-red-700"
                        >
                          {formState.errors.area.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="city"
                        className="text-sm font-bold text-navy"
                      >
                        City <span className="text-red-600">*</span>
                      </label>
                      <Input
                        id="city"
                        autoComplete="address-level2"
                        placeholder="Your city"
                        aria-invalid={Boolean(formState.errors.city)}
                        aria-describedby={
                          formState.errors.city
                            ? "city-error"
                            : undefined
                        }
                        {...form.register("city")}
                        className={`${fieldClassName} mt-2`}
                      />
                      {formState.errors.city && (
                        <p
                          id="city-error"
                          className="mt-1.5 text-xs text-red-700"
                        >
                          {formState.errors.city.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="district"
                        className="text-sm font-bold text-navy"
                      >
                        District{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <Input
                        id="district"
                        autoComplete="address-level1"
                        placeholder="Your district"
                        aria-invalid={Boolean(
                          formState.errors.district,
                        )}
                        aria-describedby={
                          formState.errors.district
                            ? "district-error"
                            : undefined
                        }
                        {...form.register("district")}
                        className={`${fieldClassName} mt-2`}
                      />
                      {formState.errors.district && (
                        <p
                          id="district-error"
                          className="mt-1.5 text-xs text-red-700"
                        >
                          {formState.errors.district.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="postalCode"
                        className="text-sm font-bold text-navy"
                      >
                        Postal code{" "}
                        <span className="font-normal text-ink/55">
                          (optional)
                        </span>
                      </label>
                      <Input
                        id="postalCode"
                        autoComplete="postal-code"
                        placeholder="Postal code"
                        aria-invalid={Boolean(
                          formState.errors.postalCode,
                        )}
                        aria-describedby={
                          formState.errors.postalCode
                            ? "postalCode-error"
                            : undefined
                        }
                        {...form.register("postalCode")}
                        className={`${fieldClassName} mt-2`}
                      />
                      {formState.errors.postalCode && (
                        <p
                          id="postalCode-error"
                          className="mt-1.5 text-xs text-red-700"
                        >
                          {formState.errors.postalCode.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="deliveryZone"
                        className="text-sm font-bold text-navy"
                      >
                        Delivery zone{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <Controller
                        control={control}
                        name="deliveryZone"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isSubmitting || sessionPending}
                          >
                            <SelectTrigger
                              id="deliveryZone"
                              aria-invalid={Boolean(
                                formState.errors.deliveryZone,
                              )}
                              aria-describedby={
                                formState.errors.deliveryZone
                                  ? "deliveryZone-error"
                                  : undefined
                              }
                              className={`${fieldClassName} mt-2 w-full`}
                            >
                              <SelectValue placeholder="Select delivery zone">
                                {field.value === "dhaka"
                                  ? "Inside Dhaka"
                                  : field.value === "outside_dhaka"
                                    ? "Outside Dhaka"
                                    : "Select delivery zone"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dhaka">
                                Inside Dhaka
                              </SelectItem>
                              <SelectItem value="outside_dhaka">
                                Outside Dhaka
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <p className="mt-1.5 text-xs leading-5 text-ink/55">
                        The delivery fee and final total are confirmed
                        by the server when the order is placed.
                      </p>
                      {formState.errors.deliveryZone && (
                        <p
                          id="deliveryZone-error"
                          className="mt-1.5 text-xs text-red-700"
                        >
                          {formState.errors.deliveryZone.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="customerNote"
                        className="text-sm font-bold text-navy"
                      >
                        Note for delivery{" "}
                        <span className="font-normal text-ink/55">
                          (optional)
                        </span>
                      </label>
                      <Textarea
                        id="customerNote"
                        rows={3}
                        maxLength={1000}
                        placeholder="Any directions that will help us deliver your order"
                        aria-invalid={Boolean(
                          formState.errors.customerNote,
                        )}
                        aria-describedby={
                          formState.errors.customerNote
                            ? "customerNote-error"
                            : undefined
                        }
                        {...form.register("customerNote")}
                        className="mt-2 min-h-24 resize-y rounded-xl border-line bg-white text-sm text-navy shadow-none placeholder:text-ink/40 focus-visible:border-blue focus-visible:ring-2 focus-visible:ring-blue/15"
                      />
                      {formState.errors.customerNote && (
                        <p
                          id="customerNote-error"
                          className="mt-1.5 text-xs text-red-700"
                        >
                          {formState.errors.customerNote.message}
                        </p>
                      )}
                    </div>
                  </div>
                </fieldset>

                {requestError && (
                  <p
                    className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800"
                    role="alert"
                  >
                    {requestError}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    sessionPending ||
                    !session?.user ||
                    items.length === 0
                  }
                  className="mt-7 min-h-12 w-full rounded-full bg-blue px-5 text-sm font-bold text-white transition-colors hover:bg-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:cursor-not-allowed disabled:bg-ink/35"
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                        aria-hidden="true"
                      />
                      Placing order…
                    </>
                  ) : (
                    <>
                      Place order
                      <ArrowRight size={16} aria-hidden="true" />
                    </>
                  )}
                </Button>

                <p className="mt-3 flex items-center justify-center gap-2 text-xs text-ink/55">
                  <ShieldCheck size={15} aria-hidden="true" />
                  Cash on delivery · Prices and stock verified at
                  order time
                </p>
              </form>

              <aside className="rounded-2xl border border-line bg-white p-6 shadow-[0_10px_30px_rgba(0,51,78,0.06)] lg:sticky lg:top-28">
                <h2 className="text-lg font-extrabold text-navy">
                  Order summary
                </h2>

                <ul className="mt-4 divide-y divide-line">
                  {items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex justify-between gap-4 py-3 text-sm"
                    >
                      <span className="min-w-0 text-ink/75">
                        {item.name}{" "}
                        <span className="whitespace-nowrap text-ink/50">
                          × {item.quantity}
                        </span>
                      </span>
                      <span className="shrink-0 font-semibold tabular-nums text-navy">
                        {money(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-2 flex justify-between border-t border-line pt-4 text-sm">
                  <span className="text-ink/65">
                    Estimated subtotal
                  </span>
                  <span className="font-bold tabular-nums text-navy">
                    {money(subtotal)}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-ink/65">Delivery</span>
                  <span className="text-right text-xs leading-5 text-ink/60">
                    Confirmed after order placement
                  </span>
                </div>

                <div className="mt-3 flex justify-between border-t border-line pt-4">
                  <span className="text-sm font-bold text-navy">
                    Final total
                  </span>
                  <span className="max-w-[170px] text-right text-xs leading-5 text-ink/60">
                    Shown using server-confirmed prices and delivery
                  </span>
                </div>

                <p className="mt-4 rounded-xl bg-mist p-3 text-xs leading-5 text-ink/65">
                  Displayed prices are estimates from the cart. The
                  backend verifies current stock and prices before
                  accepting your order.
                </p>
              </aside>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
