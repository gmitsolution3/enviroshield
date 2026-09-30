export interface IServiceImage {
  url: string;
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

export interface IServiceProjectLocation {
  city: string;
  area: string;
  country: string;
}

export interface IServiceProjectClientLogo {
  url: string;
  alt: string;
}

export interface IServiceProjectClient {
  name: string;
  description: string;
  logo: IServiceProjectClientLogo;
}

export interface IServiceProjectSeo {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  noIndex: boolean;
}

export interface IServiceProjectGalleryItem {
  url: string;
  alt: string;
}

export interface IServiceProject {
  _id: string;
  title: string;
  slug: string;
  primaryImage: IServiceImage;
  description: string;
  location: IServiceProjectLocation;
  completionDate: string;
  gallery: IServiceProjectGalleryItem[];
  client: IServiceProjectClient;
  serviceId: string;
  status: string;
  isFeatured: boolean;
  seo: IServiceProjectSeo;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface IServiceSeo {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
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

  projects: IServiceProject[];

  status: string;
  publishedAt?: string;

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
