/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScheduleItem } from '../types';
import { INITIAL_SCHEDULE } from '../utils/mockData';
import { CalendarRange, Plus, Trash2, Tag, CalendarCheck, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScheduleWidgetProps {
  currentTime: Date;
}

export default function ScheduleWidget({ currentTime }: ScheduleWidgetProps) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('class_schedules');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'시험' | '행사' | '학습' | '휴일'>('학습');

  const handleDelete = (id: string) => {
    if (window.confirm('이 일정을 학급 캘린더에서 제거할까요?')) {
      const filtered = schedules.filter(s => s.id !== id);
      setSchedules(filtered);
      localStorage.setItem('class_schedules', JSON.stringify(filtered));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const newItem: ScheduleItem = {
      id: `s-${Date.now()}`,
      title: title.trim(),
      date: date,
      type: type,
      isDDay: true
    };

    // Sort sorted chronologically
    const updated = [...schedules, newItem].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setSchedules(updated);
    localStorage.setItem('class_schedules', JSON.stringify(updated));

    // Reset Form
    setTitle('');
    setDate('');
    setType('학습');
    setIsAdding(false);
  };

  // D-Day Calculator depending on the live App time
  const getDDayString = (targetDateStr: string) => {
    const targetDate = new Date(targetDateStr);
    
    // Strip hours to check pure day differences
    const start = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());
    const end = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'D-Day';
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`; // For past events
  };

  const getBadgeClass = (itemType: string) => {
    switch (itemType) {
      case '시험': return 'bg-rose-50 text-rose-600 border-rose-100';
      case '행사': return 'bg-purple-50 text-purple-600 border-purple-100';
      case '휴일': return 'bg-blue-50 text-blue-600 border-blue-100';
      case '학습': default: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    }
  };

  // Chronologically sorted list
  const sortedSchedules = [...schedules].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div id="schedule-card" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="bg-purple-50 text-purple-600 p-2 rounded-xl">
            <CalendarRange className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-800">학사일정 & D-Day</h2>
            <p className="text-xs text-slate-400 mt-0.5">상현고 주요 시험, 축제, 방학 일정을 챙겨요</p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
            isAdding ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'text-purple-600 hover:bg-purple-50'
          }`}
        >
          {isAdding ? (
            <>
              <X className="w-3.5 h-3.5" />
              닫기
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              일정 등록
            </>
          )}
        </button>
      </div>

      {/* 일정 추가 폼 */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-5"
          >
            <form onSubmit={handleSubmit} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4 text-purple-500" />
                학급 일정 신규 생성
              </h3>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">일정 유형</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full text-xs p-2 bg-white border border-slate-250 rounded-lg focus:outline-none"
                  >
                    <option value="시험">지필/수행평가 📝</option>
                    <option value="행사">학교축제/체육대회 🎉</option>
                    <option value="학습">야간자율/특강 📚</option>
                    <option value="휴일">재량휴업/방학 🎈</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">날짜 선택</label>
                  <input
                    type="date"
                    value={date}
                    required
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-250 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">일정명</label>
                <input
                  type="text"
                  value={title}
                  placeholder="예: 기말고사 시작, 동아리 부스 신청"
                  maxLength={20}
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-250 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-2.5 py-1 text-xs bg-slate-200 text-slate-700 rounded-lg"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 text-xs text-white bg-purple-600 hover:bg-purple-700 rounded-lg font-bold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  일정 추가
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 일정 목록 */}
      <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
        {sortedSchedules.map((item, idx) => {
          const ddayLabel = getDDayString(item.date);
          const isExam = item.type === '시험';
          const isImportant = ddayLabel === 'D-Day' || (ddayLabel.startsWith('D-') && !ddayLabel.includes('+') && parseInt(ddayLabel.replace('D-', '')) <= 7);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`flex items-center justify-between p-3 border rounded-xl group hover:border-slate-200 transition-colors ${
                isImportant 
                  ? 'bg-rose-50/20 border-rose-100/70 shadow-2xs' 
                  : 'bg-slate-50/30 border-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold border ${getBadgeClass(item.type)}`}>
                  {item.type}
                </span>

                <div>
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(item.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-mono font-black border px-2 py-0.5 rounded-lg ${
                  ddayLabel === 'D-Day'
                    ? 'text-rose-600 bg-rose-100 border-rose-200 animate-pulse'
                    : ddayLabel.startsWith('D-') && !ddayLabel.includes('+')
                    ? 'text-amber-600 bg-amber-50 border-amber-100'
                    : 'text-slate-500 bg-slate-100 border-slate-200'
                }`}>
                  {ddayLabel}
                </span>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                  title="일정 삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
