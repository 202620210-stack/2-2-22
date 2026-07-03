/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, Smile, ChevronRight, GraduationCap, Github } from 'lucide-react';
import { motion } from 'motion/react';

// Import our modular sub-widgets
import TimetableWidget from './components/TimetableWidget';
import NoticeBoardWidget from './components/NoticeBoardWidget';
import ComplimentBoardWidget from './components/ComplimentBoardWidget';
import MealWidget from './components/MealWidget';
import ScheduleWidget from './components/ScheduleWidget';
import RolesWidget from './components/RolesWidget';
import ClassPollWidget from './components/ClassPollWidget';

export default function App() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Set up second ticks for header clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format real-time Korean clock
  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    return date.toLocaleDateString('ko-KR', options);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* ==================== 1. HEADER BANNER ==================== */}
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden shadow-sm"
          style={{ 
            background: 'linear-gradient(135deg, #5c85d6 0%, #55b399 100%)' 
          }}
        >
          {/* Decorative background visual elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/5 rounded-full -mb-12 blur-lg pointer-events-none" />

          {/* Title & Slogan */}
          <div className="relative z-10 space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="bg-white/15 px-2.5 py-1 rounded-lg text-xs font-bold font-mono tracking-wider shadow-2xs">
                Grade 2, Class 2
              </span>
              <span className="text-[11px] bg-[#2c1d1a]/20 px-2 py-0.5 rounded-md font-semibold text-emerald-100 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                상현고등학교 🏫
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-none flex items-center gap-2.5 pt-1">
              우리들의 공간
              <Smile className="w-6.5 h-6.5 text-yellow-200 fill-yellow-250 animate-bounce duration-3000" />
            </h1>
            
            <p className="text-xs md:text-sm text-white/90 font-medium">
              서로 소통하고 칭찬하며 유쾌한 교실을 가꾸는 2학년 2반의 학급 자치 대시보드입니다.
            </p>
          </div>

          {/* Clock Widget */}
          <div className="relative z-10 bg-white/12 border border-white/20 p-3.5 px-5 rounded-2xl flex items-center gap-3 shadow-2xs backdrop-blur-md">
            <div className="bg-white/20 p-2 rounded-xl text-yellow-100">
              <Clock className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <span className="block text-[10px] text-emerald-100 font-bold uppercase tracking-wider">
                현재 시간 통보 (KST)
              </span>
              <span className="text-xs md:text-sm font-mono font-bold tracking-tight">
                {formatTime(currentTime)}
              </span>
            </div>
          </div>
        </motion.header>

        {/* ==================== 2. MAIN BENTO GRID ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT 2/3 COLUMN (TIMETABLE, NOTICE, COMPLIMENTS PART) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 시간표 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <TimetableWidget currentTime={currentTime} />
            </motion.div>

            {/* 알림장 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <NoticeBoardWidget />
            </motion.div>

            {/* 칭찬판 포스트잇 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ComplimentBoardWidget />
            </motion.div>

          </div>

          {/* RIGHT 1/3 COLUMN (MEALS, CALENDAR, ROLES, POLLS) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 오늘의 급식 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <MealWidget currentTime={currentTime} />
            </motion.div>

            {/* 학사일정 및 디데이 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ScheduleWidget currentTime={currentTime} />
            </motion.div>

            {/* 1인 1역 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <RolesWidget />
            </motion.div>

            {/* 학급 투표 및 운세 추첨 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ClassPollWidget />
            </motion.div>

          </div>

        </div>

        {/* ==================== 3. FOOTER ==================== */}
        <footer className="pt-8 border-t border-slate-200/60 pb-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold">
            <span>상현고등학교 2학년 2반 자치회</span>
            <span>•</span>
            <span>대시보드 버전 v1.0</span>
          </div>
          <p className="text-[10px] text-slate-400 max-w-md mx-auto leading-normal">
            본 사이트는 2학년 2반 학생들의 편의를 위해 자율적으로 운영되는 비상업적 학급 인트라넷 대시보드이며, 급식 등 공공 데이터 출처는 나이스(NEIS) 교육포털입니다.
          </p>
        </footer>

      </div>
    </div>
  );
}
