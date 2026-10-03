export interface IBlogContent {
  type: string;
  content?: IBlogContent[];
  text?: string;
}

export interface IBlogImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface IBlogSeo {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  noIndex: boolean;
}

export interface IBlog {
  _id: string;

  title: string;
  slug: string;
  excerpt: string;

  content: IBlogContent;

  coverImage?: IBlogImage;

  tags: string[];

  authorId: string;

  status: "published" | "draft";

  publishedAt?: string;

  seo?: IBlogSeo;

  createdAt: string;
  updatedAt: string;
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