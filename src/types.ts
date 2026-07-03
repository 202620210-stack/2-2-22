/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TimetableSubject {
  period: number; // 1 to 7
  subject: string;
  teacher?: string;
  room?: string;
}

export type TimetableWeek = {
  [key in '월' | '화' | '수' | '목' | '금']: TimetableSubject[];
};

export type NoticeCategory = '과제' | '준비물' | '행사' | '일반' | '긴급';

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  date: string;
  author: string;
  isPinned: boolean;
}

export interface Compliment {
  id: string;
  content: string;
  createdAt: string;
  color: 'yellow' | 'purple' | 'green' | 'pink' | 'blue';
  emoji: string;
  likes: number;
}

export interface Meal {
  dishes: string[];
  calories: string;
  nutrition?: string[];
  date: string; // YYYYMMDD
}

export interface MealReview {
  id: string;
  author: string;
  rating: number; // 1 to 5
  content: string;
  createdAt: string;
}

export interface ClassRole {
  id: string;
  roleName: string;
  description: string;
  assignedTo: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: '시험' | '행사' | '학습' | '휴일';
  isDDay: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface ClassPoll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  hasVoted: boolean;
  selectedOptionId?: string;
}
