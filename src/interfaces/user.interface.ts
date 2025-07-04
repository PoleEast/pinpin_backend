interface RegisterServiceData {
  nickname: string;
  account: string;
  avatar_public_id: string;
  token: string;
}

interface LoginServiceData {
  nickname: string;
  account: string;
  avatar_public_id: string;
  token: string;
}

export type { RegisterServiceData, LoginServiceData };
