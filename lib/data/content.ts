export type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  category: string;
};

export type Project = {
  title: string;
  category: string;
  image: string;
  description: string;
};

export type BlogPost = {
  title: string;
  slug: string;
  category: string;
  date: string;
  author: string;
  image: string;
  excerpt: string;
};

export const images = {
  hero: "https://images.pexels.com/photos/7546769/pexels-photo-7546769.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600",
  collage:
    "https://images.pexels.com/photos/7546771/pexels-photo-7546771.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  painter:
    "https://images.pexels.com/photos/6473966/pexels-photo-6473966.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
};

export const services: Service[] = [
  {
    id: "interior",
    title: "Interior Painting",
    slug: "interior-painting",
    category: "Residential",
    description:
      "Thoughtful color and an immaculate finish for every room you live in.",
    image:
      "https://images.pexels.com/photos/8135503/pexels-photo-8135503.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    id: "exterior",
    title: "Exterior Painting",
    slug: "exterior-painting",
    category: "Residential",
    description:
      "Durable, weather-ready finishes that make a lasting first impression.",
    image:
      "https://images.pexels.com/photos/6474305/pexels-photo-6474305.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    id: "wallpaper",
    title: "Wallpaper Installation",
    slug: "wallpaper-installation",
    category: "Design",
    description:
      "Seamless installation for statement walls, quiet texture, and everything between.",
    image:
      "https://images.pexels.com/photos/7546771/pexels-photo-7546771.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    id: "removal",
    title: "Wallpaper Removal",
    slug: "wallpaper-removal",
    category: "Preparation",
    description:
      "Careful removal and surface repair that leaves your walls ready for what is next.",
    image:
      "https://images.pexels.com/photos/9908376/pexels-photo-9908376.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    id: "decorative",
    title: "Decorative Finishes",
    slug: "decorative-finishes",
    category: "Design",
    description:
      "Hand-finished texture, depth, and character tailored to your interior.",
    image:
      "https://images.pexels.com/photos/6970061/pexels-photo-6970061.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    id: "commercial",
    title: "Commercial Painting",
    slug: "commercial-painting",
    category: "Commercial",
    description:
      "Reliable project delivery for welcoming, high-performing business spaces.",
    image:
      "https://images.pexels.com/photos/7174113/pexels-photo-7174113.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
];

export const projects: Project[] = [
  {
    title: "Quiet Luxury Living Room",
    category: "Interior Painting",
    image:
      "https://images.pexels.com/photos/8135503/pexels-photo-8135503.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    description:
      "A calm, tonal palette brought to life with a smooth eggshell finish.",
  },
  {
    title: "Textured Feature Wall",
    category: "Decorative Finish",
    image:
      "https://images.pexels.com/photos/6970061/pexels-photo-6970061.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    description:
      "Subtle texture adds depth without overwhelming the room.",
  },
  {
    title: "The Garden Hallway",
    category: "Wallpaper Installation",
    image:
      "https://images.pexels.com/photos/7546771/pexels-photo-7546771.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    description:
      "A botanical wallcovering creates a welcoming transition through the home.",
  },
  {
    title: "Bright Office Suite",
    category: "Commercial Painting",
    image:
      "https://images.pexels.com/photos/7174113/pexels-photo-7174113.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    description:
      "Fresh, durable finishes designed for focus and collaboration.",
  },
  {
    title: "Warm Modern Bedroom",
    category: "Interior Painting",
    image:
      "https://images.pexels.com/photos/7166934/pexels-photo-7166934.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    description:
      "Earthy neutrals turn a bedroom into a softer place to land.",
  },
  {
    title: "New Build Exterior",
    category: "Exterior Painting",
    image:
      "https://images.pexels.com/photos/17947890/pexels-photo-17947890.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    description:
      "A considered exterior palette gives the architecture a confident presence.",
  },
];

export const blogPosts: BlogPost[] = [
  {
    title: "How to Choose the Right Paint Color for Your Space",
    slug: "choose-the-right-paint-color",
    category: "Color",
    date: "May 16, 2026",
    author: "The Enviroshield team",
    image:
      "https://images.pexels.com/photos/16751235/pexels-photo-16751235.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    excerpt:
      "A simple guide to undertones, natural light, and choosing a color you will love living with.",
  },
  {
    title: "Wallpaper vs Paint: Which Is Right for Your Home?",
    slug: "wallpaper-vs-paint",
    category: "Design",
    date: "May 02, 2026",
    author: "The Enviroshield team",
    image:
      "https://images.pexels.com/photos/7546558/pexels-photo-7546558.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    excerpt:
      "Compare the character, care, and longevity of two beautiful ways to finish a wall.",
  },
  {
    title: "7 Wall Preparation Mistakes You Should Avoid",
    slug: "wall-preparation-mistakes",
    category: "Preparation",
    date: "April 18, 2026",
    author: "The Enviroshield team",
    image:
      "https://images.pexels.com/photos/6473966/pexels-photo-6473966.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    excerpt:
      "The best finishes begin long before the first coat. Here is what makes the difference.",
  },
];

export const testimonials = [
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

export const processSteps = [
  {
    number: "01",
    title: "Consultation & Vision Planning",
    description:
      "Understanding your goals, style preferences, and space before we begin.",
    icon: "Compass",
  },
  {
    number: "02",
    title: "Detailed Quote & Timeline",
    description:
      "A clear estimate, project timeline, and detailed plan with no surprises.",
    icon: "ClipboardCheck",
  },
  {
    number: "03",
    title: "Surface Preparation",
    description:
      "We repair, clean, prime, and prepare every surface for a beautiful finish.",
    icon: "Paintbrush",
  },
  {
    number: "04",
    title: "Application & Walkthrough",
    description:
      "Precise application followed by a thorough final inspection together.",
    icon: "Sparkles",
  },
];

export const products = [
  {
    name: "Calm Interior Matt",
    category: "Interior Paint",
    description:
      "A soft, low-sheen finish for calm, considered rooms.",
    features: ["Washable finish", "Low odour", "Colour matched"],
    image:
      "https://images.pexels.com/photos/9222200/pexels-photo-9222200.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    slug: "calm-interior-matt",
  },
  {
    name: "Shield Exterior Satin",
    category: "Exterior Paint",
    description:
      "Durable protection with a refined, resilient finish.",
    features: [
      "Weather resistant",
      "Fade resistant",
      "Flexible film",
    ],
    image:
      "https://images.pexels.com/photos/5799051/pexels-photo-5799051.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    slug: "shield-exterior-satin",
  },
  {
    name: "Prime & Prepare",
    category: "Primers",
    description:
      "A dependable foundation for smooth, consistent coverage.",
    features: ["Stain blocking", "Strong adhesion", "Quick recoat"],
    image:
      "https://images.pexels.com/photos/3616762/pexels-photo-3616762.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    slug: "prime-and-prepare",
  },
  {
    name: "Linen Weave Wallcovering",
    category: "Wallpaper",
    description:
      "Tactile woven texture for rooms with quiet character.",
    features: ["Easy clean", "Lightfast", "Breathable"],
    image:
      "https://images.pexels.com/photos/7546769/pexels-photo-7546769.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    slug: "linen-weave-wallcovering",
  },
  {
    name: "Mineral Texture Finish",
    category: "Decorative Finishes",
    description:
      "Layered mineral texture that catches light beautifully.",
    features: [
      "Hand-finished",
      "Custom tintable",
      "Natural movement",
    ],
    image:
      "https://images.pexels.com/photos/16751235/pexels-photo-16751235.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    slug: "mineral-texture-finish",
  },
  {
    name: "Surface Repair Compound",
    category: "Surface Preparation",
    description:
      "Fine, workable repair for a more seamless final result.",
    features: ["Easy to sand", "Low shrink", "Interior use"],
    image:
      "https://images.pexels.com/photos/6473966/pexels-photo-6473966.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    slug: "surface-repair-compound",
  },
];
