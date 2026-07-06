/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TimetableWeek, Notice, Compliment, ClassRole, ScheduleItem, ClassPoll } from '../types';

export const INITIAL_TIMETABLE: TimetableWeek = {
  '월': [
    { period: 1, subject: '독서', teacher: '이정민', room: '2-2 교실' },
    { period: 2, subject: '수학 I', teacher: '박현우', room: '2-2 교실' },
    { period: 3, subject: '영어 I', teacher: 'Sarah Kim', room: '영어 전용실' },
    { period: 4, subject: '물리학 I', teacher: '강태형', room: '과학실' },
    { period: 5, subject: '중국어 I', teacher: '장웨이', room: '2-2 교실' },
    { period: 6, subject: '체육', teacher: '홍길동', room: '체육관' },
    { period: 7, subject: '자율활동', teacher: '김소연', room: '2-2 교실' },
  ],
  '화': [
    { period: 1, subject: '수학 I', teacher: '박현우', room: '2-2 교실' },
    { period: 2, subject: '확률과 통계', teacher: '최지아', room: '수학실 A' },
    { period: 3, subject: '독서', teacher: '이정민', room: '2-2 교실' },
    { period: 4, subject: '영어 I', teacher: 'Sarah Kim', room: '영어 전용실' },
    { period: 5, subject: '한국사', teacher: '정재헌', room: '2-2 교실' },
    { period: 6, subject: '음악', teacher: '윤서형', room: '음악실' },
    { period: 7, subject: '진로활동', teacher: '김소연', room: '2-2 교실' },
  ],
  '수': [
    { period: 1, subject: '화학 I', teacher: '이영희', room: '과학실' },
    { period: 2, subject: '영어 I', teacher: 'Sarah Kim', room: '영어 전용실' },
    { period: 3, subject: '수학 I', teacher: '박현우', room: '2-2 교실' },
    { period: 4, subject: '문학', teacher: '이정민', room: '2-2 교실' },
    { period: 5, subject: '미술', teacher: '한지혜', room: '미술실' },
    { period: 6, subject: '미술', teacher: '한지혜', room: '미술실' },
    { period: 7, subject: '동아리활동', teacher: '각 동아리실', room: '지정 교실' },
  ],
  '목': [
    { period: 1, subject: '한국사', teacher: '정재헌', room: '2-2 교실' },
    { period: 2, subject: '중국어 I', teacher: '장웨이', room: '2-2 교실' },
    { period: 3, subject: '물리학 I', teacher: '강태형', room: '과학실' },
    { period: 4, subject: '독서', teacher: '이정민', room: '2-2 교실' },
    { period: 5, subject: '수학 I', teacher: '박현우', room: '2-2 교실' },
    { period: 6, subject: '영어 I', teacher: 'Sarah Kim', room: '2-2 교실' },
    { period: 7, subject: '봉사활동', teacher: '김소연', room: '안팎 및 지역' },
  ],
  '금': [
    { period: 1, subject: '체육', teacher: '홍길동', room: '운동장' },
    { period: 2, subject: '화학 I', teacher: '이영희', room: '과학실 B' },
    { period: 3, subject: '문학', teacher: '이정민', room: '2-2 교실' },
    { period: 4, subject: '영어 I', teacher: 'Sarah Kim', room: '영어 전용실' },
    { period: 5, subject: '정치와 법', teacher: '조현재', room: '2-2 교실' },
    { period: 6, subject: '학급 자치', teacher: '김소연', room: '2-2 교실' },
    { period: 7, subject: '청소 및 조례', teacher: '김소연', room: '2-2 교실' },
  ],
};

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'n1',
    title: '📢 수학I 단원평가(수행평가) 일정 및 서술형 대비 안내',
    content: '다음 주 화요일(6월 16일) 2교시 수학 시간에 삼각함수 단원 수행평가를 실시합니다. 교과서 중단원 마무리 문제와 예제 수준으로 출제되니 꼼꼼히 풀어보고 넓이 공식 유치 잘 해오세요! 연습장과 필기도구 필참.',
    category: '긴급',
    date: '2026-06-11',
    author: '담임선생님',
    isPinned: true
  },
  {
    id: 'n2',
    title: '📝 영어 Book Report 에세이 제출 기한 엄수',
    content: '영어I 수행평가 독후감 에세이 제출 마감은 6월 18일(목) 자정까지입니다. 구글 클래스룸에 PDF 형식으로 제출하세요. 양식을 어기거나 연체 제출 시 감점이 있으니 미리 업로드해주세요.',
    category: '과제',
    date: '2026-06-10',
    author: '영어부장',
    isPinned: false
  },
  {
    id: 'n3',
    title: '🧴 개인 위생용품(물통, 치약/칫솔) 지참 및 교실 조석 환기',
    content: '체육 시간 이후 교실 문을 꼭 열어 환기해 주세요. 냉방 중이어도 4교시 종료 후 및 청소 시간에는 5분간 환기 필수입니다. 개인 머그컵이나 텀블러를 사용하여 일회용품 줄이기도 함께 실천합시다!',
    category: '일반',
    date: '2026-06-09',
    author: '환경부장',
    isPinned: false
  },
  {
    id: 'n4',
    title: '🎨 상현 예술제 반별 부스 운영 의견 수렴',
    content: '7월에 있을 상현 예술제 학급 부스로 무엇을 할 지 아이디어를 댓글이나 칭찬판에 적어주세요. 현재 후보는 타코야끼 판매, 공포의 방탈출, 미니 카지노 게임방입니다. 민주적으로 정해봅시다!',
    category: '행사',
    date: '2026-06-08',
    author: '반장',
    isPinned: false
  }
];

export const INITIAL_COMPLIMENTS: Compliment[] = [
  {
    id: 'c1',
    content: '체육 시간 직후에 에어컨 온도를 조금 더 시원하게 가동할 수 있도록 건의합니다! 교실이 너무 더워서 수업 집중이 안 돼요 ㅠㅠ',
    createdAt: '2026-07-06T10:40:00Z',
    color: 'yellow',
    emoji: '🔥',
    likes: 18
  },
  {
    id: 'c2',
    content: '수요일 청소 시간 단축 및 자치 조례를 5분 일찍 종료하는 안건을 청원합니다. 하교 길 학원 버스 배차 시간이 너무 빡빡합니다!',
    createdAt: '2026-07-06T09:15:00Z',
    color: 'blue',
    emoji: '📢',
    likes: 14
  },
  {
    id: 'c3',
    content: '교실 뒤편 분리수거함 옆에 소형 빗자루와 쓰레받기를 상시 비치해 주셨으면 좋겠습니다. 먼지가 너무 잘 쌓여요.',
    createdAt: '2026-07-05T14:30:00Z',
    color: 'green',
    emoji: '📌',
    likes: 9
  },
  {
    id: 'c4',
    content: '비가 올 때 복도가 많이 미끄럽습니다. 교실 앞뒤 문턱에 미끄럼 방지 패드나 매트를 깔아줄 것을 건의합니다!',
    createdAt: '2026-07-05T08:10:00Z',
    color: 'pink',
    emoji: '☔',
    likes: 11
  }
];

export const INITIAL_ROLES: ClassRole[] = [
  { id: 'r1', roleName: '칠판 도우미', description: '매 시간 종이 치기 전 칠판을 깨끗이 지우고 분필과 지우개를 정리합니다.', assignedTo: '김민우' },
  { id: 'r2', roleName: '멀티미디어 대장', description: '교실 컴퓨터 및 빔프로젝터 스크린 설정을 담당하며, 오작동 시 대처합니다.', assignedTo: '이지훈' },
  { id: 'r3', roleName: '정동 안내 (급식 인솔)', description: '급식실 이동 시 학급 줄을 맞추고 질서정연하게 이동하도록 인솔합니다.', assignedTo: '박서연, 정현우' },
  { id: 'r4', roleName: '그린 클린 (분리수거)', description: '교실 뒷문 쓰레기통 청결 및 수요일 분리수거 날 수거함 운반을 감독합니다.', assignedTo: '최아름, 윤성준' },
  { id: 'r5', roleName: '신선한 우유 구호', description: '매일 아침 학급 우유 바구니를 당직실 앞에서 수령하여 배부하고 박스를 반납합니다.', assignedTo: '강태현' },
  { id: 'r6', roleName: '에어컨/히터 제어', description: '적정 온도(냉방 26도, 난방 20도)를 유지하고 하교 시 전원을 반드시 차단합니다.', assignedTo: '안혜원' },
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  { id: 's1', title: '6월 전국연합학력평가', date: '2026-06-12', type: '시험', isDDay: true },
  { id: 's2', title: '1학기 2차 지필평가 (기말고사)', date: '2026-07-02', type: '시험', isDDay: true },
  { id: 's3', title: '상현 문화 예술 축제', date: '2026-07-16', type: '행사', isDDay: true },
  { id: 's4', title: '여름방학식', date: '2026-07-21', type: '휴일', isDDay: true },
  { id: 's5', title: '지구관 수련활동 (수학여행)', date: '2026-10-15', type: '행사', isDDay: false },
  { id: 's6', title: '개교기념일', date: '2026-11-20', type: '휴일', isDDay: false },
];

export const INITIAL_POLL: ClassPoll = {
  id: 'p_sportsday',
  question: '🏆 스포츠데이 상금으로 무엇을 먹을까요?',
  options: [
    { id: 'o1', text: '1. 떡볶이', votes: 15 },
    { id: 'o2', text: '2. 피자', votes: 11 },
    { id: 'o3', text: '3. 사과', votes: 2 },
    { id: 'o4', text: '4. 주스', votes: 4 },
    { id: 'o5', text: '5. 치킨', votes: 13 },
  ],
  totalVotes: 45,
  hasVoted: false
};

// Delicious school lunch fallback arrays if offline/API fails
export const FALLBACK_LUNCHES: { [key: number]: string[] } = {
  0: ['참치마요덮밥', '얼큰꽃게탕', '고추장김말이구이', '갈릭버터감자튀김', '수제포기김치', '요구르트 치즈케이크'], // Sun
  1: ['흑미밥', '한우곱창전골', '수제돈까스 & 브라운소스', '쫄면야채무침', '석박지', '한라봉 에이드'], // Mon
  2: ['오곡밥', '닭한마리곰탕', '대구식 납작만두구이', '비빔메밀국수', '깍두기', '요구르트'], // Tue
  3: ['수수밥', '마라부대찌개구이', '허니갈릭치킨덮밥', '청경채겉절이', '열무김치', '메로나아이스바'], // Wed
  4: ['단호박카레라이스', '미소장국', '코코넛콘쉬림프피자', '오리엔탈 드레싱 샐러드', '배추김치', '아침에사과 주스'], // Thu
  5: ['곤드레나물밥 & 양념장', '맑은 조개탕', '치즈볼 돈까스볶음', '감자채베이컨볶음', '동치미', '촉촉한 초코칩스위트'], // Fri
  6: ['스팸김치볶음밥', '매콤어묵탕', '감자핫도그', '허니버터아몬드', '석박지', '유기농 식혜'] // Sat
};
