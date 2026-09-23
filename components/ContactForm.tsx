"use client";

import { Check, ArrowUpRight } from "lucide-react";
import { useReducedMotion, motion } from "motion/react";
import { useState } from "react";
import { EASE, viewportOnce } from "./animations/variants";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const reduce = useReducedMotion();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 650);
  }

  if (sent)
    return (
      <motion.div
        className="form-success"
        initial={reduce ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <motion.div
          className="success-mark"
          initial={reduce ? false : { scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
        >
          <Check />
        </motion.div>
        <h3>Thank you for reaching out.</h3>
        <p>
          Your message is with our team. We will be in touch shortly
          to talk through your space.
        </p>
        <button className="text-link" onClick={() => setSent(false)}>
          Send another message <ArrowUpRight size={16} />
        </button>
      </motion.div>
    );

  return (
    <motion.form
      className="contact-form"
      onSubmit={submit}
      initial={reduce ? false : { opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={viewportOnce}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="form-row">
        <label>
          First name *
          <input
            required
            name="firstName"
            placeholder="Your first name"
          />
        </label>
        <label>
          Last name *
          <input
            required
            name="lastName"
            placeholder="Your last name"
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Phone number *
          <input
            required
            type="tel"
            name="phone"
            placeholder="+1 123 456 7890"
          />
        </label>
        <label>
          Email address *
          <input
            required
            type="email"
            name="email"
            placeholder="you@email.com"
          />
        </label>
      </div>
      <label>
        Service type *
        <select required name="service" defaultValue="">
          <option value="" disabled>
            Select a service
          </option>
          <option>Interior Painting</option>
          <option>Exterior Painting</option>
          <option>Wallpaper Installation</option>
          <option>Decorative Finishes</option>
          <option>Commercial Painting</option>
          <option>Other</option>
        </select>
      </label>
      <label>
        Tell us about your space *
        <textarea
          required
          name="message"
          placeholder="A little about your project..."
          rows={5}
        />
      </label>
      <motion.button
        className="form-submit"
        type="submit"
        disabled={loading}
        whileHover={reduce ? undefined : { y: -2 }}
        whileTap={reduce ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {loading ? "Sending…" : "Send message"}
        <ArrowUpRight size={17} />
      </motion.button>
    </motion.form>
  );
}
