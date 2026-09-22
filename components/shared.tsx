"use client";

import {
  EASE,
  fadeUp,
  scaleIn,
  viewportOnce,
} from "@/components/animations/variants";
import type { BlogPost, Project, Service } from "@/lib/data/content";
import { images } from "@/lib/data/content";
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/* ===== Logo ===== */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`logo ${light ? "logo-light" : ""}`}>
      <span className="logo-mark">
        <ShieldCheck size={19} strokeWidth={2.4} />
      </span>
      <span>
        Enviro<span>shield</span>
      </span>
    </Link>
  );
}

/* ===== Button with micro-interaction ===== */
export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "light" | "outline";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const inner = (
    <motion.span
      className={`button button-${variant} ${className} !rounded-4xl`}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      {children}
      <ArrowUpRight size={16} className="button-arrow" />
    </motion.span>
  );
  return href ? (
    <Link href={href}>{inner}</Link>
  ) : (
    <button type="button">{inner}</button>
  );
}

/* ===== SectionHeader with scroll reveal ===== */
export function SectionHeader({
  eyebrow,
  title,
  text,
  align = "left",
  light = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`section-header ${align === "center" ? "section-header-center" : ""} ${light ? "section-header-light" : ""}`}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <div className="eyebrow">
        <span />
        {eyebrow}
      </div>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </motion.div>
  );
}

/* ===== Reveal wrapper (kept for backward compat) ===== */
export function Reveal({
  children,
  className = "",
  dir = "up",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  dir?: "up" | "left" | "right" | "scale" | "image";
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const variant =
    dir === "left"
      ? {
          hidden: { opacity: 0, x: -30 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: EASE },
          },
        }
      : dir === "right"
        ? {
            hidden: { opacity: 0, x: 30 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.6, ease: EASE },
            },
          }
        : dir === "scale"
          ? scaleIn
          : dir === "image"
            ? {
                hidden: { opacity: 0, scale: 1.08 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.8, ease: EASE },
                },
              }
            : fadeUp;
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={variant}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/* ===== Scroll Progress Bar ===== */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });
  if (reduce) return null;
  return (
    <motion.div className="scroll-progress" style={{ scaleX }} />
  );
}

/* ===== Header ===== */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const links: [string, string][] = [
    ["About Us", "/about"],
    ["Services", "/services"],
    ["Products", "/products"],
    ["Blog", "/blog"],
    ["Contact Us", "/contact"],
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <ScrollProgress />
      <div className="utility">
        <div className="container utility-inner">
          <span>
            <MapPin size={14} /> Serving homes and businesses with
            care
          </span>
          <span className="utility-right">
            <a href="mailto:hello@enviroshield.com">
              <Mail size={14} /> hello@enviroshield.com
            </a>
            <a href="tel:+11234567890">
              <Phone size={14} /> +1 123 456 7890
            </a>
          </span>
        </div>
      </div>
      <motion.header
        className="site-header"
        animate={{
          boxShadow: scrolled
            ? "0px 8px 30px rgba(0,51,78,0.08)"
            : "0px 0px 0px rgba(0,51,78,0)",
          borderColor: scrolled
            ? "rgba(223,229,233,1)"
            : "rgba(223,229,233,0)",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="container header-inner">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Logo />
          </motion.div>
          <nav className="desktop-nav">
            {links.map(([label, href], i) => (
              <motion.div
                key={href}
                initial={reduce ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.05 * (i + 1),
                  ease: EASE,
                }}
                className="nav-link-wrap"
              >
                <Link href={href} className="nav-link">
                  {label}
                  <span className="nav-underline" />
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35, ease: EASE }}
            >
              <Button href="/contact">Talk to an Expert</Button>
            </motion.div>
          </nav>
          <button
            className="menu-button"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="mobile-menu-top">
                <Logo />
                <button
                  className="menu-button"
                  aria-label="Close navigation"
                  onClick={() => setOpen(false)}
                >
                  <X />
                </button>
              </div>
              <motion.nav
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      delayChildren: 0.15,
                      staggerChildren: 0.06,
                    },
                  },
                }}
              >
                {[["Home", "/"], ...links].map(([label, href]) => (
                  <motion.div
                    key={href}
                    variants={{
                      hidden: { opacity: 0, x: 30 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.4, ease: EASE },
                      },
                    }}
                  >
                    <Link href={href} onClick={() => setOpen(false)}>
                      {label}
                      <ArrowUpRight size={17} />
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
              >
                <Button href="/contact">Talk to an Expert</Button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ===== Footer ===== */
export function Footer() {
  const reduce = useReducedMotion();
  const cols = [
    {
      title: "Explore",
      links: [
        ["About us", "/about"],
        ["Our services", "/services"],
        ["Products", "/products"],
        ["Journal", "/blog"],
      ],
    },
  ];
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <Logo light />
          <p>
            Thoughtful painting and wall finishing for spaces that
            feel beautifully yours.
          </p>
          <div className="socials">
            {["ig", "in", "f"].map((s) => (
              <motion.span
                key={s}
                whileHover={
                  reduce ? undefined : { scale: 1.08, y: -2 }
                }
                transition={{ duration: 0.2 }}
              >
                {s}
              </motion.span>
            ))}
          </div>
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          transition={{ delay: 0.1 }}
        >
          <h4>Explore</h4>
          <Link href="/about">About us</Link>
          <Link href="/services">Our services</Link>
          <Link href="/products">Products</Link>
          <Link href="/blog">Journal</Link>
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          transition={{ delay: 0.2 }}
        >
          <h4>Opening hours</h4>
          <p>
            Monday – Friday
            <br />
            <strong>8:00 AM – 6:00 PM</strong>
          </p>
          <p>
            Saturday
            <br />
            <strong>9:00 AM – 2:00 PM</strong>
          </p>
          <p>
            Sunday
            <br />
            <strong>Closed</strong>
          </p>
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          transition={{ delay: 0.3 }}
        >
          <h4>Get in touch</h4>
          <a href="tel:+11234567890">+1 123 456 7890</a>
          <a href="mailto:hello@enviroshield.com">
            hello@enviroshield.com
          </a>
          <p>
            45 Bridge Street
            <br />
            Brooklyn, NY 11201
          </p>
        </motion.div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Enviroshield. All rights reserved.</span>
        <span>Crafted for better spaces.</span>
      </div>
    </footer>
  );
}

/* ===== PageHero ===== */
export function PageHero({
  eyebrow,
  title,
  text,
  image = images.hero,
}: {
  eyebrow: string;
  title: string;
  text: string;
  image?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <section className="page-hero">
      <motion.div
        className="page-hero-bg"
        initial={reduce ? undefined : { scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Image
          src={image}
          alt="Beautifully finished interior"
          fill
          priority
          sizes="100vw"
        />
      </motion.div>
      <motion.div
        className="page-hero-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <div className="container page-hero-content">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
        >
          <div className="eyebrow eyebrow-light">
            <span />
            {eyebrow}
          </div>
        </motion.div>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.2 }}
        >
          {title}
        </motion.h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.35 }}
        >
          {text}
        </motion.p>
      </div>
    </section>
  );
}

/* ===== ServiceCard ===== */
export function ServiceCard({
  service,
  index = 0,
}: {
  service: Service;
  index?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      className="service-card"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay: index * 0.1 }}
      whileHover={reduce ? undefined : { y: -6 }}
    >
      <div className="card-image">
        <motion.div
          className="card-image-inner"
          whileHover={reduce ? undefined : { scale: 1.04 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 90vw, 33vw"
          />
        </motion.div>
        <motion.span
          className="card-icon"
          whileHover={reduce ? undefined : { scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <PaintIcon />
        </motion.span>
      </div>
      <div className="card-body">
        <span className="card-kicker">{service.category}</span>
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        <Link
          href={`/services/${service.slug}`}
          className="text-link"
        >
          Learn more <ArrowUpRight size={16} />
        </Link>
      </div>
    </motion.article>
  );
}

function PaintIcon() {
  return (
    <span className="paint-icon">
      <span />
    </span>
  );
}

/* ===== ProjectCard ===== */
export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      className={`project-card project-${index + 1}`}
      variants={{
        hidden: { opacity: 0, scale: 1.05 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.6,
            ease: EASE,
            delay: index * 0.08,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <motion.div
        className="project-image-inner"
        whileHover={reduce ? undefined : { scale: 1.06 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </motion.div>
      <motion.div
        className="project-overlay"
        initial={false}
        whileHover={reduce ? undefined : { opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span>{project.category}</span>
        <motion.h3
          initial={reduce ? false : { y: 10, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {project.title}
        </motion.h3>
        <motion.div
          className="project-arrow"
          initial={reduce ? false : { x: -5, opacity: 0 }}
          whileHover={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowUpRight />
        </motion.div>
      </motion.div>
    </motion.article>
  );
}

/* ===== BlogCard ===== */
export function BlogCard({
  post,
  index = 0,
}: {
  post: BlogPost;
  index?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      className="blog-card"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay: index * 0.1 }}
      whileHover={
        reduce ? undefined : { y: -5, transition: { duration: 0.3 } }
      }
    >
      <div className="blog-image">
        <motion.div
          className="blog-image-inner"
          whileHover={reduce ? undefined : { scale: 1.04 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ position: "absolute", inset: 0 }}
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </motion.div>
      </div>
      <div className="blog-meta">
        <span>{post.category}</span>
        <span>{post.date}</span>
      </div>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <Link href={`/blog/${post.slug}`} className="text-link">
        Read article <ArrowUpRight size={16} />
      </Link>
    </motion.article>
  );
}

/* ===== TestimonialCarousel ===== */
export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const reduce = useReducedMotion();

  const items = [
    {
      quote:
        "Enviroshield completely transformed our living room. The finish was flawless and the team was incredibly professional.",
      name: "Maya R.",
      role: "Homeowner, North London",
    },
    {
      quote:
        "From preparation to final cleanup, everything was handled with care. The result exceeded our expectations.",
      name: "Daniel K.",
      role: "Property manager",
    },
    {
      quote:
        "We needed a bold feature wall for our studio and Enviroshield delivered exactly what we envisioned.",
      name: "Aisha T.",
      role: "Studio founder",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % items.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const current = items[index];

  const go = (dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + items.length) % items.length);
  };

  return (
    <div className="testimonial-wrap">
      <div className="testimonial-card">
        <div className="quote-mark">&ldquo;</div>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.span
                  key={star}
                  initial={
                    reduce ? false : { opacity: 0, scale: 0.8 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: star * 0.04, duration: 0.3 }}
                >
                  <Star size={17} fill="currentColor" />
                </motion.span>
              ))}
            </div>
            <blockquote>{current.quote}</blockquote>
            <motion.div
              className="testimonial-person"
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <div className="avatar">{current.name[0]}</div>
              <div>
                <strong>{current.name}</strong>
                <span>{current.role}</span>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="carousel-controls">
        <motion.button
          aria-label="Previous testimonial"
          onClick={() => go(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft />
        </motion.button>
        <span>
          0{index + 1} <i>/</i> 0{items.length}
        </span>
        <motion.button
          aria-label="Next testimonial"
          onClick={() => go(1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight />
        </motion.button>
      </div>
    </div>
  );
}

/* ===== ContactForm ===== */
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

/* ===== ContactSection ===== */
export function ContactSection({ full = false }: { full?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <section
      className={`contact-section ${full ? "contact-full" : ""}`}
      id="contact"
    >
      <div className="container contact-grid">
        <div className="contact-copy">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <div className="eyebrow eyebrow-light">
              <span />
              CONTACT US
            </div>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ delay: 0.05 }}
          >
            Let&rsquo;s create something beautiful together.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ delay: 0.1 }}
          >
            Have a room in mind? Tell us a little about it and
            we&rsquo;ll help you find the right finish, feel, and way
            forward.
          </motion.p>
          <motion.div
            className="contact-details"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.15,
                },
              },
            }}
          >
            {[
              {
                icon: <Clock3 />,
                b: "Working hours",
                t: "Monday – Friday, 8:00 AM – 6:00 PM",
              },
              {
                icon: <MapPin />,
                b: "Visit us",
                t: "45 Bridge Street, Brooklyn, NY",
              },
              { icon: <Phone />, b: "Call us", t: "+1 123 456 7890" },
              {
                icon: <Mail />,
                b: "Email us",
                t: "hello@enviroshield.com",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: EASE },
                  },
                }}
              >
                {item.icon}
                <span>
                  <b>{item.b}</b>
                  {item.t}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <div className="contact-card">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
