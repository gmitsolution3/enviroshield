export interface ITestimonialImage {
  url: string;
  alt: string;
}

export interface ITestimonial {
  _id: string;
  clientName: string;
  clientImage?: ITestimonialImage;
  rating: number;
  content: string;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ITestimonialResponse {
  success: boolean;
  statusCode: number;
  message: string;

  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  data: ITestimonial[];
}