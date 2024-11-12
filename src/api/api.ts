import axios from "axios";

export const BASE_URL = "https://api.appfuel.pro";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface BuyGiftResponse {
  invoiceId: string;
  paymentUrl: string;
}

export interface StoreGiftResponse {
  id: string;
  name: string;
  price: {
    amount: number;
    token: string;
  };
  slug: string;
  bgVariant: number;
  boughtCount: number;
  totalCount: number;
  createdAt: Date;
}

export interface ProfileResponse {
  id: string;
  telegramId: number;
  username?: string;
  firstName: string;
  lastName?: string;
  isPremium: boolean;
  giftsReceived: number;
  rank: number;
}

export interface GiftRecentActionResponse {
  id: string;
  type: "gift_sent" | "gift_purchased";
  actor: ProfileResponse;
  target?: ProfileResponse;
  gift: StoreGiftResponse;
  createdAt: string;
}

export interface PurchasedGiftResponse {
  id: string;
  name: string;
  owner: ProfileResponse;
  buyer: ProfileResponse;
  boughtAt: Date;
  price: {
    amount: number;
    token: string;
  };
  slug: string;
  bgVariant: number;
  boughtCount: number;
  totalCount: number;
  createdAt: Date;
}

export interface ReceiveGiftResponse {
  success: boolean;
  gift: PurchasedGiftResponse;
}

export interface ProfileRecentActionResponse {
  type: "gift_sent" | "gift_purchased";
  actor: ProfileResponse;
  target?: ProfileResponse;
  gift: StoreGiftResponse;
  purchaseMetadata?: {
    price: {
      amount: number;
      token: string;
    };
  };
  createdAt: string;
}

export interface SendGiftResponse {
  sendToken: string;
}

export interface CheckPaymentResponse {
  status: "pending" | "paid" | "expired";
}

export class API {
  public static setInitDataHeader(initData: string) {
    api.defaults.headers.common["x-telegram-id"] = `${initData}`;
  }

  public static buyGift(giftId: string) {
    return api.post<BuyGiftResponse>(`/gifts/buy`, { giftId });
  }

  public static sendGift(giftId: string) {
    return api.post<SendGiftResponse>(`/gifts/send`, {
      purchasedGiftId: giftId,
    });
  }

  public static receiveGift(token: string) {
    return api.post<ReceiveGiftResponse>(`/gifts/receive`, { token });
  }

  public static getGiftRecentActions(giftId: string, page: number = 1) {
    return api.get<PaginatedResponse<GiftRecentActionResponse>>(
      `/gifts/${giftId}/actions?page=${page}`
    );
  }

  public static getStoreGifts(page: number = 1) {
    return api.get<PaginatedResponse<StoreGiftResponse>>(
      `/gifts/store?page=${page}`
    );
  }

  public static getMyGifts(page: number = 1) {
    return api.get<PaginatedResponse<PurchasedGiftResponse>>(
      `/gifts/my?page=${page}`
    );
  }

  public static checkPayment(invoiceId: string) {
    return api.get<CheckPaymentResponse>(`/gifts/check-payment/${invoiceId}`);
  }

  public static getProfile(userId: string) {
    return api.get<ProfileResponse>(`/profile/${userId}`);
  }

  public static getProfileRecentActions(userId: string, page: number = 1) {
    return api.get<PaginatedResponse<ProfileRecentActionResponse>>(
      `/profile/${userId}/actions?page=${page}`
    );
  }

  public static getProfileReceivedGifts(userId: string, page: number = 1) {
    return api.get<PaginatedResponse<PurchasedGiftResponse>>(
      `/gifts/profile/${userId}?page=${page}`
    );
  }

  public static getLeaderboard(page: number = 1) {
    return api.get<PaginatedResponse<ProfileResponse>>(
      `/leaderboard?page=${page}`
    );
  }
}
