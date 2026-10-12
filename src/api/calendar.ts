import { certificates } from './certificates';

export type Exam = {
  apply: string;
  exam: string;
  result: string;
  date: string;
  start: string;
  end: string;
  resultDate: string;
};

export type CalendarEntry = {
  name: string;
  type: string;
  apply: string;
  exam: string;
  round: number;
};

export const exams: Exam[] = [
  {
    apply: '1.12(월) ~ 1.15(목)',
    exam: '2.8(일)',
    result: '3.4(수)',
    date: '20260208',
    start: '20260112',
    end: '20260115',
    resultDate: '20260304',
  },
  {
    apply: '4.14(화) ~ 4.17(금)',
    exam: '5.10(일)',
    result: '6.3(수)',
    date: '20260510',
    start: '20260414',
    end: '20260417',
    resultDate: '20260603',
  },
  {
    apply: '7.7(화) ~ 7.10(금)',
    exam: '8.9(일)',
    result: '9.2(수)',
    date: '20260809',
    start: '20260707',
    end: '20260710',
    resultDate: '20260902',
  },
];

export const initialCalendar: CalendarEntry[] = certificates
  .slice(0, 4)
  .map((certificate, index) => ({
    name: certificate.name,
    type: index % 2 ? '실기' : '필기',
    apply: [
      '2026.07.07 ~ 07.10',
      '2026.09.07 ~ 09.10',
      '2026.08.10 ~ 08.13',
      '2026.07.13 ~ 07.16',
    ][index],
    exam: [
      '2026.08.09',
      '2026.10.24 ~ 11.06',
      '2026.09.20',
      '2026.08.08 ~ 08.16',
    ][index],
    round: index === 3 ? 1 : 3,
  }));

export function calendarId(entry: CalendarEntry): string {
  return `${entry.name}:${entry.type}:${entry.round}`;
}

export function downloadCalendar(name: string, type: string, round: number): void {
  const exam = exams[round];
  const events = [
    ['원서접수 시작', exam.start],
    ['원서접수 마감', exam.end],
    [type + '시험', exam.date],
    ['합격발표', exam.resultDate],
  ];
  const nextDay = (date: string) => {
    const value = new Date(
      `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T00:00:00Z`,
    );
    value.setUTCDate(value.getUTCDate() + 1);
    return value.toISOString().slice(0, 10).replaceAll('-', '');
  };
  const stamp = new Date()
    .toISOString()
    .replaceAll('-', '')
    .replaceAll(':', '')
    .replace(/\.\d{3}/, '');
  const data = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Jagyeok Itda//Demo//KO',
    'CALSCALE:GREGORIAN',
    ...events.flatMap(([title, date]) => [
      'BEGIN:VEVENT',
      `UID:${name}-${round}-${date}-${title}@jagyeok-itda.demo`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${date}`,
      `DTEND;VALUE=DATE:${nextDay(date)}`,
      `SUMMARY:${name} ${title}`,
      `DESCRIPTION:디자인 원본에 포함된 데모 일정입니다. Q-Net에서 실제 일정을 확인하세요.`,
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
    '',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([data], { type: 'text/calendar;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${name}-${type}-${round + 1}회.ics`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
