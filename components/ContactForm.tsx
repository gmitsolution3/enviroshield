"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePost } from "@/hooks/swr/usePost";
import { EASE, viewportOnce } from "./animations/variants";
import { useState } from "react";

const projectTypeOptions = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
  { value: "warehouse", label: "Warehouse" },
  { value: "factory", label: "Factory" },
  { value: "hospital", label: "Hospital" },
  { value: "school", label: "School" },
  { value: "hotel", label: "Hotel" },
  { value: "office", label: "Office" },
  { value: "shopping-mall", label: "Shopping Mall" },
  { value: "sports-facility", label: "Sports Facility" },
  { value: "other", label: "Other" },
] as const;

const projectTimelineOptions = [
  { value: "immediate", label: "Immediate" },
  { value: "within-1-month", label: "Within 1 Month" },
  { value: "1-3-months", label: "1–3 Months" },
  { value: "3-6-months", label: "3–6 Months" },
  { value: "6-plus-months", label: "6+ Months" },
  { value: "not-decided", label: "Not Decided" },
] as const;

const areaUnitOptions = [
  { value: "sqft", label: "Square Feet" },
  { value: "sqm", label: "Square Meter" },
] as const;

const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required.")
    .max(100, "Full name is too long."),

  phoneNumber: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(30, "Phone number is too long."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  companyName: z
    .string()
    .trim()
    .max(150, "Company name is too long.")
    .optional()
    .or(z.literal("")),

  jobTitle: z
    .string()
    .trim()
    .max(100, "Job title is too long.")
    .optional()
    .or(z.literal("")),

  projectName: z
    .string()
    .trim()
    .max(150, "Project name is too long.")
    .optional()
    .or(z.literal("")),

  projectType: z.enum([
    "residential",
    "commercial",
    "industrial",
    "warehouse",
    "factory",
    "hospital",
    "school",
    "hotel",
    "office",
    "shopping-mall",
    "sports-facility",
    "other",
  ]),

  city: z
    .string()
    .trim()
    .min(1, "City is required.")
    .max(100, "City name is too long."),

  country: z
    .string()
    .trim()
    .min(1, "Country is required.")
    .max(100, "Country name is too long."),

  projectAreaSize: z
    .number({
      message: "Project area is required.",
    })
    .positive("Project area must be greater than 0.")
    .finite("Please enter a valid project area."),

  projectAreaUnit: z.enum(["sqft", "sqm"]),

  siteVisitRequired: z.boolean(),

  projectTimeline: z.enum([
    "immediate",
    "within-1-month",
    "1-3-months",
    "3-6-months",
    "6-plus-months",
    "not-decided",
  ]),

  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little about your project.")
    .max(2000, "Message is too long."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const inputClassName =
  "h-[48px] w-full rounded-[9px] border-[#e0e5ea] bg-[#fafbfd] px-[14px] text-[13px] font-normal text-ink outline-none transition-[border,box-shadow] duration-200 placeholder:text-[#9ca9b1] focus:border-blue focus:shadow-[0_0_0_3px_rgba(1,110,220,0.1)]";

const selectTriggerClassName =
  "h-[48px] w-full rounded-[9px] border-[#e0e5ea] bg-[#fafbfd] px-[14px] text-[13px] font-normal text-ink outline-none transition-[border,box-shadow] duration-200 focus:border-blue focus:shadow-[0_0_0_3px_rgba(1,110,220,0.1)]";

export function ContactForm() {
  const reduce = useReducedMotion();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      companyName: "",
      jobTitle: "",
      projectName: "",
      projectType: "commercial",
      city: "",
      country: "",
      projectAreaSize: undefined,
      projectAreaUnit: "sqft",
      siteVisitRequired: false,
      projectTimeline: "not-decided",
      message: "",
    },
  });

  const { mutate: postContact, isLoading } = usePost("/contact");

  const [sent, setSent] = useState(false);

  const projectType = watch("projectType");
  const projectAreaUnit = watch("projectAreaUnit");
  const projectTimeline = watch("projectTimeline");
  const siteVisitRequired = watch("siteVisitRequired");

  async function onSubmit(values: ContactFormValues) {
    try {
      const payload = {
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        companyName: values.companyName || "",
        jobTitle: values.jobTitle || "",
        projectName: values.projectName || "",
        projectType: values.projectType,
        projectLocation: {
          city: values.city,
          country: values.country,
        },
        projectAreaSize: values.projectAreaSize,
        projectAreaUnit: values.projectAreaUnit,
        siteVisitRequired: values.siteVisitRequired,
        projectTimeline: values.projectTimeline,
        message: values.message,
      };

      const response = await postContact(payload);

      if (response?.success) {
        toast.success(
          response.message ||
            "Your message has been sent successfully.",
        );

        setSent(true);
        reset();
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to send your message. Please try again.";

      toast.error(message);

      console.error("Failed to submit contact form:", error);
    }
  }

  if (sent) {
    return (
      <motion.div
        className="px-5 py-[65px] text-center"
        initial={reduce ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          ease: EASE,
        }}
        role="status"
        aria-live="polite"
      >
        <motion.div
          className="mx-auto mb-[18px] grid size-[54px] place-items-center rounded-full bg-[#e8f8ef] text-[#1c9b5b]"
          initial={
            reduce
              ? false
              : {
                  scale: 0,
                  rotate: -180,
                }
          }
          animate={{
            scale: 1,
            rotate: 0,
          }}
          transition={{
            duration: 0.5,
            ease: EASE,
            delay: 0.1,
          }}
          aria-hidden="true"
        >
          <Check />
        </motion.div>

        <h3 className="mb-[10px] text-[24px] text-navy">
          Thank you for reaching out.
        </h3>

        <p className="mx-auto mb-[22px] max-w-[330px] text-[14px] leading-[1.6] text-ink">
          Your message is with our team. We will be in touch shortly
          to talk through your space.
        </p>

        <button
          type="button"
          className="inline-flex items-center gap-[7px] text-[13px] font-extrabold text-navy transition-[gap,color] duration-200 hover:gap-[11px] hover:text-blue"
          onClick={() => setSent(false)}
          aria-label="Send another message"
        >
          Send another message
          <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      className="grid gap-[17px]"
      onSubmit={handleSubmit(onSubmit)}
      initial={reduce ? false : { opacity: 0, scale: 0.97 }}
      whileInView={{
        opacity: 1,
        scale: 1,
      }}
      viewport={viewportOnce}
      transition={{
        duration: 0.5,
        ease: EASE,
      }}
      aria-label="Contact Enviroshield"
      aria-busy={isLoading}
      noValidate
    >
      {/* Customer information */}
      <div className="grid grid-cols-2 gap-[15px] max-[600px]:grid-cols-1">
        <div className="grid gap-2">
          <Label
            htmlFor="contact-full-name"
            className="text-[12px] font-bold text-navy"
          >
            Full name *
          </Label>

          <Input
            id="contact-full-name"
            autoComplete="name"
            placeholder="Your full name"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={
              errors.fullName ? "contact-full-name-error" : undefined
            }
            {...register("fullName")}
            className={inputClassName}
          />

          {errors.fullName && (
            <p
              id="contact-full-name-error"
              role="alert"
              className="text-[12px] text-destructive"
            >
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor="contact-phone"
            className="text-[12px] font-bold text-navy"
          >
            Phone number *
          </Label>

          <Input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+880 1700 000000"
            aria-invalid={Boolean(errors.phoneNumber)}
            aria-describedby={
              errors.phoneNumber ? "contact-phone-error" : undefined
            }
            {...register("phoneNumber")}
            className={inputClassName}
          />

          {errors.phoneNumber && (
            <p
              id="contact-phone-error"
              role="alert"
              className="text-[12px] text-destructive"
            >
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[15px] max-[600px]:grid-cols-1">
        <div className="grid gap-2">
          <Label
            htmlFor="contact-email"
            className="text-[12px] font-bold text-navy"
          >
            Email address *
          </Label>

          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email ? "contact-email-error" : undefined
            }
            {...register("email")}
            className={inputClassName}
          />

          {errors.email && (
            <p
              id="contact-email-error"
              role="alert"
              className="text-[12px] text-destructive"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor="contact-company"
            className="text-[12px] font-bold text-navy"
          >
            Company name
          </Label>

          <Input
            id="contact-company"
            autoComplete="organization"
            placeholder="Your company"
            aria-invalid={Boolean(errors.companyName)}
            aria-describedby={
              errors.companyName ? "contact-company-error" : undefined
            }
            {...register("companyName")}
            className={inputClassName}
          />

          {errors.companyName && (
            <p
              id="contact-company-error"
              role="alert"
              className="text-[12px] text-destructive"
            >
              {errors.companyName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[15px] max-[600px]:grid-cols-1">
        <div className="grid gap-2">
          <Label
            htmlFor="contact-job-title"
            className="text-[12px] font-bold text-navy"
          >
            Job title
          </Label>

          <Input
            id="contact-job-title"
            autoComplete="organization-title"
            placeholder="Your job title"
            aria-invalid={Boolean(errors.jobTitle)}
            aria-describedby={
              errors.jobTitle ? "contact-job-title-error" : undefined
            }
            {...register("jobTitle")}
            className={inputClassName}
          />

          {errors.jobTitle && (
            <p
              id="contact-job-title-error"
              role="alert"
              className="text-[12px] text-destructive"
            >
              {errors.jobTitle.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor="contact-project-name"
            className="text-[12px] font-bold text-navy"
          >
            Project name
          </Label>

          <Input
            id="contact-project-name"
            placeholder="Your project name"
            aria-invalid={Boolean(errors.projectName)}
            aria-describedby={
              errors.projectName
                ? "contact-project-name-error"
                : undefined
            }
            {...register("projectName")}
            className={inputClassName}
          />

          {errors.projectName && (
            <p
              id="contact-project-name-error"
              role="alert"
              className="text-[12px] text-destructive"
            >
              {errors.projectName.message}
            </p>
          )}
        </div>
      </div>

      {/* Project type */}
      <div className="grid gap-2">
        <Label
          htmlFor="contact-project-type"
          className="text-[12px] font-bold text-navy"
        >
          Project type *
        </Label>

        <Select
          value={projectType}
          onValueChange={(value) =>
            setValue(
              "projectType",
              value as ContactFormValues["projectType"],
              {
                shouldDirty: true,
                shouldValidate: true,
              },
            )
          }
        >
          <SelectTrigger
            id="contact-project-type"
            aria-invalid={Boolean(errors.projectType)}
            className={selectTriggerClassName}
          >
            <SelectValue placeholder="Select project type" />
          </SelectTrigger>

          <SelectContent>
            {projectTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.projectType && (
          <p role="alert" className="text-[12px] text-destructive">
            {errors.projectType.message}
          </p>
        )}
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-[15px] max-[600px]:grid-cols-1">
        <div className="grid gap-2">
          <Label
            htmlFor="contact-city"
            className="text-[12px] font-bold text-navy"
          >
            City *
          </Label>

          <Input
            id="contact-city"
            autoComplete="address-level2"
            placeholder="Dhaka"
            aria-invalid={Boolean(errors.city)}
            aria-describedby={
              errors.city ? "contact-city-error" : undefined
            }
            {...register("city")}
            className={inputClassName}
          />

          {errors.city && (
            <p
              id="contact-city-error"
              role="alert"
              className="text-[12px] text-destructive"
            >
              {errors.city.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor="contact-country"
            className="text-[12px] font-bold text-navy"
          >
            Country *
          </Label>

          <Input
            id="contact-country"
            autoComplete="country-name"
            placeholder="Bangladesh"
            aria-invalid={Boolean(errors.country)}
            aria-describedby={
              errors.country ? "contact-country-error" : undefined
            }
            {...register("country")}
            className={inputClassName}
          />

          {errors.country && (
            <p
              id="contact-country-error"
              role="alert"
              className="text-[12px] text-destructive"
            >
              {errors.country.message}
            </p>
          )}
        </div>
      </div>

      {/* Project area */}
      <div className="grid grid-cols-2 gap-[15px] max-[600px]:grid-cols-1">
        <div className="grid gap-2">
          <Label
            htmlFor="contact-area"
            className="text-[12px] font-bold text-navy"
          >
            Project area size *
          </Label>

          <Input
            id="contact-area"
            type="number"
            min="0"
            step="any"
            placeholder="5000"
            aria-invalid={Boolean(errors.projectAreaSize)}
            aria-describedby={
              errors.projectAreaSize
                ? "contact-area-error"
                : undefined
            }
            {...register("projectAreaSize", {
              valueAsNumber: true,
            })}
            className={inputClassName}
          />

          {errors.projectAreaSize && (
            <p
              id="contact-area-error"
              role="alert"
              className="text-[12px] text-destructive"
            >
              {errors.projectAreaSize.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor="contact-area-unit"
            className="text-[12px] font-bold text-navy"
          >
            Area unit *
          </Label>

          <Select
            value={projectAreaUnit}
            onValueChange={(value) =>
              setValue(
                "projectAreaUnit",
                value as ContactFormValues["projectAreaUnit"],
                {
                  shouldDirty: true,
                  shouldValidate: true,
                },
              )
            }
          >
            <SelectTrigger
              id="contact-area-unit"
              aria-invalid={Boolean(errors.projectAreaUnit)}
              className={selectTriggerClassName}
            >
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {areaUnitOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.projectAreaUnit && (
            <p role="alert" className="text-[12px] text-destructive">
              {errors.projectAreaUnit.message}
            </p>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="grid gap-2">
        <Label
          htmlFor="contact-timeline"
          className="text-[12px] font-bold text-navy"
        >
          Project timeline *
        </Label>

        <Select
          value={projectTimeline}
          onValueChange={(value) =>
            setValue(
              "projectTimeline",
              value as ContactFormValues["projectTimeline"],
              {
                shouldDirty: true,
                shouldValidate: true,
              },
            )
          }
        >
          <SelectTrigger
            id="contact-timeline"
            aria-invalid={Boolean(errors.projectTimeline)}
            className={selectTriggerClassName}
          >
            <SelectValue placeholder="Select project timeline" />
          </SelectTrigger>

          <SelectContent>
            {projectTimelineOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.projectTimeline && (
          <p role="alert" className="text-[12px] text-destructive">
            {errors.projectTimeline.message}
          </p>
        )}
      </div>

      {/* Site visit */}
      <div className="flex items-center gap-3 rounded-[9px] border border-[#e0e5ea] bg-[#fafbfd] px-[14px] py-3">
        <Checkbox
          id="contact-site-visit"
          checked={siteVisitRequired}
          onCheckedChange={(checked) =>
            setValue("siteVisitRequired", checked === true, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />

        <Label
          htmlFor="contact-site-visit"
          className="cursor-pointer text-[12px] font-bold text-navy"
        >
          I would like to request a site visit
        </Label>
      </div>

      {/* Message */}
      <div className="grid gap-2">
        <Label
          htmlFor="contact-message"
          className="text-[12px] font-bold text-navy"
        >
          Tell us about your project *
        </Label>

        <Textarea
          id="contact-message"
          rows={5}
          placeholder="A little about your project..."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          {...register("message")}
          className="min-h-[130px] resize-y rounded-[9px] border-[#e0e5ea] bg-[#fafbfd] px-[14px] py-[13px] text-[13px] font-normal text-ink outline-none transition-[border,box-shadow] duration-200 placeholder:text-[#9ca9b1] focus:border-blue focus:shadow-[0_0_0_3px_rgba(1,110,220,0.1)]"
        />

        {errors.message && (
          <p
            id="contact-message-error"
            role="alert"
            className="text-[12px] text-destructive"
          >
            {errors.message.message}
          </p>
        )}
      </div>

      <motion.button
        className="flex min-h-[48px] items-center justify-center gap-2 !rounded-4xl !bg-blue text-[13px] font-extrabold text-white transition-colors duration-200 !hover:bg-[#005cb9] disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        disabled={isLoading}
        whileHover={reduce ? undefined : { y: -2 }}
        whileTap={reduce ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.2 }}
        aria-label={isLoading ? "Sending message" : "Send message"}
      >
        {isLoading ? (
          <>
            <Loader2
              size={17}
              className="animate-spin"
              aria-hidden="true"
            />
            Sending…
          </>
        ) : (
          <>
            Send message
            <ArrowUpRight size={17} aria-hidden="true" />
          </>
        )}
      </motion.button>
    </motion.form>
  );
}
