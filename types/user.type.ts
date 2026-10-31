/** Allowlisted, JSON-serialized admin user data returned by the user search API. */
export interface AdminDashboardUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  imagePublicId?: string | null;
  phone?: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  role: string;
  banned: boolean;
  banReason: string | null;
  banExpires: string | null;
}

export interface AdminUsersResponse {
  users: AdminDashboardUser[];
  total: number;
}

