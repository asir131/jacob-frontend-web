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

type ServiceRequestPayload = {
  categorySlug: string;
  categoryName: string;
  serviceAddress: string;
  description: string;
  preferredDate?: string;
  preferredTime: string;
  budget: number;
};

type ServiceRequestQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  radiusKm?: number;
};

type ProviderOrdersQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

type WithdrawalRequestPayload = {
  amount: number;
  note?: string;
};

type ClientOrdersQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

type ProviderDashboardResponse = {
  revenue?: {
    totalEarnings?: number;
    walletBalance?: number;
    totalWithdrawn?: number;
  };
  orders?: {
    totalOrders?: number;
    pendingOrders?: number;
    activeOrders?: number;
    completedOrders?: number;
    completionRate?: number;
  };
  ratings?: {
    averageRating?: number;
    reviewCount?: number;
  };
  earningsAnalytics?: Array<{
    name?: string;
    earnings?: number;
  }>;
  pendingRequests?: Array<Record<string, unknown>>;
};

type ClientDashboardResponse = {
  orders?: {
    totalOrders?: number;
    activeOrders?: number;
    pendingOrders?: number;
    inProgressOrders?: number;
    underReviewOrders?: number;
    completedOrders?: number;
    completionRate?: number;
  };
  inbox?: {
    unreadMessages?: number;
  };
  recentOrders?: Array<Record<string, unknown>>;
};

type ServiceRequestPagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
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
  tagTypes: ['Profile', 'Gigs', 'Categories', 'Orders', 'Chats', 'ServiceRequests'],
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
    createServiceRequest: builder.mutation<ApiEnvelope<{ request?: Record<string, unknown> }>, FormData>({
      query: (formData) => ({
        url: '/api/service-requests',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['ServiceRequests', 'Orders'],
    }),
    getClientServiceRequests: builder.query<
      ApiEnvelope<{
        items?: Record<string, unknown>[];
        pagination?: ServiceRequestPagination;
      }>,
      ServiceRequestQuery
    >({
      query: ({ page = 1, limit = 6, search = '', status = 'all' }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        params.set('status', status || 'all');
        if (search.trim()) params.set('search', search.trim());
        return `/api/service-requests/client?${params.toString()}`;
      },
      providesTags: ['ServiceRequests'],
    }),
    getProviderServiceRequests: builder.query<
      ApiEnvelope<{
        items?: Record<string, unknown>[];
        pagination?: ServiceRequestPagination;
      }>,
      ServiceRequestQuery
    >({
      query: ({ page = 1, limit = 6, search = '', radiusKm = 30 }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        params.set('radiusKm', String(radiusKm));
        if (search.trim()) params.set('search', search.trim());
        return `/api/service-requests/provider?${params.toString()}`;
      },
      providesTags: ['ServiceRequests'],
    }),
    acceptServiceRequest: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (id) => ({
        url: `/api/service-requests/provider/${id}/accept`,
        method: 'PATCH',
      }),
      invalidatesTags: ['ServiceRequests', 'Orders'],
    }),
    ignoreServiceRequest: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (id) => ({
        url: `/api/service-requests/provider/${id}/ignore`,
        method: 'PATCH',
      }),
      invalidatesTags: ['ServiceRequests'],
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
    getProviderDashboard: builder.query<ApiEnvelope<ProviderDashboardResponse>, void>({
      query: () => '/api/orders/provider/dashboard',
      providesTags: ['Orders', 'Profile'],
    }),
    getClientDashboard: builder.query<ApiEnvelope<ClientDashboardResponse>, void>({
      query: () => '/api/orders/client/dashboard',
      providesTags: ['Orders', 'Chats', 'Profile'],
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
    respondProviderRevision: builder.mutation<
      ApiEnvelope<unknown>,
      { id: string; action: 'accept' | 'decline'; note?: string }
    >({
      query: ({ id, action, note = '' }) => ({
        url: `/api/orders/provider/${id}/revision-response`,
        method: 'PATCH',
        body: { action, note },
      }),
      invalidatesTags: ['Orders'],
    }),
    requestClientRevision: builder.mutation<ApiEnvelope<unknown>, { id: string; note: string }>({
      query: ({ id, note }) => ({
        url: `/api/orders/client/${id}/request-revision`,
        method: 'PATCH',
        body: { note },
      }),
      invalidatesTags: ['Orders'],
    }),
    cancelClientRevision: builder.mutation<ApiEnvelope<unknown>, string>({
      query: (id) => ({
        url: `/api/orders/client/${id}/cancel-revision`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Orders'],
    }),
    sendClientResolutionMessage: builder.mutation<ApiEnvelope<{ conversationId?: string }>, { id: string; text?: string }>({
      query: ({ id, text = '' }) => ({
        url: `/api/orders/client/${id}/resolution-message`,
        method: 'POST',
        body: { text },
      }),
    }),
    createClientCheckoutSession: builder.mutation<
      ApiEnvelope<{ checkoutUrl?: string; sessionId?: string }>,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/api/orders/client/${id}/stripe-checkout`,
        method: 'POST',
      }),
      invalidatesTags: ['Orders'],
    }),
    confirmClientCheckoutPayment: builder.mutation<
      ApiEnvelope<{ order?: Record<string, unknown>; providerEarningsAmount?: number; platformFeeAmount?: number }>,
      { id: string; sessionId: string; clientRating?: number; clientReview?: string }
    >({
      query: ({ id, sessionId, clientRating, clientReview }) => ({
        url: `/api/orders/client/${id}/stripe-confirm`,
        method: 'POST',
        body: { sessionId, clientRating, clientReview },
      }),
      invalidatesTags: ['Orders', 'Profile'],
    }),
    submitClientOrderReview: builder.mutation<
      ApiEnvelope<{ order?: Record<string, unknown> }>,
      { id: string; rating: number; review?: string }
    >({
      query: ({ id, rating, review }) => ({
        url: `/api/orders/client/${id}/review`,
        method: 'POST',
        body: { rating, review },
      }),
      invalidatesTags: ['Orders', 'Profile'],
    }),
    getMyWithdrawals: builder.query<
      ApiEnvelope<{
        balance?: {
          availableBalance?: number;
          pendingWithdrawalAmount?: number;
          totalEarnings?: number;
          totalWithdrawn?: number;
        };
        withdrawals?: Record<string, unknown>[];
        pagination?: {
          page: number;
          limit: number;
          totalItems: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      }>,
      { page?: number; limit?: number; status?: string } | void
    >({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && typeof args === 'object') {
          params.set('page', String(args.page ?? 1));
          params.set('limit', String(args.limit ?? 8));
          if (args.status) params.set('status', args.status);
        } else {
          params.set('page', '1');
          params.set('limit', '8');
        }
        return `/api/withdrawals/me?${params.toString()}`;
      },
      providesTags: ['Profile'],
    }),
    requestWithdrawal: builder.mutation<ApiEnvelope<unknown>, WithdrawalRequestPayload>({
      query: (payload) => ({
        url: '/api/withdrawals/me/request',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Profile'],
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
    markConversationMessagesAsRead: builder.mutation<ApiEnvelope<{ modifiedCount?: number }>, string>({
      query: (conversationId) => ({
        url: `/api/chats/conversations/${conversationId}/read`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, conversationId) => [{ type: 'Chats', id: conversationId }, 'Chats'],
    }),
    markAllMessagesAsRead: builder.mutation<ApiEnvelope<{ modifiedCount?: number }>, void>({
      query: () => ({
        url: '/api/chats/conversations/read-all',
        method: 'POST',
      }),
      invalidatesTags: ['Chats'],
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
  useCreateServiceRequestMutation,
  useGetClientServiceRequestsQuery,
  useGetProviderServiceRequestsQuery,
  useAcceptServiceRequestMutation,
  useIgnoreServiceRequestMutation,
  useGetProviderOrdersQuery,
  useGetProviderDashboardQuery,
  useGetClientDashboardQuery,
  useGetClientOrdersQuery,
  useGetClientOrderDetailQuery,
  useGetProviderOrderDetailQuery,
  useAcceptProviderOrderMutation,
  useDeclineProviderOrderMutation,
  useSubmitProviderDeliveryMutation,
  useRespondProviderRevisionMutation,
  useRequestClientRevisionMutation,
  useCancelClientRevisionMutation,
  useSendClientResolutionMessageMutation,
  useCreateClientCheckoutSessionMutation,
  useConfirmClientCheckoutPaymentMutation,
  useSubmitClientOrderReviewMutation,
  useGetMyWithdrawalsQuery,
  useRequestWithdrawalMutation,
  useFinalizeClientOrderMutation,
  useGetConversationsQuery,
  useEnsureConversationByOrderMutation,
  useGetConversationMessagesQuery,
  useSendConversationMessageMutation,
  useMarkConversationMessagesAsReadMutation,
  useMarkAllMessagesAsReadMutation,
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
