export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: ICategory[];
}

export interface ICategorySingleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ICategory;
}