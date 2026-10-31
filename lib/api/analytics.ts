import { axiosInstance } from "@/lib/axios";
import {
  AdminBookingsData,
  AdminOrdersData,
  AdminOverviewData,
  AdminProductsData,
  AdminSalesData,
  AnalyticsPeriod,
  UserActivityData,
  UserOverviewData,
} from "@/types/analytics.type";

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export const analyticsApi = {
  getAdminOverview: async (
    period: AnalyticsPeriod = "30d",
  ): Promise<AdminOverviewData> => {
    const res = await axiosInstance.get<ApiResponse<AdminOverviewData>>(
      "/analytics/admin/overview",
      { params: { period } },
    );
    return res.data.data;
  },

  getAdminSales: async (
    period: AnalyticsPeriod = "30d",
  ): Promise<AdminSalesData> => {
    const res = await axiosInstance.get<ApiResponse<AdminSalesData>>(
      "/analytics/admin/sales",
      { params: { period } },
    );
    return res.data.data;
  },

  getAdminOrders: async (
    period: AnalyticsPeriod = "30d",
  ): Promise<AdminOrdersData> => {
    const res = await axiosInstance.get<ApiResponse<AdminOrdersData>>(
      "/analytics/admin/orders",
      { params: { period } },
    );
    return res.data.data;
  },

  getAdminBookings: async (
    period: AnalyticsPeriod = "30d",
  ): Promise<AdminBookingsData> => {
    const res = await axiosInstance.get<ApiResponse<AdminBookingsData>>(
      "/analytics/admin/bookings",
      { params: { period } },
    );
    return res.data.data;
  },

  getAdminProducts: async (
    period: AnalyticsPeriod = "30d",
  ): Promise<AdminProductsData> => {
    const res = await axiosInstance.get<ApiResponse<AdminProductsData>>(
      "/analytics/admin/products",
      { params: { period } },
    );
    return res.data.data;
  },

  getUserOverview: async (
    period: AnalyticsPeriod = "30d",
  ): Promise<UserOverviewData> => {
    const res = await axiosInstance.get<ApiResponse<UserOverviewData>>(
      "/analytics/user/overview",
      { params: { period } },
    );
    return res.data.data;
  },

  getUserActivity: async (
    period: AnalyticsPeriod = "30d",
  ): Promise<UserActivityData> => {
    const res = await axiosInstance.get<ApiResponse<UserActivityData>>(
      "/analytics/user/activity",
      { params: { period } },
    );
    return res.data.data;
  },
};

