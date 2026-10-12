import { getAccessToken, refreshAccessToken, saveAccessToken } from './auth';
import { searchOfficialCertificates } from './certificates';

export type CalendarEventType =
  | 'registration'
  | 'written_exam'
  | 'practical_exam'
  | 'result';

export type OfficialSchedule = {
  id: string;
  certificate_id: string;
  year: number;
  round_key: string;
  round_label: string;
  phase: 'written' | 'practical' | 'interview' | 'first' | 'second' | 'other';
  registration_start: string | null;
  registration_end: string | null;
  registration_periods: { starts_on: string; ends_on: string }[];
  exam_start: string | null;
  exam_end: string | null;
  result_date: string | null;
  source_url: string;
  updated_at: string;
};

export type OfficialCertificateDetail = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  official_url: string;
  last_synced_at: string;
  exam_information: {
    subjects: {
      phases: string[];
      written: string[] | null;
      practical: string[] | null;
      interview: string[] | null;
      common: string[] | null;
    };
    pass_criteria: {
      written: string | null;
      practical: string | null;
      interview: string | null;
      common: string | null;
    };
    fees: {
      written: number | null;
      practical: number | null;
      interview: number | null;
      currency: string;
    };
  };
};

export type CalendarRegisterRequest = {
  certificate_id: string;
  schedule_ids: string[];
  schedule_versions: Record<string, string>;
  event_types: CalendarEventType[];
};

export type CalendarRegisterResponse = {
  registration_id: string;
  status: 'completed' | 'partial' | 'failed' | 'pending_confirmation';
  items: {
    item_key: string;
    event_type: CalendarEventType;
    status: 'created' | 'already_registered' | 'failed' | 'unknown';
    html_link: string | null;
    message: string | null;
    retryable: boolean;
  }[];
  excluded_items: {
    event_type: CalendarEventType;
    reason: string;
    schedule_id: string | null;
    period_index: number | null;
  }[];
  message: string;
};

export class CalendarApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly code?: string) {
    super(message);
    this.name = 'CalendarApiError';
  }
}

function apiUrl(path: string): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!baseUrl) throw new Error('VITE_API_BASE_URL 환경변수를 설정해주세요.');
  return `${baseUrl.replace(/\/+$/, '')}${path}`;
}

async function readJson<T>(response: Response): Promise<T> {
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    let message = `요청에 실패했습니다. (${response.status})`;
    let code: string | undefined;
    if (body && typeof body === 'object') {
      const detail = 'detail' in body ? body.detail : 'error' in body ? body.error : null;
      if (typeof detail === 'string') message = detail;
      else if (detail && typeof detail === 'object') {
        if ('message' in detail && typeof detail.message === 'string') message = detail.message;
        if ('code' in detail && typeof detail.code === 'string') code = detail.code;
      }
    }
    throw new CalendarApiError(message, response.status, code);
  }
  return body as T;
}

export async function getOfficialCertificate(
  name: string,
  knownId?: string,
): Promise<OfficialCertificateDetail> {
  let id = knownId;
  if (!id) {
    const matches = await searchOfficialCertificates({ query: name, limit: 100, offset: 0 });
    id = matches.find((item) => item.name === name)?.id;
  }
  if (!id) throw new Error('공식 목록에서 이 자격증을 찾지 못했습니다.');
  const response = await fetch(apiUrl(`/certificates/${encodeURIComponent(id)}`));
  return readJson<OfficialCertificateDetail>(response);
}

export async function listOfficialSchedules(id: string, year: number): Promise<OfficialSchedule[]> {
  const response = await fetch(
    apiUrl(`/certificates/${encodeURIComponent(id)}/schedules?year=${year}`),
  );
  return readJson<OfficialSchedule[]>(response);
}

export async function createCalendarRegistration(
  selection: CalendarRegisterRequest,
  idempotencyKey: string,
): Promise<CalendarRegisterResponse> {
  let accessToken = getAccessToken();
  if (!accessToken) {
    accessToken = await refreshAccessToken();
    saveAccessToken(accessToken);
  }

  const send = (token: string) => fetch(apiUrl('/calendar/register'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(selection),
  });

  let response = await send(accessToken);
  if (response.status === 401) {
    accessToken = await refreshAccessToken();
    saveAccessToken(accessToken);
    response = await send(accessToken);
  }
  return readJson<CalendarRegisterResponse>(response);
}
