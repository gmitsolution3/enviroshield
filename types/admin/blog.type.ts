export interface IBlogImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface IBlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface IBlogAuthor {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface IBlog {
  _id: string;

  title: string;
  slug: string;
  excerpt: string;

  content: Record<string, unknown>;

  coverImage: IBlogImage;

  tags: string[];

  authorId: string;

  status: "draft" | "published";

  publishedAt?: string | null;

  seo?: IBlogSeo;

  createdAt: string;
  updatedAt: string;

  author?: IBlogAuthor | null;
}

export interface IBlogResponse {
  success: boolean;
  statusCode: number;
  message: string;

  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  data: IBlog[];
}

export interface IBlogSingleResponse {
  success: boolean;
  statusCode: number;
  message: string;

  data: IBlog;
}
