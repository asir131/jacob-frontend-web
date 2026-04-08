import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type ProfilePayload = Record<string, unknown>;

type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'client' | 'provider';
};

type VerifySignupOtpPayload = {
  email: string;
  otp: string;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ['Profile', 'Gigs', 'Categories'],
  endpoints: (builder) => ({
    getCategories: builder.query<ApiEnvelope<unknown[]>, void>({
      query: () => '/api/categories',
      providesTags: ['Categories'],
    }),
    getMyGigs: builder.query<ApiEnvelope<{ publishedGigs?: unknown[]; pendingRequests?: unknown[] }>, void>({
      query: () => '/api/gigs/mine',
      providesTags: ['Gigs'],
    }),
    createGig: builder.mutation<ApiEnvelope<unknown>, FormData>({
      query: (formData) => ({
        url: '/api/gigs',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Gigs'],
    }),
    updateGig: builder.mutation<ApiEnvelope<unknown>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/api/gigs/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Gigs'],
    }),
    deleteGig: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (id) => ({
        url: `/api/gigs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Gigs'],
    }),
    deleteGigRequest: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (id) => ({
        url: `/api/gigs/requests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Gigs'],
    }),
    updateProfile: builder.mutation<ApiEnvelope<{ user?: Record<string, unknown> }>, ProfilePayload>({
      query: (payload) => ({
        url: '/api/profile/me',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Profile'],
    }),
    uploadAvatar: builder.mutation<ApiEnvelope<{ avatarUrl?: string; user?: Record<string, unknown> }>, FormData>({
      query: (formData) => ({
        url: '/api/profile/avatar',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Profile'],
    }),
    changePassword: builder.mutation<ApiEnvelope<unknown>, ChangePasswordPayload>({
      query: (payload) => ({
        url: '/api/profile/change-password',
        method: 'POST',
        body: payload,
      }),
    }),
    login: builder.mutation<ApiEnvelope<unknown>, LoginPayload>({
      query: (payload) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: payload,
      }),
    }),
    signup: builder.mutation<ApiEnvelope<unknown>, SignupPayload>({
      query: (payload) => ({
        url: '/api/auth/signup',
        method: 'POST',
        body: payload,
      }),
    }),
    verifySignupOtp: builder.mutation<ApiEnvelope<unknown>, VerifySignupOtpPayload>({
      query: (payload) => ({
        url: '/api/auth/verify-signup-otp',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useLazyGetMyGigsQuery,
  useCreateGigMutation,
  useUpdateGigMutation,
  useDeleteGigMutation,
  useDeleteGigRequestMutation,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useChangePasswordMutation,
  useLoginMutation,
  useSignupMutation,
  useVerifySignupOtpMutation,
} = apiSlice;
