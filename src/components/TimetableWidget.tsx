/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TimetableWeek, TimetableSubject } from '../types';
import { INITIAL_TIMETABLE } from '../utils/mockData';
import { BookOpen, Edit2, Save, X, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface TimetableWidgetProps {
  currentTime: Date;
}

export default function TimetableWidget({ currentTime }: TimetableWidgetProps) {
  const [timetable, setTimetable] = useState<TimetableWeek>(() => {
    const saved = localStorage.getItem('class_timetable');
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
  });
  
  const days: Array<'월' | '화' | '수' | '목' | '금'> = ['월', '화', '수', '목', '금'];
  
  // Detemine current day of week in Korean (월, 화, 수, 목, 금, 토, 일)
  const currentDayOfWeekIdx = currentTime.getDay(); // 0 is Sun, 1 is Mon, 6 is Sat
  const dayNameMapping: { [key: number]: '월' | '화' | '수' | '목' | '금' | '' } = {
    1: '월', 2: '화', 3: '수', 4: '목', 5: '금'
  };
  const activeDayToday = dayNameMapping[currentDayOfWeekIdx] || '월';

  const [selectedDay, setSelectedDay] = useState<'월' | '화' | '수' | '목' | '금'>(activeDayToday);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSubjects, setEditedSubjects] = useState<TimetableWeek>(JSON.parse(JSON.stringify(timetable)));
  const [currentPeriod, setCurrentPeriod] = useState<number | '점심' | '조례' | '방과후' | null>(null);

  // Monitor period times
  useEffect(() => {
    const hour = currentTime.getHours();
    const min = currentTime.getMinutes();
    const totalMin = hour * 60 + min;

    // Standard school schedule time blocks (in total minutes)
    // 08:30 - 08:50 (조례)
    // 1교시: 09:00 - 09:50
    // 2교시: 10:00 - 10:50
    // 3교시: 11:00 - 11:50
    // 4교시: 12:00 - 12:50
    // 점심시간: 12:50 - 13:50 (770 - 830)
    // 5교시: 13:50 - 14:40
    // 6교시: 14:55 - 15:45
    // 7교시: 15:55 - 16:45

    if (totalMin >= 510 && totalMin < 530) {
      setCurrentPeriod('조례');
    } else if (totalMin >= 540 && totalMin < 590) {
      setCurrentPeriod(1);
    } else if (totalMin >= 600 && totalMin < 650) {
      setCurrentPeriod(2);
    } else if (totalMin >= 660 && totalMin < 710) {
      setCurrentPeriod(3);
    } else if (totalMin >= 720 && totalMin < 770) {
      setCurrentPeriod(4);
    } else if (totalMin >= 770 && totalMin < 830) {
      setCurrentPeriod('점심');
    } else if (totalMin >= 830 && totalMin < 880) {
      setCurrentPeriod(5);
    } else if (totalMin >= 895 && totalMin < 945) {
      setCurrentPeriod(6);
    } else if (totalMin >= 955 && totalMin < 1005) {
      setCurrentPeriod(7);
    } else if (totalMin >= 1005 || totalMin < 510) {
      setCurrentPeriod('방과후');
    } else {
      setCurrentPeriod(null); // 쉬는시간 (Break time)
    }
  }, [currentTime]);

  const handleStartEdit = () => {
    setEditedSubjects(JSON.parse(JSON.stringify(timetable)));
    setIsEditing(true);
  };

  const handleSave = () => {
    setTimetable(editedSubjects);
    localStorage.setItem('class_timetable', JSON.stringify(editedSubjects));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleReset = () => {
    if (window.confirm('시간표를 기본 설정으로 초기화하시겠습니까?')) {
      setTimetable(INITIAL_TIMETABLE);
      localStorage.setItem('class_timetable', JSON.stringify(INITIAL_TIMETABLE));
      setEditedSubjects(JSON.parse(JSON.stringify(INITIAL_TIMETABLE)));
      setIsEditing(false);
    }
  };

  const handleChangeSubject = (day: '월' | '화' | '수' | '목' | '금', idx: number, field: 'subject' | 'teacher' | 'room', val: string) => {
    const next = { ...editedSubjects };
    next[day][idx] = {
      ...next[day][idx],
      [field]: val
    };
    setEditedSubjects(next);
  };

  const activeSubjects = isEditing ? editedSubjects[selectedDay] : timetable[selectedDay];

  // Helper values for current status panel
  const getKoreaPeriodLabel = () => {
    if (currentPeriod === '조례') return '🌅 조회 및 아침 자습';
    if (currentPeriod === '점심') return '🍴 맛있는 점심 시간';
    if (currentPeriod === '방과후') return '🏠 종례 및 하교';
    if (currentPeriod && typeof currentPeriod === 'number') {
      const liveSubMap = timetable[activeDayToday]?.find(s => s.period === currentPeriod);
      return `⏰ ${currentPeriod}교시 수업 중 (${liveSubMap?.subject || '자유'})`;
    }
    return '☕ 쉬는 시간';
  };

  return (
    <div id="timetable-card" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-800">오늘의 시간표</h2>
            <p className="text-xs text-slate-400 mt-0.5">매일매일 과목과 일정을 확인하세요</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleReset}
                title="기본 시간표로 초기화"
                className="p-1 px-2.5 text-xs text-rose-500 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                초기화
              </button>
              <button
                onClick={handleSave}
                className="p-1 px-3 text-xs text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 font-medium"
              >
                <Save className="w-3.5 h-3.5" />
                저장
              </button>
              <button
                onClick={handleCancel}
                className="p-1 px-3 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                취소
              </button>
            </>
          ) : (
            <button
              onClick={handleStartEdit}
              className="p-1.5 text-xs text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              편집하기
            </button>
          )}
        </div>
      </div>

      {/* 실시간 수업 안내 배너 */}
      <div className={`mb-5 p-3 rounded-xl border flex items-center justify-between transition-colors ${
        currentPeriod && typeof currentPeriod === 'number'
          ? 'bg-blue-50/50 border-blue-100 text-blue-800'
          : currentPeriod === '점심'
          ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800'
          : 'bg-slate-50 border-slate-100 text-slate-600'
      }`}>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              currentPeriod && typeof currentPeriod === 'number' ? 'bg-blue-500' : currentPeriod === '점심' ? 'bg-emerald-500' : 'bg-slate-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              currentPeriod && typeof currentPeriod === 'number' ? 'bg-blue-600' : currentPeriod === '점심' ? 'bg-emerald-600' : 'bg-slate-500'
            }`}></span>
          </span>
          {getKoreaPeriodLabel()}
        </div>
        
        {/* 교시표 안내 팁 */}
        <span className="text-[10px] text-slate-400 font-normal">
          {currentTime.getDay() === 0 || currentTime.getDay() === 6 ? '즐거운 주말 보장 🎉' : `상현고 2학년 2반 기준`}
        </span>
      </div>

      {/* 요일 탭 레이아웃 */}
      <div className="flex rounded-xl bg-slate-100/80 p-1 mb-5">
        {days.map((day) => {
          const isToday = activeDayToday === day;
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 text-center py-2 text-sm font-medium rounded-lg transition-all relative ${
                isSelected
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                {day}요일
                {isToday && (
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full inline-block" title="오늘" />
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* 과목 리스트 */}
      <div className="space-y-2.5">
        {activeSubjects.map((subject, idx) => {
          const isLiveNow = activeDayToday === selectedDay && currentPeriod === subject.period;
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isLiveNow
                  ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/15 scale-[1.01]'
                  : 'bg-slate-50/50 hover:bg-slate-50 border-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold leading-none shrink-0 ${
                  isLiveNow
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200/60 text-slate-600'
                }`}>
                  {subject.period}
                </div>

                {isEditing ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={subject.subject}
                      onChange={(e) => handleChangeSubject(selectedDay, idx, 'subject', e.target.value)}
                      className="p-1 px-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg max-w-[120px]"
                      placeholder="과목명"
                    />
                    <input
                      type="text"
                      value={subject.teacher || ''}
                      onChange={(e) => handleChangeSubject(selectedDay, idx, 'teacher', e.target.value)}
                      className="p-1 px-2 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg max-w-[80px]"
                      placeholder="교사명"
                    />
                    <input
                      type="text"
                      value={subject.room || ''}
                      onChange={(e) => handleChangeSubject(selectedDay, idx, 'room', e.target.value)}
                      className="p-1 px-2 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg max-w-[80px]"
                      placeholder="교실"
                    />
                  </div>
                ) : (
                  <div>
                    <h4 className={`font-semibold text-sm ${isLiveNow ? 'text-white' : 'text-slate-800'}`}>
                      {subject.subject}
                    </h4>
                    <p className={`text-[11px] mt-0.5 ${isLiveNow ? 'text-blue-100' : 'text-slate-400'}`}>
                      {subject.teacher ? `${subject.teacher} 선생님` : '담당 부장'}
                    </p>
                  </div>
                )}
              </div>

              {!isEditing && (
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  isLiveNow
                    ? 'bg-white/15 text-white'
                    : 'bg-white text-slate-500 border border-slate-100 shadow-xs'
                }`}>
                  {subject.room || '교실'}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
