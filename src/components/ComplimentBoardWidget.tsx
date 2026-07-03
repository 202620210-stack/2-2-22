/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compliment } from '../types';
import { INITIAL_COMPLIMENTS } from '../utils/mockData';
import { Heart, Send, Sparkles, Smile, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ComplimentBoardWidget() {
  const [compliments, setCompliments] = useState<Compliment[]>(() => {
    const saved = localStorage.getItem('class_compliments');
    return saved ? JSON.parse(saved) : INITIAL_COMPLIMENTS;
  });

  const [content, setContent] = useState('');
  const [color, setColor] = useState<'yellow' | 'purple' | 'green' | 'pink' | 'blue'>('yellow');
  const [selectedEmoji, setSelectedEmoji] = useState('🍀');

  const emojis = ['🍀', '💖', '😇', '⚽', '🧪', '🎉', '💯', '🍰', '😺', '🌟'];

  const postItColors = {
    yellow: { bg: 'bg-amber-100 border-amber-250 text-amber-900', hover: 'hover:bg-amber-150', accent: 'bg-amber-200' },
    pink: { bg: 'bg-rose-100 border-rose-250 text-rose-900', hover: 'hover:bg-rose-150', accent: 'bg-rose-200' },
    green: { bg: 'bg-emerald-100 border-emerald-250 text-emerald-900', hover: 'hover:bg-emerald-150', accent: 'bg-emerald-200' },
    blue: { bg: 'bg-sky-100 border-sky-250 text-sky-900', hover: 'hover:bg-sky-150', accent: 'bg-sky-200' },
    purple: { bg: 'bg-violet-100 border-violet-250 text-violet-900', hover: 'hover:bg-violet-150', accent: 'bg-violet-200' }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (content.length > 80) {
      alert('칭찬 한마디는 80자 이내로 입력해 주세요!');
      return;
    }

    const newCompliment: Compliment = {
      id: `c-${Date.now()}`,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      color: color,
      emoji: selectedEmoji,
      likes: 0
    };

    const updated = [newCompliment, ...compliments];
    setCompliments(updated);
    localStorage.setItem('class_compliments', JSON.stringify(updated));

    // Reset fields
    setContent('');
    setSelectedEmoji('🍀');
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = compliments.map(c => {
      if (c.id === id) {
        return { ...c, likes: c.likes + 1 };
      }
      return c;
    });
    setCompliments(updated);
    localStorage.setItem('class_compliments', JSON.stringify(updated));
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = compliments.filter(c => c.id !== id);
    setCompliments(filtered);
    localStorage.setItem('class_compliments', JSON.stringify(filtered));
  };

  return (
    <div id="compliment-card" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="bg-amber-50 text-amber-500 p-2 rounded-xl">
            <Sparkles className="w-5 h-5 fill-amber-100" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-800">칭찬 한마디 (응원 게시판)</h2>
            <p className="text-xs text-slate-400 mt-0.5">2반 친구들에게 소소한 고마움과 응원을 전해 보아요</p>
          </div>
        </div>
      </div>

      {/* 작성 폼 */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50/80 border border-slate-100 rounded-2xl space-y-3.5">
        <div className="flex items-start gap-3">
          <div className="text-2xl mt-1 shrink-0 p-1 bg-white rounded-xl shadow-xs border border-slate-100">
            {selectedEmoji}
          </div>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="친구 칭찬이나 따뜻한 응원을 80자 이내로 적어보세요! (예: 민재야 오늘 지우개 건네줘서 땡큐)"
              required
              maxLength={80}
              rows={2}
              className="w-full text-xs p-2 bg-transparent border-none focus:outline-none placeholder-slate-400 resize-none leading-relaxed"
            />
            {/* 글자수 카운터 */}
            <div className="text-[10px] text-slate-400 text-right mt-1 font-mono">
              {content.length} / 80자
            </div>
          </div>
        </div>

        {/* 옵션 선택 및 등록 */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1.5 border-t border-slate-200/50">
          <div className="flex flex-wrap gap-2.5 items-center">
            {/* 포스트잇 색상 선택 */}
            <span className="text-[11px] font-semibold text-slate-400">쪽지색:</span>
            <div className="flex gap-1.5">
              {(Object.keys(postItColors) as Array<keyof typeof postItColors>).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setColor(key)}
                  className={`w-5.5 h-5.5 rounded-full border transition-transform ${
                    key === 'yellow' ? 'bg-amber-200 border-amber-350' : 
                    key === 'pink' ? 'bg-rose-250 border-rose-350' : 
                    key === 'green' ? 'bg-emerald-250 border-emerald-350' : 
                    key === 'blue' ? 'bg-sky-250 border-sky-350' : 
                    'bg-violet-200 border-violet-350'
                  } ${color === key ? 'scale-120 ring-1 ring-slate-850 ring-offset-1' : 'opacity-80 hover:opacity-100'}`}
                  title={`${key} 쪽지`}
                />
              ))}
            </div>

            {/* 대표 이모지 선택 */}
            <span className="text-[11px] font-semibold text-slate-400 ml-1.5">이모지:</span>
            <div className="flex gap-1 overflow-x-auto max-w-[140px] sm:max-w-none scrollbar-none">
              {emojis.slice(0, 5).map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setSelectedEmoji(e)}
                  className={`text-sm p-0.5 rounded-lg transition-transform ${
                    selectedEmoji === e ? 'bg-white shadow-xs scale-120 border border-slate-100' : 'hover:scale-110 opacity-70 hover:opacity-100'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="p-2 px-4 rounded-xl text-xs font-semibold text-white shadow-xs flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all"
            style={{ backgroundColor: '#5c85d6' }}
          >
            <Send className="w-3.5 h-3.5" />
            보내기
          </button>
        </div>
      </form>

      {/* 포스트잇 보드 공간 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto p-1.5 border border-dashed border-slate-100 rounded-2xl scrollbar-xs">
        <AnimatePresence initial={false}>
          {compliments.length > 0 ? (
            compliments.map((comp) => {
              const colorTheme = postItColors[comp.color] || postItColors.yellow;
              return (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
                  animate={{ opacity: 1, scale: 1, rotate: Math.sin(comp.id.charCodeAt(5)) * 2 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.02, rotate: 0, zIndex: 10 }}
                  className={`p-4 rounded-2xl border flex flex-col justify-between shadow-xs transition-shadow relative group ${colorTheme.bg}`}
                  style={{ minHeight: '140px' }}
                >
                  {/* 포스트잇 한가운데 상단 접기핀 효과 */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-white/40 shadow-xs border-b border-black/5" />

                  {/* 이모지와 지우기 버튼 */}
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-xl inline-flex items-center justify-center w-7 h-7 bg-white/60 rounded-lg shadow-2xs">
                      {comp.emoji}
                    </span>
                    
                    <button
                      onClick={(e) => handleDelete(comp.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-700 hover:bg-white/40 rounded-lg transition-all"
                      title="메모 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 칭찬 글귀 */}
                  <p className="text-xs leading-relaxed font-medium break-all flex-1 whitespace-pre-wrap">
                    {comp.content}
                  </p>

                  {/* 하단 좋아요 & 생성시각 */}
                  <div className="flex justify-between items-center pt-2.5 mt-2.5 border-t border-black/5">
                    <span className="text-[9px] opacity-60">
                      {new Date(comp.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <button
                      onClick={(e) => handleLike(comp.id, e)}
                      className="flex items-center gap-1.5 p-1 px-2 text-[11px] font-bold rounded-full bg-white/75 hover:bg-white shadow-2xs transition-transform active:scale-115 border border-black/5"
                    >
                      <Heart className={`w-3.5 h-3.5 text-rose-500 ${comp.likes > 0 ? 'fill-rose-500' : ''}`} />
                      <span>{comp.likes}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-1 sm:col-span-2 text-center py-16 text-slate-400">
              <Smile className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">아직 도착한 칭찬 쪽지가 없어요.</p>
              <p className="text-[10px] opacity-70 mt-1">용기 내어 첫 칭찬 포스트잇을 전해보세요!</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
