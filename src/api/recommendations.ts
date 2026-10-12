import { getAccessToken, refreshAccessToken, saveAccessToken } from './auth';
import { getProfilePayload, type Profile } from './profile';

export type RecommendationCard = {
  certificate_id: string;
  qnet_code: string;
  name: string;
  category: string;
  category_name: string;
  summary: string;
  position: number;
  reason: string;
  profile_factors: string[];
  recommended_for: { text: string; source_ids: string[] }[];
  related_jobs: { name: string; note?: string }[];
  related_jobs_status: 'available' | 'unavailable';
  sources: { source_url: string }[];
};

export type RecommendationResponse = {
  status: 'completed' | 'no_results';
  total_count: number;
  initial_display_count: number;
  items: RecommendationCard[];
};

export type SavedProfileResponse = {
  profile: Record<string, unknown> | null;
  profile_completed: boolean;
  missing_fields: string[];
  profile_version: number;
};

export class RecommendationApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'RecommendationApiError';
  }
}

function apiUrl(path: string): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!baseUrl) throw new Error('VITE_API_BASE_URL 환경변수를 설정해주세요.');
  return baseUrl.replace(/\/+$/, '') + path;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    let message = '요청에 실패했습니다. (' + response.status + ')';
    let code: string | undefined;
    if (body && typeof body === 'object') {
      const detail = 'detail' in body ? body.detail : 'error' in body ? body.error : null;
      if (typeof detail === 'string') message = detail;
      else if (detail && typeof detail === 'object') {
        if ('message' in detail && typeof detail.message === 'string') message = detail.message;
        if ('code' in detail && typeof detail.code === 'string') code = detail.code;
      }
    }
    throw new RecommendationApiError(message, response.status, code);
  }
  return body as T;
}

async function authorizedRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let token = getAccessToken();
  if (!token) {
    token = await refreshAccessToken();
    saveAccessToken(token);
  }

  const send = (accessToken: string) => fetch(apiUrl(path), {
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken,
      ...init.headers,
    },
  });

  let response = await send(token);
  if (response.status === 401) {
    token = await refreshAccessToken();
    saveAccessToken(token);
    response = await send(token);
  }
  return parseResponse<T>(response);
}

export function getSavedProfile(): Promise<SavedProfileResponse> {
  return authorizedRequest<SavedProfileResponse>('/me/profile');
}

export function updateSavedProfile(
  profile: Profile,
  profileVersion: number,
): Promise<SavedProfileResponse> {
  return authorizedRequest<SavedProfileResponse>('/me/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      profile_version: profileVersion,
      ...getProfilePayload(profile),
    }),
  });
}

export function createRecommendations(): Promise<RecommendationResponse> {
  return authorizedRequest<RecommendationResponse>('/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
}
