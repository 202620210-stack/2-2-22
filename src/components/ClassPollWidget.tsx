/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClassPoll, PollOption } from '../types';
import { INITIAL_POLL } from '../utils/mockData';
import { BarChart3, HelpCircle, Gift, Sparkles, RefreshCw, Trophy, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ClassPollWidget() {
  const [poll, setPoll] = useState<ClassPoll>(() => {
    const saved = localStorage.getItem('class_poll');
    return saved ? JSON.parse(saved) : INITIAL_POLL;
  });

  // State for lucky number drawer
  const [luckyNum, setLuckyNum] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [fortuneText, setFortuneText] = useState('');

  // Handle vote registration
  const handleVote = (optionId: string) => {
    if (poll.hasVoted) return;

    const nextOptions = poll.options.map(opt => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });

    const nextPoll: ClassPoll = {
      ...poll,
      options: nextOptions,
      totalVotes: poll.totalVotes + 1,
      hasVoted: true,
      selectedOptionId: optionId
    };

    setPoll(nextPoll);
    localStorage.setItem('class_poll', JSON.stringify(nextPoll));
  };

  // Revoke/Reset vote to test other answers
  const handleResetVote = () => {
    if (!poll.hasVoted || !poll.selectedOptionId) return;

    const nextOptions = poll.options.map(opt => {
      if (opt.id === poll.selectedOptionId) {
        return { ...opt, votes: Math.max(0, opt.votes - 1) };
      }
      return opt;
    });

    const nextPoll: ClassPoll = {
      ...poll,
      options: nextOptions,
      totalVotes: Math.max(0, poll.totalVotes - 1),
      hasVoted: false,
      selectedOptionId: undefined
    };

    setPoll(nextPoll);
    localStorage.setItem('class_poll', JSON.stringify(nextPoll));
  };

  // Run the lucky number drawing lotto
  const handleDrawLuckyNumber = () => {
    if (isDrawing) return;
    
    setIsDrawing(true);
    setLuckyNum(null);
    setFortuneText('');

    let ticksCount = 0;
    const intervalTime = 80; // milliseconds
    const maxTicks = 18;

    const fortunes = [
      '🎉 오늘 급식실 1등 입장 하이패스 기운이 감돌고 있습니다!',
      '📚 오늘 5교시 영어 시간에 선생님의 질문 세례를 기막히게 피해갈 행운아!',
      '🌸 아침에 등교할 때 버스나 신호등 대기 없이 1초 컷으로 들어올 행운의 주인공!',
      '💖 오늘 하루 온 2반 친구들이 네 말에 100% 공감해주고 리액션 보장해줌!',
      '🍀 오늘 매점 갔을 때 평소 좋아하던 주스/소시지 마지막 수량이 네 손에 들림!',
      '🧪 오늘 과학 수행 평가에서 소수점 보정 럭키 보너스를 듬뿍 탈 운세를 가짐!',
      '⚽ 오늘 체육 시간 대항구에서 슈팅하는 족족 상대 진영 골망을 흔들 대천재!',
      '🌟 혹시라도 사물함 자물쇠 번호나 가방 비밀번호 잊어버려도 바로 풀릴 신비한 촉!'
    ];

    const interval = setInterval(() => {
      // Class num range: typically 1 to 30 in Korea
      const tempNum = Math.floor(Math.random() * 30) + 1;
      setLuckyNum(tempNum);
      ticksCount++;

      if (ticksCount >= maxTicks) {
        clearInterval(interval);
        
        // Finalize number and associate a fortune
        const finalNum = Math.floor(Math.random() * 30) + 1;
        setLuckyNum(finalNum);
        
        // Match fortune according to final number index to keep it deterministic but fun
        const fortuneIdx = finalNum % fortunes.length;
        setFortuneText(fortunes[fortuneIdx]);
        setIsDrawing(false);
      }
    }, intervalTime);
  };

  return (
    <div id="school-poll-card" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow space-y-6">
      
      {/* 1. 학급 설문 투표 */}
      <div className="pb-5 border-b border-slate-100">
        <div className="flex items-center justify-between pb-3.5 mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl">
              <BarChart3 className="w-4.5 h-4.5 text-[#5c85d6]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">오늘의 학급 찬반/투표</h3>
              <p className="text-[11px] text-slate-400">학급 자치 회의 전 우리의 진짜 의견을 조율해 봐요</p>
            </div>
          </div>

          {poll.hasVoted && (
            <button
              onClick={handleResetVote}
              className="p-1 px-2.5 text-[10px] text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg flex items-center gap-1 transition-all"
              title="다시 투표하기"
            >
              <RefreshCw className="w-3 h-3 animate-spin duration-1500" />
              투표 변경
            </button>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-750 p-3 bg-slate-50/50 rounded-xl leading-relaxed border border-slate-105-0">
            {poll.question}
          </h4>

          {/* 설문 선택지 */}
          <div className="space-y-2.5">
            {poll.options.map((option) => {
              const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
              const isSelected = poll.selectedOptionId === option.id;

              return (
                <div key={option.id} className="relative">
                  {poll.hasVoted ? (
                    /* 투표 완료 상태: 결과 그래프 바 */
                    <div className="w-full text-xs p-3 px-3.5 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden relative flex justify-between items-center">
                      
                      {/* 차트 가로 바 */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className={`absolute left-0 top-0 bottom-0 ${
                          isSelected ? 'bg-blue-105-0/12' : 'bg-slate-100/70'
                        }`}
                        style={{ backgroundColor: isSelected ? 'rgba(92, 133, 214, 0.12)' : undefined }}
                      />

                      <span className={`relative font-semibold z-10 ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                        {isSelected && '✅ '}
                        {option.text}
                      </span>
                      
                      <span className={`relative font-bold font-mono z-10 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                        {option.votes}표 ({percentage}%)
                      </span>
                    </div>
                  ) : (
                    /* 투표 미참여 상태: 선택 버튼 */
                    <button
                      onClick={() => handleVote(option.id)}
                      className="w-full text-left text-xs p-3 px-3.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all cursor-pointer hover:translate-x-0.5 font-medium text-slate-700"
                    >
                      {option.text}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* 총 참여수 표기 */}
          <div className="flex justify-between items-center pl-1 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-350" />
              총 {poll.totalVotes}명 참여 완료
            </span>
            <span>민주 학급 자치 규정 준수 🕊️</span>
          </div>
        </div>
      </div>

      {/* 2. 오늘의 행운 추첨회 */}
      <div>
        <div className="flex items-center justify-between pb-3.5 mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-amber-50 text-amber-600 p-2 rounded-xl">
              <Gift className="w-4.5 h-4.5 text-[#55b399]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">오늘의 럭키 행운 추첨</h3>
              <p className="text-[11px] text-slate-400">오늘 기분 좋은 행운을 탈 2학년 2반의 등번호는?</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 border border-slate-150-0 rounded-2xl flex flex-col md:flex-row items-center justify-around gap-4">
          
          {/* 번호판 룰렛 애니메이션 */}
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-indigo-250" style={{ backgroundColor: '#5c85d6' }} />
              
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={luckyNum || 'ready'}
                  initial={{ y: isDrawing ? 15 : 0, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: isDrawing ? -15 : 0, opacity: 0 }}
                  transition={{ duration: 0.08 }}
                  className="text-2xl font-black font-mono text-slate-800"
                >
                  {luckyNum ? `${luckyNum}번` : '✨'}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* 설명 및 추첨 버튼 */}
          <div className="flex-1 text-center md:text-left space-y-2">
            {luckyNum && fortuneText ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-1"
              >
                <div className="text-[11px] font-extrabold text-blue-700 flex items-center gap-1 justify-center md:justify-start">
                  <Trophy className="w-3.5 h-3.5 animate-bounce text-amber-500 fill-amber-500" />
                  당첨 등번호: {luckyNum}번 친구 축하해요!
                </div>
                <p className="text-xs text-slate-600 leading-normal font-semibold">
                  {fortuneText}
                </p>
              </motion.div>
            ) : (
              <div>
                <p className="text-xs text-slate-600 font-bold">등교 전, 기분 전환을 위한 럭키 박스를 열어보세요!</p>
                <p className="text-[10px] text-slate-400 mt-1">번호 추첨을 돌려 오늘의 행운 한마디를 받아가세요.</p>
              </div>
            )}

            <div className="pt-1.5 flex justify-center md:justify-start">
              <button
                onClick={handleDrawLuckyNumber}
                disabled={isDrawing}
                className="p-2 px-4 rounded-xl text-xs font-bold text-white shadow-xs hover:shadow-md flex items-center gap-1.5 disabled:opacity-50 active:scale-95 transition-all"
                style={{ backgroundColor: '#55b399' }}
              >
                <Sparkles className="w-4 h-4 animate-spin-slow text-amber-100" />
                {isDrawing ? '번호 셔플 중...' : '번호 추첨하기'}
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
