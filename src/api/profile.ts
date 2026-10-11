export type Profile = {
  field: number;
  education: string;
  major: string;
  experience: boolean;
  years: string;
};

export const profileFields = [
  '사업관리',
  '경영·회계·사무',
  '금융·보험',
  '교육·자연·사회과학',
  '법률·경찰·소방·교도·국방',
  '보건·의료',
  '사회복지·종교',
  '문화·예술·디자인·방송',
  '운전·운송',
  '영업판매',
  '경비·청소',
  '이용·숙박·여행·오락·스포츠',
  '음식서비스',
  '건설',
  '기계',
  '재료',
  '화학·바이오',
  '섬유·의복',
  '전기·전자',
  '정보통신',
  '식품가공',
  '인쇄·목재·가구·공예',
  '환경·에너지·안전',
  '농림어업',
];

export const initialProfile: Profile = {
  field: 14,
  education: '',
  major: '',
  experience: true,
  years: '',
};
