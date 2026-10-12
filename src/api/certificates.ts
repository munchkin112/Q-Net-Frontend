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
