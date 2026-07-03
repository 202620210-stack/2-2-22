/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Meal, MealReview } from '../types';
import { FALLBACK_LUNCHES } from '../utils/mockData';
import { Utensils, ChevronLeft, ChevronRight, Star, Heart, Calendar, MessageSquare, Plus, Trash2, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MealWidgetProps {
  currentTime: Date;
}

// NEIS allergen numeric code definitions
const ALLERGEN_MAP: { [key: string]: string } = {
  '1': '난류(알류)', '2': '우유', '3': '메밀', '4': '땅콩', '5': '대두',
  '6': '밀', '7': '고등어', '8': '게', '9': '새우', '10': '돼지고기',
  '11': '복숭아', '12': '토마토', '13': '아황산류', '14': '호두', '15': '닭고기',
  '16': '소고기', '17': '오징어', '18': '조개류(굴, 전복, 홍합 등)', '19': '잣'
};

export default function MealWidget({ currentTime }: MealWidgetProps) {
  // We track the selected date for lunch query
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    // If it's late (e.g. after 14:00), default to tomorrow's lunch!
    const defaultDate = new Date(currentTime);
    if (currentTime.getHours() >= 14) {
      defaultDate.setDate(defaultDate.getDate() + 1);
    }
    return defaultDate;
  });

  const [mealData, setMealData] = useState<Meal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Reviews states (persisted locally per date string like YYYYMMDD)
  const dateKey = getFormattedDate(selectedDate);
  const [reviews, setReviews] = useState<MealReview[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [userName, setUserName] = useState('');

  // 1. Fetch meals from NEIS or use fallback
  useEffect(() => {
    async function fetchSchoolMeals() {
      setIsLoading(true);
      setErrorStatus(null);
      const targetDateStr = getFormattedDate(selectedDate); // format: YYYYMMDD

      // Sanghyun High School parameters
      // ATPT_OFCDC_SC_CODE: J10 (Gyeonggi Provincial Office of Education)
      // SD_SCHUL_CODE: 7530853 (Sanghyun High School)
      const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?Type=json&ATPT_OFCDC_SC_CODE=J10&SD_SCHUL_CODE=7530853&MLSV_YMD=${targetDateStr}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        
        if (data.mealServiceDietInfo && data.mealServiceDietInfo[1] && data.mealServiceDietInfo[1].row) {
          const rowData = data.mealServiceDietInfo[1].row[0]; // Lunch is usually row[0]
          
          // Split dishes by <br/> or newline
          const rawDishes: string = rowData.DDISH_NM || '';
          const dishes = rawDishes.split(/<br\s*\/?>|\n/i).map(d => d.trim()).filter(Boolean);
          const calories = rowData.CAL_INFO || '정보 없음';
          const nutrition = rowData.NTR_INFO ? rowData.NTR_INFO.split(/<br\s*\/?>|\n/i).map((n: string) => n.trim()).filter(Boolean) : [];

          setMealData({
            dishes,
            calories,
            nutrition,
            date: targetDateStr
          });
        } else {
          // If NEIS has no record (e.g. weekends, holidays, exam days, etc.) -> use local delicious fallback
          loadFallbackMeal(selectedDate, targetDateStr);
        }
      } catch (err) {
        console.warn('NEIS API error, falling back to mock data:', err);
        loadFallbackMeal(selectedDate, targetDateStr);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSchoolMeals();
  }, [selectedDate]);

  // Load reviews when date key changes
  useEffect(() => {
    const savedReviews = localStorage.getItem(`meal_reviews_${dateKey}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      // Create interesting initial reviews to populate the feed initially of students discussing school lunch!
      const mockReviews: { [key: number]: MealReview[] } = {
        1: [ // Mon
          { id: 'mr1', author: '급식사냥꾼', rating: 5, content: '월요일 아침부터 삼겹살/치킨/돈까스 삼종세트 아주 축복입니다.', createdAt: new Date().toISOString() },
          { id: 'mr2', author: '마라탕광인', rating: 4, content: '돈까스 소스가 부드럽고 쫄면이랑 같이 싸서 먹으니까 단짠조합 최고네요!', createdAt: new Date().toISOString() }
        ],
        3: [ // Wed
          { id: 'mr3', author: '먹짱2반', rating: 5, content: '오늘 마라탕 국물 알싸해요! 진짜 대박 맛남!!! 후식 메로나 신의 한 수', createdAt: new Date().toISOString() },
          { id: 'mr4', author: '다이어터', rating: 4, content: '행복했다 오늘... 한 그릇 더 받고 싶었는데 참았습니다.', createdAt: new Date().toISOString() }
        ],
        4: [ // Thu
          { id: 'mr5', author: '카레카레', rating: 5, content: '단호박 카레 풍미 짱입니다. 피자 주는 급식실 최고...', createdAt: new Date().toISOString() }
        ]
      };
      
      const dayOfWeek = selectedDate.getDay();
      setReviews(mockReviews[dayOfWeek] || []);
    }
  }, [dateKey]);

  function loadFallbackMeal(dateObj: Date, targetDateStr: string) {
    const dayVal = dateObj.getDay(); // 0-6
    const dishes = FALLBACK_LUNCHES[dayVal] || ['수수밥', '소고기미역국', '제육볶음', '감자채볶음', '포기김치', '방울토마토'];
    
    // Aesthetic calories based on dishes count
    const calories = `${780 + (dayVal * 15)} Kcal`;
    setMealData({
      dishes,
      calories,
      date: targetDateStr
    });
  }

  // Formatting date functions
  function getFormattedDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  }

  function getKoreaDateLabel(date: Date): string {
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const day = dayNames[date.getDay()];
    return `${mm}월 ${dd}일 (${day})`;
  }

  // Parse dish and extract allergens
  function parseDishAndAllergens(dishStr: string): { name: string; allergens: string[] } {
    // Standard NEIS API pattern is e.g. "돈까스.1.2.5.6.10.13" or "닭곰탕(수)5.6"
    // Extract numbers separated by periods or parentheses at the end
    const allergenRegex = /[\d\.]+/g;
    const match = dishStr.match(allergenRegex);
    
    let cleanName = dishStr;
    const allergens: string[] = [];

    if (match) {
      // Find numbers from matches
      const nums = match.join('.').split('.').filter(Boolean);
      nums.forEach(num => {
        if (ALLERGEN_MAP[num]) {
          allergens.push(ALLERGEN_MAP[num]);
        }
      });
      
      // Clean name of allergen markers (e.g. .2.5.6.10)
      cleanName = dishStr.replace(/[\d\.]+/g, '').replace(/[\(\*\)\s]+$/g, '');
    }

    // Secondary cleanup of stray symbols
    cleanName = cleanName.replace(/\*$/, '').replace(/\([^\)]*\)/g, '').trim();

    return {
      name: cleanName,
      allergens: allergens
    };
  }

  const navigateDate = (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + offset);
    setSelectedDate(newDate);
  };

  const handleSetToday = () => {
    setSelectedDate(new Date(currentTime));
  };

  // Star review submit
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const review: MealReview = {
      id: `mr-${Date.now()}`,
      author: userName.trim() || '익명의2반',
      rating: newRating,
      content: newComment.trim(),
      createdAt: new Date().toISOString()
    };

    const updated = [review, ...reviews];
    setReviews(updated);
    localStorage.setItem(`meal_reviews_${dateKey}`, JSON.stringify(updated));

    // Reset Form
    setNewComment('');
    setNewRating(5);
  };

  const handleDeleteReview = (id: string) => {
    const updated = reviews.filter(r => r.id !== id);
    setReviews(updated);
    localStorage.setItem(`meal_reviews_${dateKey}`, JSON.stringify(updated));
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div id="meal-card" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      {/* 타이틀 및 네비게이터 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-5 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-800">급식알림표</h2>
            <p className="text-xs text-slate-400 mt-0.5">상현고 급식을 NEIS 공공 데이터로 조회합니다</p>
          </div>
        </div>

        {/* 날짜 조절기 */}
        <div className="flex items-center bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/50">
          <button
            onClick={() => navigateDate(-1)}
            className="p-1 px-1.5 hover:bg-white rounded-md transition-colors"
            title="이전 날짜"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          
          <button
            onClick={handleSetToday}
            className="text-xs font-semibold px-2 hover:text-emerald-600 transition-colors shrink-0"
          >
            {getKoreaDateLabel(selectedDate)}
          </button>

          <button
            onClick={() => navigateDate(1)}
            className="p-1 px-1.5 hover:bg-white rounded-md transition-colors"
            title="다음 날짜"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* 급식 메인 구상 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* 식단 디스플레이 슬롯 (3칸) */}
        <div className="md:col-span-3 flex flex-col justify-between">
          <div>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-3" />
                <p className="text-xs">오늘의 메인 찬거리를 싣는 중...</p>
              </div>
            ) : mealData ? (
              <div className="space-y-4">
                {/* 칼로리 표시 */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    칼로리 정보
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {mealData.calories}
                  </span>
                </div>

                {/* 요리 및 알레르기 리스트 */}
                <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-100/50 rounded-bl-full" />
                  <ul className="space-y-3">
                    {mealData.dishes.map((dish, i) => {
                      const { name, allergens } = parseDishAndAllergens(dish);
                      return (
                        <li key={i} className="flex flex-wrap items-center justify-between gap-2 border-b border-white/80 pb-2.5 last:border-none last:pb-0">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                            {name}
                          </span>
                          
                          {/* 알레르기 툴팁 */}
                          {allergens.length > 0 && (
                            <div className="relative group/tooltip">
                              <span className="bg-slate-200/80 hover:bg-slate-200 text-slate-600 text-[9px] px-1.5 py-0.5 rounded-md font-mono cursor-help transition-colors">
                                알레르기
                              </span>
                              
                              <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover/tooltip:block bg-slate-800 text-white text-[10px] p-2 rounded-lg shadow-xl w-40 z-20 leading-normal pointer-events-none">
                                <span className="font-bold block border-b border-white/20 pb-1 mb-1">식품 알레르기 정보</span>
                                {allergens.join(', ')}
                              </div>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <p className="text-xs">이날은 예정된 학학급 급식 배차가 없습니다.</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            {/* 평점 통계 */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                이날 급식 실시간 평점
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800">{getAverageRating()} / 5.0</span>
                <span className="text-xs text-slate-400">({reviews.length}명 참여)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 한마디 평론 / 피드백 (2칸) */}
        <div className="md:col-span-2 border-l border-slate-100 md:pl-5 flex flex-col h-full justify-between" style={{ minHeight: '260px' }}>
          <div>
            <h3 className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              오늘의 급식 한줄평
            </h3>

            {/* 댓글 리스트 */}
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 group relative">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-700">{rev.author}</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, rIdx) => (
                            <Star key={rIdx} className="w-2.5 h-2.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity"
                        title="리뷰 파기"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal break-all">
                      {rev.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400">
                  <p className="text-[10px]">등록된 급식평이 아직 없습니다.</p>
                </div>
              )}
            </div>
          </div>

          {/* 급식 남기기 폼 */}
          <form onSubmit={handleAddReview} className="mt-4 pt-4 border-t border-slate-100/80 space-y-2">
            <div className="flex items-center justify-between gap-1">
              {/* 별점 초이스 */}
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isActive = hoverRating !== null ? starVal <= hoverRating : starVal <= newRating;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setNewRating(starVal)}
                      className="p-0.5 focus:outline-none transition-transform active:scale-120"
                    >
                      <Star className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  );
                })}
              </div>

              {/* 닉네임 입력 */}
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="닉네임"
                maxLength={8}
                className="w-16 text-[10px] p-1 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-emerald-400 text-center font-semibold"
              />
            </div>

            <div className="flex gap-1.5">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글달기..."
                maxLength={40}
                required
                className="flex-1 text-[11px] p-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-400 transition-all font-medium"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-xl active:scale-95 transition-all"
                title="한줄평 등록"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
