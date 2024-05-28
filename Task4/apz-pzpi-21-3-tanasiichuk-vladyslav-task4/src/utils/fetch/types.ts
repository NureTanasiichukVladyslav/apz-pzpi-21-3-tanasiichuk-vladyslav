export interface RequestOptions {
  accessToken?: string;
  config?: RequestInit;
  secure?: boolean;
  signal?: AbortSignal;
  next?: { tags: string[] };
}
