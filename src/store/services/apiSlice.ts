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

type CreateOrderPayload = {
  gigId: string;
  packageName: string;
  packageTitle: string;
  packagePrice: number;
  scheduledDate: string;
  scheduledTime: string;
  serviceAddress: string;
  specialInstructions?: string;
};

type ProviderOrdersQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

type ClientOrdersQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
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
  tagTypes: ['Profile', 'Gigs', 'Categories', 'Orders', 'Chats'],
  endpoints: (builder) => ({
    getCategories: builder.query<ApiEnvelope<unknown[]>, void>({
      query: () => '/api/categories',
      providesTags: ['Categories'],
    }),
    getMyGigs: builder.query<ApiEnvelope<{ publishedGigs?: unknown[]; pendingRequests?: unknown[] }>, void>({
      query: () => '/api/gigs/mine',
      providesTags: ['Gigs'],
    }),
    getPublicServices: builder.query<
      ApiEnvelope<{
        items?: unknown[];
        pagination?: {
          page: number;
          limit: number;
          totalItems: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      }>,
      {
        page?: number;
        limit?: number;
        radiusKm?: number;
        categorySlug?: string;
        search?: string;
        lat?: number | null;
        lng?: number | null;
      }
    >({
      query: ({ page = 1, limit = 9, radiusKm = 25, categorySlug = 'all', search = '', lat = null, lng = null }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        params.set('radiusKm', String(radiusKm));
        params.set('categorySlug', categorySlug || 'all');
        if (search.trim()) params.set('search', search.trim());
        if (typeof lat === 'number') params.set('lat', String(lat));
        if (typeof lng === 'number') params.set('lng', String(lng));
        return `/api/gigs/public?${params.toString()}`;
      },
    }),
    getPublicServiceById: builder.query<ApiEnvelope<unknown>, string>({
      query: (id) => `/api/gigs/public/${id}`,
    }),
    createOrder: builder.mutation<ApiEnvelope<{ order?: Record<string, unknown> }>, CreateOrderPayload>({
      query: (payload) => ({
        url: '/api/orders',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Orders'],
    }),
    getProviderOrders: builder.query<
      ApiEnvelope<{
        items?: Record<string, unknown>[];
        pagination?: {
          page: number;
          limit: number;
          totalItems: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      }>,
      ProviderOrdersQuery
    >({
      query: ({ page = 1, limit = 8, search = '', status = 'all' }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        params.set('status', status || 'all');
        if (search.trim()) params.set('search', search.trim());
        return `/api/orders/provider?${params.toString()}`;
      },
      providesTags: ['Orders'],
    }),
    getClientOrders: builder.query<
      ApiEnvelope<{
        items?: Record<string, unknown>[];
        pagination?: {
          page: number;
          limit: number;
          totalItems: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      }>,
      ClientOrdersQuery
    >({
      query: ({ page = 1, limit = 8, search = '', status = 'all' }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        params.set('status', status || 'all');
        if (search.trim()) params.set('search', search.trim());
        return `/api/orders/client?${params.toString()}`;
      },
      providesTags: ['Orders'],
    }),
    getClientOrderDetail: builder.query<ApiEnvelope<{ order?: Record<string, unknown> }>, string>({
      query: (id) => `/api/orders/client/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Orders', id }],
    }),
    getProviderOrderDetail: builder.query<ApiEnvelope<{ order?: Record<string, unknown> }>, string>({
      query: (id) => `/api/orders/provider/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Orders', id }],
    }),
    acceptProviderOrder: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (id) => ({
        url: `/api/orders/provider/${id}/accept`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Orders'],
    }),
    declineProviderOrder: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (id) => ({
        url: `/api/orders/provider/${id}/decline`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Orders'],
    }),
    submitProviderDelivery: builder.mutation<ApiEnvelope<unknown>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/api/orders/provider/${id}/deliver`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Orders'],
    }),
    finalizeClientOrder: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (id) => ({
        url: `/api/orders/client/${id}/finalize`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Orders'],
    }),
    getConversations: builder.query<ApiEnvelope<Record<string, unknown>[]>, void>({
      query: () => '/api/chats/conversations',
      providesTags: ['Chats'],
    }),
    ensureConversationByOrder: builder.mutation<ApiEnvelope<Record<string, unknown>>, string>({
      query: (orderId) => ({
        url: `/api/chats/conversations/order/${orderId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Chats'],
    }),
    getConversationMessages: builder.query<
      ApiEnvelope<{
        items?: Record<string, unknown>[];
        pagination?: {
          page: number;
          limit: number;
          totalItems: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      }>,
      { conversationId: string; page?: number; limit?: number }
    >({
      query: ({ conversationId, page = 1, limit = 100 }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        return `/api/chats/conversations/${conversationId}/messages?${params.toString()}`;
      },
      providesTags: (_result, _error, arg) => [{ type: 'Chats', id: arg.conversationId }],
    }),
    sendConversationMessage: builder.mutation<
      ApiEnvelope<Record<string, unknown>>,
      { conversationId: string; text: string }
    >({
      query: ({ conversationId, text }) => ({
        url: `/api/chats/conversations/${conversationId}/messages`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Chats', id: arg.conversationId }, 'Chats'],
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
    submitProviderPayoutInfo: builder.mutation<ApiEnvelope<{ user?: Record<string, unknown> }>, FormData>({
      query: (formData) => ({
        url: '/api/profile/provider/payout-info',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Profile'],
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
  useGetPublicServicesQuery,
  useGetPublicServiceByIdQuery,
  useCreateOrderMutation,
  useGetProviderOrdersQuery,
  useGetClientOrdersQuery,
  useGetClientOrderDetailQuery,
  useGetProviderOrderDetailQuery,
  useAcceptProviderOrderMutation,
  useDeclineProviderOrderMutation,
  useSubmitProviderDeliveryMutation,
  useFinalizeClientOrderMutation,
  useGetConversationsQuery,
  useEnsureConversationByOrderMutation,
  useGetConversationMessagesQuery,
  useSendConversationMessageMutation,
  useCreateGigMutation,
  useUpdateGigMutation,
  useDeleteGigMutation,
  useDeleteGigRequestMutation,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useChangePasswordMutation,
  useSubmitProviderPayoutInfoMutation,
  useLoginMutation,
  useSignupMutation,
  useVerifySignupOtpMutation,
} = apiSlice;
