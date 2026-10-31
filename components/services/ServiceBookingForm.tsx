"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  HelpCircle,
  Loader2,
  MapPin,
  Ruler,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { trackConversion } from "@/lib/analytics/events";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { usePost } from "@/hooks/swr/usePost";
import type { CreateBookingRequest } from "@/lib/api/bookings";
import { authClient } from "@/lib/auth-client";
import type { IService } from "@/types/service.type";

const bookingSchema = z.object({
  location: z
    .string()
    .trim()
    .min(3, "Please enter the site/project location (at least 3 characters).")
    .max(300, "Location cannot exceed 300 characters."),
  areaSize: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || (!Number.isNaN(Number(val)) && Number(val) >= 0),
      "Area size must be a positive number.",
    ),
  areaUnit: z
    .string()
    .trim()
    .max(50, "Area unit cannot exceed 50 characters.")
    .optional(),
  isSiteVisit: z.boolean(),
  message: z
    .string()
    .trim()
    .max(2000, "Message cannot exceed 2000 characters.")
    .optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

type ServiceBookingFormProps = {
  service: IService;
};

const initialValues: BookingFormValues = {
  location: "",
  areaSize: "",
  areaUnit: "sqft",
  isSiteVisit: false,
  message: "",
};

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

  return "We couldn't submit your booking request. Please check your details and try again.";
}

const fieldClassName =
  "min-h-12 rounded-xl border-line bg-white text-sm text-navy shadow-none placeholder:text-ink/40 focus-visible:border-blue focus-visible:ring-2 focus-visible:ring-blue/15";

export default function ServiceBookingForm({ service }: ServiceBookingFormProps) {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const { mutate: postBooking, isLoading: isMutating } = usePost("/booking", {
    revalidateKey: "/booking/mine",
  });

  const [requestError, setRequestError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: initialValues,
    mode: "onTouched",
  });

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const onSubmit = async (values: BookingFormValues) => {
    if (isSubmitting || isMutating) return;

    if (!session?.user) {
      const message =
        "Please sign in with a verified account to book this service.";
      setRequestError(message);
      toast.error(message);
      return;
    }

    setIsSubmitting(true);
    setRequestError("");

    const areaSizeNum =
      values.areaSize && !Number.isNaN(Number(values.areaSize)) && Number(values.areaSize) > 0
        ? Number(values.areaSize)
        : undefined;

    const payload: CreateBookingRequest = {
      serviceId: service._id,
      project: {
        location: values.location.trim(),
        ...(areaSizeNum !== undefined ? { areaSize: areaSizeNum } : {}),
        ...(values.areaUnit?.trim() ? { areaUnit: values.areaUnit.trim() } : {}),
        ...(values.message?.trim() ? { message: values.message.trim() } : {}),
      },
      isSiteVisit: Boolean(values.isSiteVisit),
    };

    try {
      const response = await postBooking(payload);

      if (!response?.data?._id) {
        throw new Error("The booking confirmation response was incomplete.");
      }

      toast.success("Service booking request submitted successfully!");

      trackConversion("consultation_booking_submitted", {
        serviceId: service._id,
      });

      router.push(
        `/services/booking-success?bookingId=${encodeURIComponent(response.data._id)}`,
      );
    } catch (error: unknown) {
      const message = messageFromError(error);
      setRequestError(message);
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  const startingPrice =
    service.price != null && service.price > 0
      ? `BDT ${service.price.toLocaleString("en-BD")}`
      : "Quote on Assessment";

  return (
    <section className="bg-mist/45 py-14 max-[600px]:py-9">
      <Container>
        <div className="mx-auto max-w-[1180px]">
          {/* Back link */}
          <Link
            href={`/services/${service.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue transition-colors hover:text-deep"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to {service.name}
          </Link>

          {/* Heading */}
          <div className="mt-4">
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-blue">
              Service Reservation
            </p>

            <h1 className="text-[clamp(30px,4vw,44px)] font-extrabold leading-tight tracking-[-0.04em] text-navy">
              Book {service.name}
            </h1>

            <p className="mt-2 text-sm leading-6 text-ink/70">
              Provide your project location and requirements. Our engineering team
              will inspect and confirm your service schedule.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
            {/* LEFT: Booking Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="min-w-0 rounded-2xl border border-line bg-white p-7 shadow-[0_10px_30px_rgba(0,51,78,0.04)] max-[600px]:p-5"
            >
              <fieldset disabled={isSubmitting || sessionPending} className="min-w-0 space-y-6">
                {/* Error Banner */}
                {requestError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                  >
                    <p className="font-semibold">Unable to submit booking</p>
                    <p className="mt-1 text-xs text-red-700">{requestError}</p>
                  </div>
                )}

                {/* Account Details from Session */}
                <div className="rounded-xl border border-blue/15 bg-blue/[0.03] p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue">
                    <UserCheck size={16} aria-hidden="true" />
                    <span>Customer Information (From Active Session)</span>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
                    <div>
                      <p className="text-xs text-ink/60">Full Name</p>
                      <p className="font-semibold text-navy">
                        {session?.user?.name || "Loading..."}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-ink/60">Email Address</p>
                      <p className="font-semibold text-navy">
                        {session?.user?.email || "Loading..."}
                      </p>
                    </div>

                    {session?.user?.phone && (
                      <div>
                        <p className="text-xs text-ink/60">Contact Phone</p>
                        <p className="font-semibold text-navy">
                          {session.user.phone}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-ink/60">
                    Your booking reference and communication will be delivered to this verified account.
                  </p>
                </div>

                {/* Project Location */}
                <div>
                  <label
                    htmlFor="project-location"
                    className="block text-sm font-bold text-navy"
                  >
                    Project / Site Location <span className="text-red-600">*</span>
                  </label>
                  <p className="mt-0.5 text-xs text-ink/60">
                    Full address, building name, road, and area (e.g. House 14, Road 7, Banani, Dhaka)
                  </p>

                  <div className="relative mt-2">
                    <Input
                      id="project-location"
                      placeholder="e.g. Flat 4B, Plot 12, Gulshan-2, Dhaka"
                      aria-invalid={Boolean(errors.location)}
                      {...register("location")}
                      className={`${fieldClassName} pl-10`}
                    />
                    <MapPin
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
                      aria-hidden="true"
                    />
                  </div>

                  {errors.location && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                {/* Area Size & Area Unit */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="project-areaSize"
                      className="block text-sm font-bold text-navy"
                    >
                      Estimated Project Area <span className="text-xs font-normal text-ink/60">(Optional)</span>
                    </label>

                    <div className="relative mt-2">
                      <Input
                        id="project-areaSize"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="e.g. 1500"
                        aria-invalid={Boolean(errors.areaSize)}
                        {...register("areaSize")}
                        className={`${fieldClassName} pl-10`}
                      />
                      <Ruler
                        size={18}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
                        aria-hidden="true"
                      />
                    </div>

                    {errors.areaSize && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {errors.areaSize.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="project-areaUnit"
                      className="block text-sm font-bold text-navy"
                    >
                      Area Unit
                    </label>

                    <div className="mt-2">
                      <Controller
                        control={control}
                        name="areaUnit"
                        render={({ field }) => (
                          <Select
                            value={field.value ?? "sqft"}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className={fieldClassName}>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sqft">Square Feet (sqft)</SelectItem>
                              <SelectItem value="sqm">Square Meters (sqm)</SelectItem>
                              <SelectItem value="running-ft">Running Feet (rft)</SelectItem>
                              <SelectItem value="acres">Acres</SelectItem>
                              <SelectItem value="points">Points / Units</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    {errors.areaUnit && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {errors.areaUnit.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Site Visit Preference Switch */}
                <div className="rounded-xl border border-line bg-muted/20 p-4 transition-colors hover:bg-muted/30">
                  <Controller
                    control={control}
                    name="isSiteVisit"
                    render={({ field }) => (
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <label
                            htmlFor="site-visit-switch"
                            className="text-sm font-bold text-navy cursor-pointer"
                          >
                            Request On-Site Inspection Visit
                          </label>
                          <p className="text-xs leading-5 text-ink/65">
                            Check this if you would like our engineer to visit your premises first for diagnostic surface inspection and accurate quotation.
                          </p>
                        </div>

                        <Switch
                          id="site-visit-switch"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-1"
                        />
                      </div>
                    )}
                  />
                </div>

                {/* Project Message / Requirements */}
                <div>
                  <label
                    htmlFor="project-message"
                    className="block text-sm font-bold text-navy"
                  >
                    Project Scope & Description <span className="text-xs font-normal text-ink/60">(Optional)</span>
                  </label>
                  <p className="mt-0.5 text-xs text-ink/60">
                    Describe any specific issues, existing damage, leaks, or special timing constraints.
                  </p>

                  <Textarea
                    id="project-message"
                    rows={4}
                    placeholder="e.g. Rooftop parapet wall has visible water seepage. We need waterproofing before the rainy season begins."
                    {...register("message")}
                    className="mt-2 min-h-28 resize-none rounded-xl border-line text-sm text-navy placeholder:text-ink/40 focus-visible:border-blue focus-visible:ring-2 focus-visible:ring-blue/15"
                  />

                  {errors.message && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-13 w-full rounded-full bg-blue text-base font-bold text-white shadow-[0_8px_20px_rgba(1,110,220,0.25)] transition hover:bg-deep disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Submitting Booking Request...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        Confirm Service Booking
                        <ArrowRight size={18} aria-hidden="true" />
                      </span>
                    )}
                  </Button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-ink/60">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <span>No advance payment required. Final invoice issued upon project agreement.</span>
                  </div>
                </div>
              </fieldset>
            </form>

            {/* RIGHT: Service Preview Sticky Card */}
            <aside className="sticky top-24 space-y-6">
              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_10px_30px_rgba(0,51,78,0.04)]">
                {/* Service image */}
                <div className="relative h-48 w-full bg-mist/60">
                  {service.primaryImage?.url ? (
                    <Image
                      src={service.primaryImage.url}
                      alt={service.primaryImage.alt || service.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 420px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink/30">
                      No Image Available
                    </div>
                  )}

                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-navy/85 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
                      {service.isFeatured ? "Featured Solution" : "Enviroshield Service"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-extrabold tracking-tight text-navy">
                    {service.name}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-ink/70">
                    {service.description}
                  </p>

                  {/* Starting Price Box */}
                  <div className="mt-5 rounded-xl border border-blue/20 bg-blue/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue">
                        Base Starting Price
                      </span>
                      <span className="rounded-full bg-blue/10 px-2 py-0.5 text-[10px] font-bold text-blue">
                        Est. Cost
                      </span>
                    </div>

                    <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-navy">
                      {startingPrice}
                    </p>

                    <p className="mt-1 text-[11px] leading-tight text-ink/65">
                      Base reference price. Final quote is calculated based on site dimensions and material system required.
                    </p>
                  </div>

                  {/* Service Features / Key Benefits */}
                  {service.benefits?.items?.length ? (
                    <div className="mt-5 border-t border-line pt-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-navy">
                        Key Service Benefits
                      </p>

                      <ul className="mt-3 space-y-2.5">
                        {service.benefits.items.slice(0, 4).map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 text-xs text-ink/80"
                          >
                            <CheckCircle2
                              size={15}
                              className="mt-0.5 shrink-0 text-emerald-600"
                              aria-hidden="true"
                            />
                            <span>
                              <strong className="font-semibold text-navy">
                                {item.title}:
                              </strong>{" "}
                              {item.description}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Guarantees */}
                  <div className="mt-5 space-y-2.5 border-t border-line pt-5 text-xs text-ink/75">
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-blue" />
                      <span>Certified waterproofing & protection engineers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-blue" />
                      <span>Comprehensive warranty on completed works</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-blue" />
                      <span>Scheduled surface inspection & diagnosis</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need help card */}
              <div className="rounded-2xl border border-line bg-white p-5 text-xs text-ink/70">
                <div className="flex items-center gap-2 font-bold text-navy">
                  <HelpCircle size={16} className="text-blue" />
                  <span>Have questions before booking?</span>
                </div>
                <p className="mt-1 leading-5">
                  Speak directly with our technical advisors to discuss your project requirements or emergency leakage treatment.
                </p>
                <Link
                  href="/contact"
                  className="mt-3 inline-flex items-center gap-1 font-bold text-blue hover:underline"
                >
                  Contact Technical Support
                  <ArrowRight size={13} />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </section>
  );
}
