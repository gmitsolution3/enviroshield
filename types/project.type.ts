import type { IService } from "./service.type";

export type TProjectStatus = "draft" | "published";

export interface IProjectImage {
  url: string;
  publicId: string;
  alt: string;
  caption?: string;
}

export interface IProjectLocation {
  city: string;
  area?: string;
  country: string;
}

export interface IProjectGalleryItem {
  url: string;
  publicId: string;
  alt: string;
  caption?: string;
}

export interface IProjectClientLogo {
  url: string;
  publicId: string;
  alt: string;
}

export interface IProjectClient {
  name: string;
  description?: string;
  logo?: IProjectClientLogo;
}

export interface IProject {
  _id: string;
  title: string;
  slug: string;
  primaryImage: IProjectImage;
  description: string;
  location: IProjectLocation;
  completionDate: string;
  gallery: IProjectGalleryItem[];
  client: IProjectClient;
  serviceId: IService;
  status: TProjectStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface IProjectResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: IProject[];
}

export interface IProjectSingleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IProject;
}

