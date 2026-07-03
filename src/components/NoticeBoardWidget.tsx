/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Notice, NoticeCategory } from '../types';
import { INITIAL_NOTICES } from '../utils/mockData';
import { Megaphone, Search, Pin, Plus, Calendar, User, Trash2, Check, X, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function NoticeBoardWidget() {
  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('class_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | '전체'>('전체');
  const [isAdding, setIsAdding] = useState(false);
  
  // Notice Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('일반');
  const [author, setAuthor] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const handleDelete = (id: string) => {
    if (window.confirm('이 알림사항을 삭제하시겠습니까?')) {
      const filtered = notices.filter(n => n.id !== id);
      setNotices(filtered);
      localStorage.setItem('class_notices', JSON.stringify(filtered));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해 주세요.');
      return;
    }

    const newNotice: Notice = {
      id: `n-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category: category,
      date: new Date().toISOString().split('T')[0],
      author: author.trim() || '익명',
      isPinned: isPinned
    };

    const updated = [newNotice, ...notices];
    setNotices(updated);
    localStorage.setItem('class_notices', JSON.stringify(updated));

    // Reset fields
    setTitle('');
    setContent('');
    setCategory('일반');
    setAuthor('');
    setIsPinned(false);
    setIsAdding(false);
  };

  // Categories helper
  const categories: Array<NoticeCategory | '전체'> = ['전체', '긴급', '과제', '준비물', '행사', '일반'];

  const getCategoryClass = (cat: NoticeCategory) => {
    switch (cat) {
      case '긴급': return 'bg-rose-50 text-rose-600 border-rose-100';
      case '과제': return 'bg-amber-50 text-amber-600 border-amber-100';
      case '준비물': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case '행사': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case '일반': default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  // Filter notices
  const filteredNotices = notices.filter(notice => {
    const categoryMatches = selectedCategory === '전체' || notice.category === selectedCategory;
    const searchMatches = notice.title.toLowerCase().includes(search.toLowerCase()) || 
                          notice.content.toLowerCase().includes(search.toLowerCase()) || 
                          notice.author.toLowerCase().includes(search.toLowerCase());
    return categoryMatches && searchMatches;
  });

  // Separate pinned vs standard
  const pinnedNotices = filteredNotices.filter(n => n.isPinned);
  const unpinnedNotices = filteredNotices.filter(n => !n.isPinned);
  const displayNotices = [...pinnedNotices, ...unpinnedNotices];

  return (
    <div id="notice-card" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="bg-rose-50 text-rose-500 p-2 rounded-xl">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-800">전달 사항 (알림장)</h2>
            <p className="text-xs text-slate-400 mt-0.5">과제, 준비물 및 학급 주요 소식을 한눈에 체크해요</p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`p-2 px-3.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
            isAdding 
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
              : 'bg-indigo-650 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-105-0/10'
          }`}
          style={{ backgroundColor: isAdding ? undefined : '#5c85d6' }}
        >
          {isAdding ? (
            <>
              <X className="w-4 h-4" />
              닫기
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              새 소식 쓰기
            </>
          )}
        </button>
      </div>

      {/* 새 소식 글쓰기 영역 */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <form onSubmit={handleSubmit} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3.5">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#5c85d6]" />
                새 알림 등록하기
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">분류</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                    <option value="일반">일반</option>
                    <option value="긴급">긴급 🚨</option>
                    <option value="과제">과제 📝</option>
                    <option value="준비물">준비물 🎒</option>
                    <option value="행사">행사 🎨</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">작성자</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="예: 반장, 담임쌤"
                    maxLength={10}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-end pb-1.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                      <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      상단 고정 (중요)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">알림 제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="간결하고 눈에 띄는 제목을 입력하세요"
                  required
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">전달 내용</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="친구들에게 공지할 세부 사항을 자세히 작성해 주세요"
                  rows={3}
                  required
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-medium text-white shadow-sm hover:bg-indigo-700 flex items-center gap-1 transition-colors"
                  style={{ backgroundColor: '#5c85d6' }}
                >
                  <Check className="w-4.5 h-4.5" />
                  등록 완료
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 필터 및 검색 바 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="제목, 내용 또는 작성자로 검색하세요..."
            className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50/80 border border-slate-100 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transitions-colors"
          />
        </div>

        {/* 분류 캐러셀 */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-800 border-slate-800 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 알림사항 리스트 */}
      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
        {displayNotices.length > 0 ? (
          displayNotices.map((notice, idx) => (
            <motion.div
              layoutId={notice.id}
              key={notice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`p-4 border rounded-2xl relative group hover:shadow-sm transition-all ${
                notice.isPinned 
                  ? 'bg-amber-50/30 border-amber-100/80' 
                  : 'bg-slate-50/20 border-slate-100'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
                <div className="flex items-center gap-2">
                  {notice.isPinned && (
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-0.5 shadow-xs shrink-0">
                      <Pin className="w-3 h-3 fill-amber-700 text-amber-700" />
                      중요 공지
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${getCategoryClass(notice.category)}`}>
                    {notice.category}
                  </span>
                  
                  <span className="text-slate-400 text-[11px] flex items-center gap-1 pl-1">
                    <User className="w-3 h-3 text-slate-300" />
                    {notice.author}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-300" />
                    {notice.date}
                  </span>

                  <button
                    onClick={() => handleDelete(notice.id)}
                    className="opacity-0 group-hover:opacity-150 p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    title="알림 지우기"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="font-bold text-sm text-slate-800 mb-1.5 group-hover:text-slate-900 transition-colors">
                {notice.title}
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed whitespace-pre-wrap">
                {notice.content}
              </p>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 bg-slate-50/40 border border-dashed border-slate-200 rounded-2xl">
            <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
            <p className="text-sm text-slate-400 font-medium">검색 또는 조건에 맞는 학급 전달사항이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
