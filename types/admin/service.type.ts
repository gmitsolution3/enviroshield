import type { IProject } from "./project.type";

export interface IServiceImage {
  url: string;
  publicId: string;
  alt: string;
  caption?: string;
}

export interface IServiceContentItem {
  title: string;
  description: string;
}

export interface IServiceContentSection {
  image: IServiceImage;
  items: IServiceContentItem[];
}

export interface IServiceSeo {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImagePublicId: string;
  noIndex: boolean;
}

export interface IService {
  _id: string;
  name: string;
  slug: string;
  isFeatured: boolean;

  primaryImage: IServiceImage;

  detailHeading: string;
  description: string;

  whyEnviroshield: IServiceContentSection;
  process: IServiceContentSection;
  benefits: IServiceContentSection;

  projects: IProject[];

  status: "published" | "draft";
  publishedAt?: string | null;

  seo?: IServiceSeo;

  createdAt: string;
  updatedAt: string;
}

export interface IServiceResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: IService[];
}

export interface IServiceSingleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IService;
}