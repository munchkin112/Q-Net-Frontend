export type Page =
  | 'home'
  | 'login'
  | 'profile'
  | 'related'
  | 'recommendations'
  | 'detail'
  | 'mypage'
  | 'favorites'
  | 'calendar';

export type Certificate = {
  name: string;
  job: string;
  description: string;
  level: string;
};

export type OfficialCertificate = {
  id: string;
  qnet_code: string;
  name: string;
  category: string;
  career_tags: string[];
  description: string | null;
  source_url: string;
  last_synced_at: string;
  updated_at: string;
};

type CertificateSearchOptions = {
  query: string;
  category?: 'T' | 'S';
  limit: number;
  offset: number;
  signal?: AbortSignal;
};

export async function searchOfficialCertificates({
  query,
  category,
  limit,
  offset,
  signal,
}: CertificateSearchOptions): Promise<OfficialCertificate[]> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL 환경변수를 설정해주세요.');
  }

  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
    offset: String(offset),
  });
  if (category) params.set('category', category);

  let response: Response;
  try {
    response = await fetch(
      `${baseUrl.replace(/\/+$/, '')}/certificates?${params.toString()}`,
      {
        headers: { Accept: 'application/json' },
        signal,
      },
    );
  } catch (error) {
    throw new Error('공식 자격증 목록을 불러오지 못했습니다. 백엔드 연결을 확인해주세요.', {
      cause: error,
    });
  }

  if (!response.ok) {
    let message = `공식 자격증 목록 조회에 실패했습니다. (${response.status})`;
    try {
      const body: unknown = await response.json();
      if (
        body &&
        typeof body === 'object' &&
        'detail' in body &&
        typeof body.detail === 'string'
      ) {
        message = body.detail;
      } else if (
        body &&
        typeof body === 'object' &&
        'error' in body &&
        body.error &&
        typeof body.error === 'object' &&
        'message' in body.error &&
        typeof body.error.message === 'string'
      ) {
        message = body.error.message;
      }
    } catch {
      // Keep the status-based message when the server does not return JSON.
    }
    throw new Error(message);
  }

  const result: unknown = await response.json();
  if (
    !Array.isArray(result) ||
    !result.every(
      (item): item is OfficialCertificate =>
        item !== null &&
        typeof item === 'object' &&
        'id' in item &&
        typeof item.id === 'string' &&
        'qnet_code' in item &&
        typeof item.qnet_code === 'string' &&
        'name' in item &&
        typeof item.name === 'string' &&
        'category' in item &&
        typeof item.category === 'string' &&
        'career_tags' in item &&
        Array.isArray(item.career_tags) &&
        'description' in item &&
        (typeof item.description === 'string' || item.description === null) &&
        'source_url' in item &&
        typeof item.source_url === 'string' &&
        'last_synced_at' in item &&
        typeof item.last_synced_at === 'string' &&
        'updated_at' in item &&
        typeof item.updated_at === 'string',
    )
  ) {
    throw new Error('백엔드가 올바르지 않은 자격증 목록을 반환했습니다.');
  }
  return result;
}

export const certificates: Certificate[] = [
  {
    name: '프레스금형기사',
    job: '금형 설계 · 금형 제작',
    description: '프레스 금형의 설계·제작 분야를 알아볼 수 있는 자격증입니다.',
    level: '기사',
  },
  {
    name: '일반기계기사',
    job: '기계 설계 · 생산기술',
    description: '기계 설계·제작 분야를 알아볼 수 있는 자격증입니다.',
    level: '기사',
  },
  {
    name: '기계설계산업기사',
    job: '기계 설계 · CAD',
    description: '기계 설계 분야의 역량을 알아볼 수 있는 자격증입니다.',
    level: '산업기사',
  },
  {
    name: '산업안전기사',
    job: '산업 안전 · 위험성 평가',
    description: '산업 현장의 안전 관리 분야를 알아볼 수 있는 자격증입니다.',
    level: '기사',
  },
  {
    name: '자동차정비기사',
    job: '자동차 정비 · 자동차 부품 제조',
    description: '자동차 정비 분야를 알아볼 수 있는 자격증입니다.',
    level: '기사',
  },
];
