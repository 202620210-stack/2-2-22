/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClassPoll, PollOption } from '../types';
import { INITIAL_POLL } from '../utils/mockData';
import { BarChart3, RefreshCw, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function ClassPollWidget() {
  const [poll, setPoll] = useState<ClassPoll>(() => {
    const saved = localStorage.getItem('class_poll_sportsday');
    return saved ? JSON.parse(saved) : INITIAL_POLL;
  });

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
    localStorage.setItem('class_poll_sportsday', JSON.stringify(nextPoll));
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
    localStorage.setItem('class_poll_sportsday', JSON.stringify(nextPoll));
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

    </div>
  );
}
