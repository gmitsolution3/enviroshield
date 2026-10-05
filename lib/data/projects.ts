import type { IProject } from "@/types";

export const projects: IProject[] = [
  {
    _id: "project-001",
    title: "Dhaka Corporate Office Waterproofing",
    slug: "dhaka-corporate-office-waterproofing",
    primaryImage: {
      url: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "Modern corporate office building completed by Enviroshield",
      caption: "Corporate office waterproofing and protective coating project",
    },
    description:
      "A complete waterproofing and protective coating solution delivered for a modern corporate facility in Dhaka, designed to improve long-term surface protection and durability.",
    location: {
      city: "Dhaka",
      area: "Gulshan",
      country: "Bangladesh",
    },
    completionDate: "2026-05-15T00:00:00.000Z",
    gallery: [
      {
        url: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Corporate office exterior",
      },
      {
        url: "https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting-room-modern-classic-37347.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Modern commercial interior",
      },
      {
        url: "https://images.pexels.com/photos/416320/pexels-photo-416320.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Commercial building detail",
      },
    ],
    client: {
      name: "ABC Holdings Ltd.",
      description:
        "A leading corporate organization operating from a modern commercial facility in Dhaka.",
      logo: {
        url: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400",
        alt: "ABC Holdings Ltd. client logo",
      },
    },
    serviceId: {
      _id: "service-waterproofing",
      name: "Waterproofing Solution",
      slug: "waterproofing-solution",
      isFeatured: true,
      primaryImage: {
        url: "https://images.pexels.com/photos/6473966/pexels-photo-6473966.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Waterproofing application",
      },
      detailHeading: "Professional waterproofing solutions",
      description:
        "Durable waterproofing systems designed to protect buildings and structures from moisture and water damage.",
      whyEnviroshield: {
        image: {
          url: "https://images.pexels.com/photos/6473966/pexels-photo-6473966.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Waterproofing work",
        },
        items: [],
      },
      process: {
        image: {
          url: "https://images.pexels.com/photos/6473966/pexels-photo-6473966.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Waterproofing process",
        },
        items: [],
      },
      benefits: {
        image: {
          url: "https://images.pexels.com/photos/6473966/pexels-photo-6473966.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Waterproofing benefits",
        },
        items: [],
      },
      projects: [],
      status: "published",
      seo: {
        metaTitle:
          "Waterproofing Solution | Enviroshield",
        metaDescription:
          "Professional waterproofing solutions from Enviroshield.",
        keywords: ["waterproofing", "waterproofing solution"],
        canonicalUrl:
          "https://enviroshieldbd.com/services/waterproofing-solution",
        ogTitle:
          "Waterproofing Solution | Enviroshield",
        ogDescription:
          "Professional waterproofing solutions from Enviroshield.",
        ogImage:
          "https://images.pexels.com/photos/6473966/pexels-photo-6473966.jpeg?auto=compress&cs=tinysrgb&w=1200",
        noIndex: false,
      },
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-05-01T00:00:00.000Z",
    },
    status: "published",
    isFeatured: true,
    seo: {
      metaTitle:
        "Dhaka Corporate Office Waterproofing Project | Enviroshield",
      metaDescription:
        "Explore Enviroshield's corporate office waterproofing project in Gulshan, Dhaka.",
      keywords: [
        "waterproofing project Dhaka",
        "corporate waterproofing",
        "Gulshan waterproofing",
        "Enviroshield projects",
      ],
      ogTitle:
        "Dhaka Corporate Office Waterproofing | Enviroshield",
      ogDescription:
        "A professional waterproofing and protective coating project completed in Gulshan, Dhaka.",
      ogImage:
        "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600",
      noIndex: false,
    },
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-05-15T00:00:00.000Z",
    __v: 0,
  },

  {
    _id: "project-002",
    title: "Premium Residential Epoxy Flooring",
    slug: "premium-residential-epoxy-flooring",
    primaryImage: {
      url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "Premium residential interior with polished flooring",
      caption: "Residential epoxy flooring project",
    },
    description:
      "A contemporary flooring project combining durability, clean aesthetics, and a seamless finish for a premium residential property.",
    location: {
      city: "Dhaka",
      area: "Banani",
      country: "Bangladesh",
    },
    completionDate: "2026-04-20T00:00:00.000Z",
    gallery: [
      {
        url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Residential flooring",
      },
      {
        url: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Modern residential interior",
      },
    ],
    client: {
      name: "Private Residential Client",
      description:
        "A private residential property requiring a durable and visually refined flooring system.",
      logo: {
        url: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400",
        alt: "Residential client",
      },
    },
    serviceId: {
      _id: "service-epoxy-flooring",
      name: "Epoxy Flooring",
      slug: "epoxy-flooring",
      isFeatured: false,
      primaryImage: {
        url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Epoxy flooring",
      },
      detailHeading: "Professional epoxy flooring",
      description:
        "Seamless and durable epoxy flooring solutions for demanding environments.",
      whyEnviroshield: {
        image: {
          url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Epoxy flooring",
        },
        items: [],
      },
      process: {
        image: {
          url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Epoxy flooring process",
        },
        items: [],
      },
      benefits: {
        image: {
          url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Epoxy flooring benefits",
        },
        items: [],
      },
      projects: [],
      status: "published",
      seo: {
        metaTitle: "Epoxy Flooring | Enviroshield",
        metaDescription:
          "Professional epoxy flooring solutions from Enviroshield.",
        keywords: ["epoxy flooring"],
        canonicalUrl:
          "https://enviroshieldbd.com/services/epoxy-flooring",
        ogTitle: "Epoxy Flooring | Enviroshield",
        ogDescription:
          "Professional epoxy flooring solutions from Enviroshield.",
        ogImage:
          "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
        noIndex: false,
      },
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-04-01T00:00:00.000Z",
    },
    status: "published",
    isFeatured: false,
    seo: {
      metaTitle:
        "Premium Residential Epoxy Flooring Project | Enviroshield",
      metaDescription:
        "See how Enviroshield delivered a premium epoxy flooring solution for a residential property in Banani, Dhaka.",
      keywords: [
        "epoxy flooring project",
        "residential epoxy flooring",
        "epoxy flooring Dhaka",
      ],
      ogTitle:
        "Premium Residential Epoxy Flooring | Enviroshield",
      ogDescription:
        "A premium residential epoxy flooring project completed by Enviroshield.",
      ogImage:
        "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600",
      noIndex: false,
    },
    createdAt: "2026-01-15T00:00:00.000Z",
    updatedAt: "2026-04-20T00:00:00.000Z",
    __v: 0,
  },

  {
    _id: "project-003",
    title: "Industrial Floor Protection",
    slug: "industrial-floor-protection",
    primaryImage: {
      url: "https://images.pexels.com/photos/4481323/pexels-photo-4481323.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "Industrial facility floor protection project",
      caption: "Industrial protective flooring project",
    },
    description:
      "A heavy-duty flooring and surface protection project developed for an industrial environment where durability and easy maintenance were essential.",
    location: {
      city: "Chattogram",
      area: "Patenga",
      country: "Bangladesh",
    },
    completionDate: "2026-03-12T00:00:00.000Z",
    gallery: [
      {
        url: "https://images.pexels.com/photos/4481323/pexels-photo-4481323.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Industrial flooring",
      },
      {
        url: "https://images.pexels.com/photos/386236/pexels-photo-386236.jpeg?auto=compress&cs=tinysrgb&w=1600",
        alt: "Industrial facility",
      },
    ],
    client: {
      name: "Industrial Manufacturing Ltd.",
      description:
        "An industrial manufacturing facility requiring a resilient floor protection system.",
      logo: {
        url: "https://images.pexels.com/photos/386236/pexels-photo-386236.jpeg?auto=compress&cs=tinysrgb&w=400",
        alt: "Industrial client",
      },
    },
    serviceId: {
      _id: "service-floor-hardener",
      name: "Floor Hardener",
      slug: "floor-hardener",
      isFeatured: false,
      primaryImage: {
        url: "https://images.pexels.com/photos/4481323/pexels-photo-4481323.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Industrial floor hardener",
      },
      detailHeading: "Industrial floor hardening",
      description:
        "Durable floor hardening solutions for industrial and commercial environments.",
      whyEnviroshield: {
        image: {
          url: "https://images.pexels.com/photos/4481323/pexels-photo-4481323.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Industrial flooring",
        },
        items: [],
      },
      process: {
        image: {
          url: "https://images.pexels.com/photos/4481323/pexels-photo-4481323.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Floor hardener application",
        },
        items: [],
      },
      benefits: {
        image: {
          url: "https://images.pexels.com/photos/4481323/pexels-photo-4481323.jpeg?auto=compress&cs=tinysrgb&w=1200",
          alt: "Floor protection",
        },
        items: [],
      },
      projects: [],
      status: "published",
      seo: {
        metaTitle: "Floor Hardener | Enviroshield",
        metaDescription:
          "Industrial floor hardening solutions from Enviroshield.",
        keywords: ["floor hardener", "industrial flooring"],
        canonicalUrl:
          "https://enviroshieldbd.com/services/floor-hardener",
        ogTitle: "Floor Hardener | Enviroshield",
        ogDescription:
          "Industrial floor hardening solutions from Enviroshield.",
        ogImage:
          "https://images.pexels.com/photos/4481323/pexels-photo-4481323.jpeg?auto=compress&cs=tinysrgb&w=1200",
        noIndex: false,
      },
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-03-01T00:00:00.000Z",
    },
    status: "published",
    isFeatured: false,
    seo: {
      metaTitle:
        "Industrial Floor Protection Project | Enviroshield",
      metaDescription:
        "Explore Enviroshield's industrial floor protection project in Patenga, Chattogram.",
      keywords: [
        "industrial flooring",
        "floor hardener project",
        "industrial floor protection",
      ],
      ogTitle:
        "Industrial Floor Protection | Enviroshield",
      ogDescription:
        "Heavy-duty industrial floor protection completed by Enviroshield.",
      ogImage:
        "https://images.pexels.com/photos/4481323/pexels-photo-4481323.jpeg?auto=compress&cs=tinysrgb&w=1600",
      noIndex: false,
    },
    createdAt: "2026-02-01T00:00:00.000Z",
    updatedAt: "2026-03-12T00:00:00.000Z",
    __v: 0,
  },
];