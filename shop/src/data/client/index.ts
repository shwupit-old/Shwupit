import type {
  Attachment,
  AuthResponse,
  Card,
  CategoryPaginator,
  CategoryQueryOptions,
  ChangePasswordInput,
  CheckoutVerificationInput,
  CreateAbuseReportInput,
  CreateContactUsInput,
  CreateFeedbackInput,
  CreateOrderInput,
  CreateOrderPaymentInput,
  CreateQuestionInput,
  CreateReviewInput,
  FAQS,
  FaqsPaginator,
  FaqsQueryOptions,
  Feedback,
  ForgetPasswordInput,
  GetParams,
  LoginUserInput,
  MyQuestionQueryOptions,
  MyReportsQueryOptions,
  Order,
  OrderPaginator,
  OrderQueryOptions,
  OrderedFilePaginator,
  PasswordChangeResponse,
  PaymentIntentCollection,
  PopularProductsQueryOptions,
  Product,
  ProductPaginator,
  ProductQueryOptions,
  QueryOptions,
  QuestionPaginator,
  QuestionQueryOptions,
  RegisterUserInput,
  ResetPasswordInput,
  Review,
  ReviewPaginator,
  ReviewQueryOptions,
  ReviewResponse,
  Settings,
  SettingsQueryOptions,
  Shop,
  ShopPaginator,
  ShopQueryOptions,
  Tag,
  TagPaginator,
  TermsAndConditionsPaginator,
  TermsAndConditionsQueryOptions,
  TopShopQueryOptions,
  Type,
  TypeQueryOptions,
  UpdateReviewInput,
  UpdateUserInput,
  User,
  VerifiedCheckoutResponse,
  VerifyForgetPasswordTokenInput,
  Wishlist,
  WishlistQueryOptions,
} from '@/types';
import { FollowedShopsQueryOptions } from '@/types';
import { API_ENDPOINTS } from './endpoints';
import { HttpClient } from './http-client';
import { supabase } from '../utils/supabaseClient';
import {mapSupabaseUserToUser} from '@/types/index'
import { createClient } from '@supabase/supabase-js';

class Client {
  products = {
    all: ({
      categories,
      tags,
      name,
      shop_id,
      price,
      ...query
    }: Partial<ProductQueryOptions> = {}) =>
      HttpClient.get<ProductPaginator>(API_ENDPOINTS.PRODUCTS, {
        searchJoin: 'and',
        with: 'shop',
        orderBy: 'updated_at',
        sortedBy: 'ASC',
        ...query,
        search: HttpClient.formatSearchParams({
          categories,
          tags,
          name,
          shop_id,
          price,
          status: 'publish',
        }),
      }),
    popular: (params: Partial<PopularProductsQueryOptions>) =>
      HttpClient.get<Product[]>(API_ENDPOINTS.PRODUCTS_POPULAR, {
        with: 'shop',
        withCount: 'orders',
        ...params,
      }),
    get: ({ slug, language }: GetParams) =>
      HttpClient.get<Product>(`${API_ENDPOINTS.PRODUCTS}/${slug}`, {
        language,
        with: 'shop;tags;type',
        withCount: 'orders',
      }),
    download: (input: { product_id: string }) =>
      HttpClient.post<string>(API_ENDPOINTS.PRODUCTS_FREE_DOWNLOAD, input),
  };
  
  categories = {
    all: (query?: CategoryQueryOptions) =>
      HttpClient.get<CategoryPaginator>(API_ENDPOINTS.CATEGORIES, { ...query }),
  };

  tags = {
    all: (query?: QueryOptions) =>
      HttpClient.get<TagPaginator>(API_ENDPOINTS.TAGS, query),
    get: ({ slug, language }: { slug: string; language?: string }) =>
      HttpClient.get<Tag>(`${API_ENDPOINTS.TAGS}/${slug}`, { language }),
  };

  types = {
    all: (query?: TypeQueryOptions) =>
      HttpClient.get<Type[]>(API_ENDPOINTS.TYPES, { ...query }),
  };

  shops = {
    all: (query?: ShopQueryOptions) =>
      HttpClient.get<ShopPaginator>(API_ENDPOINTS.SHOPS, query),
    top: ({ name, ...query }: Partial<TopShopQueryOptions> = {}) =>
      HttpClient.get<ShopPaginator>(API_ENDPOINTS.TOP_SHOPS, {
        searchJoin: 'and',
        search: HttpClient.formatSearchParams({
          name,
          is_active: 1,
        }),
        ...query,
      }),
    get: (slug: string) =>
      HttpClient.get<Shop>(`${API_ENDPOINTS.SHOPS}/${slug}`),
  };

  orders = {
    all: (query?: OrderQueryOptions) =>
      HttpClient.get<OrderPaginator>(API_ENDPOINTS.ORDERS, query),
    get: (tracking_number: string) =>
      HttpClient.get<Order>(`${API_ENDPOINTS.ORDERS}/${tracking_number}`),
    downloadable: (query?: OrderQueryOptions) =>
      HttpClient.get<OrderedFilePaginator>(
        API_ENDPOINTS.ORDERS_DOWNLOADS,
        query
      ),
    generateDownloadLink: (digital_file_id: string, name?: string) =>
      HttpClient.post<string>(
        API_ENDPOINTS.GENERATE_DOWNLOADABLE_PRODUCT_LINK,
        {
          digital_file_id,
        }
      ),
    verify: (data: CheckoutVerificationInput) =>
      HttpClient.post<VerifiedCheckoutResponse>(
        API_ENDPOINTS.ORDERS_CHECKOUT_VERIFY,
        data
      ),
    create: (data: CreateOrderInput) =>
      HttpClient.post<Order>(API_ENDPOINTS.ORDERS, data),
    getPaymentIntent: ({
      tracking_number,
      payment_gateway,
      recall_gateway,
    }: {
      tracking_number: string;
      payment_gateway?: string;
      recall_gateway?: boolean;
    }) =>
      HttpClient.get<PaymentIntentCollection>(API_ENDPOINTS.PAYMENT_INTENT, {
        tracking_number,
        payment_gateway,
        recall_gateway,
      }),
    payment: (input: CreateOrderPaymentInput) =>
      HttpClient.post<any>(API_ENDPOINTS.ORDERS_PAYMENT, input),
    savePaymentMethod: (input: any) =>
      HttpClient.post<any>(API_ENDPOINTS.SAVE_PAYMENT_METHOD, input),
  };
  users = {
    me: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data) throw error || new Error('User data is null');
      return mapSupabaseUserToUser(data.user);
    },
    update: async (user: UpdateUserInput) => {
      const { data, error } = await supabase
        .from('users')
        .update(user)
        .eq('id', user.id);
      if (error || !data) throw error || new Error('User data is null');
      return mapSupabaseUserToUser(data[0]);
    },
    login: async (input: LoginUserInput) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.identifier,
        password: input.password,
      });
      if (error || !data) throw error || new Error('Login data is null');
    
      if (data.session?.access_token) {
        localStorage.setItem('supabase.auth.token', data.session.access_token);
      }
    
      await supabase.auth.setSession(data.session);
      return {
        token: data.session?.access_token || '',
        permissions: [] // Assuming permissions can be handled separately
      } as AuthResponse;
    },
    register: async (input: RegisterUserInput) => {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            username: input.username,
            country: input.country,
            currency: input.currency,
            bio: input.bio,
          }
        }
      });
      if (error || !data) throw error || new Error('Registration data is null');
      return {
        token: data.session?.access_token || '',
        permissions: [] // Assuming permissions can be handled separately
      } as AuthResponse;
    },
    forgotPassword: async (input: ForgetPasswordInput) => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(input.email);
      if (error) throw error;
      return { success: true, message: 'Password reset email sent' } as PasswordChangeResponse;
    },
    verifyForgotPasswordToken: async (input: VerifyForgetPasswordTokenInput) => {
      // Supabase handles this internally via the magic link mechanism
      return { success: true, message: 'Token verified' } as PasswordChangeResponse;
    },
    resetPassword: async (input: ResetPasswordInput) => {
      const { data, error } = await supabase.auth.updateUser({
        password: input.password,
      });
      if (error) throw error;
      return { success: true, message: 'Password reset successful' } as PasswordChangeResponse;
    },
    changePassword: async (input: ChangePasswordInput) => {
      const { data, error } = await supabase.auth.updateUser({
        password: input.newPassword,
      });
      if (error) throw error;
      return { success: true, message: 'Password change successful' } as PasswordChangeResponse;
    },
      logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return true;
      },
  };




  
  questions = {
    all: ({ question, ...params }: QuestionQueryOptions) =>
      HttpClient.get<QuestionPaginator>(API_ENDPOINTS.PRODUCTS_QUESTIONS, {
        searchJoin: 'and',
        ...params,
        search: HttpClient.formatSearchParams({
          question,
        }),
      }),
    create: (input: CreateQuestionInput) =>
      HttpClient.post<Review>(API_ENDPOINTS.PRODUCTS_QUESTIONS, input),
  };

  feedback = {
    create: (input: CreateFeedbackInput) =>
      HttpClient.post<Feedback>(API_ENDPOINTS.PRODUCTS_FEEDBACK, input),
  };

  abuse = {
    create: (input: CreateAbuseReportInput) =>
      HttpClient.post<Review>(
        API_ENDPOINTS.PRODUCTS_REVIEWS_ABUSE_REPORT,
        input
      ),
  };

  reviews = {
    all: ({ rating, ...params }: ReviewQueryOptions) =>
      HttpClient.get<ReviewPaginator>(API_ENDPOINTS.PRODUCTS_REVIEWS, {
        searchJoin: 'and',
        with: 'user',
        ...params,
        search: HttpClient.formatSearchParams({
          rating,
        }),
      }),
    get: ({ id }: { id: string }) =>
      HttpClient.get<Review>(`${API_ENDPOINTS.PRODUCTS_REVIEWS}/${id}`),
    create: (input: CreateReviewInput) =>
      HttpClient.post<ReviewResponse>(API_ENDPOINTS.PRODUCTS_REVIEWS, input),
    update: (input: UpdateReviewInput) =>
      HttpClient.put<ReviewResponse>(
        `${API_ENDPOINTS.PRODUCTS_REVIEWS}/${input.id}`,
        input
      ),
  };

 wishlist = {
    all: async (params?: WishlistQueryOptions): Promise<ProductPaginator[]> => {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*') 
        .order('created_at', { ascending: false }); 
      if (error) throw error;
  
      return data as ProductPaginator[];
    },
    
    toggle: async (input: { product_id: string }): Promise<{ in_wishlist: boolean }> => {
      const { data, error } = await supabase
        .rpc('toggle_wishlist', { product_id: input.product_id }); 
      if (error) throw error;
  
      return data as { in_wishlist: boolean };
    },
  
    remove: async (id: string): Promise<Wishlist> => {
      const { data, error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', id)
        .single();
      if (error) throw error;
  
      return data as Wishlist;
    },
  
    checkIsInWishlist: async ({ product_id }: { product_id: string }): Promise<boolean> => {
      const { data, error } = await supabase
        .from('wishlist')
        .select('id')
        .eq('product_id', product_id)
        .single();
      if (error) throw error;
  
      return data !== null;
    },
  };

  myQuestions = {
    all: (params: MyQuestionQueryOptions) =>
      HttpClient.get<QuestionPaginator>(API_ENDPOINTS.MY_QUESTIONS, {
        with: 'user',
        orderBy: 'created_at',
        sortedBy: 'desc',
        ...params,
      }),
  };

  myReports = {
    all: (params: MyReportsQueryOptions) =>
      HttpClient.get<QuestionPaginator>(API_ENDPOINTS.MY_REPORTS, {
        with: 'user',
        orderBy: 'created_at',
        sortedBy: 'desc',
        ...params,
      }),
  };

  follow = {
    shops: (query?: FollowedShopsQueryOptions) =>
      HttpClient.get<ShopPaginator>(API_ENDPOINTS.FOLLOWED_SHOPS, query),
    isShopFollowed: (input: { shop_id: string }) =>
      HttpClient.get<boolean>(API_ENDPOINTS.FOLLOW_SHOP, input),
    toggle: (input: { shop_id: string }) =>
      HttpClient.post<boolean>(API_ENDPOINTS.FOLLOW_SHOP, input),
    followedShopProducts: (params: Partial<FollowedShopsQueryOptions>) => {
      return HttpClient.get<Product[]>(API_ENDPOINTS.FOLLOWED_SHOPS_PRODUCTS, {
        ...params,
      });
    },
  };

  settings = {
    all: async (params?: SettingsQueryOptions): Promise<Settings> => {
      const { data, error } = await supabase
        .from('settings')
        .select('*'); // Remove language filter if not needed
      if (error) throw error;

      if (data.length === 0) {
        throw new Error('Settings not found');
      }

      // Assuming you want the first item
      return data[0] as Settings;
    },
    contactUs: (input: CreateContactUsInput) =>
      HttpClient.post<any>(API_ENDPOINTS.SETTINGS_CONTACT_US, input),
    upload: (formData: FormData) => {
      return HttpClient.post<Attachment[]>(API_ENDPOINTS.UPLOADS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    subscribe: (input: { email: string }) =>
      HttpClient.post<any>(API_ENDPOINTS.USERS_SUBSCRIBE_TO_NEWSLETTER, input),
  };


  cards = {
    all: (params?: any) =>
      HttpClient.get<Card[]>(API_ENDPOINTS.CARDS, { ...params }),
    remove: ({ id }: { id: string }) =>
      HttpClient.delete<any>(`${API_ENDPOINTS.CARDS}/${id}`),
    addPaymentMethod: (method_key: any) =>
      HttpClient.post<any>(API_ENDPOINTS.CARDS, method_key),
    makeDefaultPaymentMethod: (input: any) =>
      HttpClient.post<any>(API_ENDPOINTS.SET_DEFAULT_CARD, input),
  };

  termsAndConditions = {
    all: ({
      type,
      issued_by,
      ...params
    }: Partial<TermsAndConditionsQueryOptions>) =>
      HttpClient.get<TermsAndConditionsPaginator>(
        API_ENDPOINTS.TERMS_AND_CONDITIONS,
        {
          searchJoin: 'and',
          ...params,
          search: HttpClient.formatSearchParams({
            type,
            issued_by,
          }),
          with: 'shop',
        }
      ),
    get: (id: string) =>
      HttpClient.get<FAQS>(`${API_ENDPOINTS.TERMS_AND_CONDITIONS}/${id}`),
  };

  faqs = {
    all: ({
      faq_type,
      issued_by,
      shop_id,
      ...params
    }: Partial<FaqsQueryOptions>) =>
      HttpClient.get<FaqsPaginator>(API_ENDPOINTS.FAQS, {
        ...params,
        search: HttpClient.formatSearchParams({
          issued_by,
          shop_id,
        }),
      }),
  };
}

export default new Client();