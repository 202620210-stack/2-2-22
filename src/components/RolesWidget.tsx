/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClassRole } from '../types';
import { INITIAL_ROLES } from '../utils/mockData';
import { ShieldCheck, Plus, Trash2, Edit2, Check, X, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function RolesWidget() {
  const [roles, setRoles] = useState<ClassRole[]>(() => {
    const saved = localStorage.getItem('class_roles');
    return saved ? JSON.parse(saved) : INITIAL_ROLES;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New role states
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  // Editing role states
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editAssigned, setEditAssigned] = useState('');

  const handleDelete = (id: string) => {
    if (window.confirm('이 1인 1역 보직을 삭제하시겠습니까?')) {
      const filtered = roles.filter(r => r.id !== id);
      setRoles(filtered);
      localStorage.setItem('class_roles', JSON.stringify(filtered));
    }
  };

  const handleStartEdit = (role: ClassRole) => {
    setEditingId(role.id);
    setEditName(role.roleName);
    setEditDesc(role.description);
    setEditAssigned(role.assignedTo);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    const updated = roles.map(r => {
      if (r.id === id) {
        return {
          ...r,
          roleName: editName.trim(),
          description: editDesc.trim(),
          assignedTo: editAssigned.trim() || '미지정'
        };
      }
      return r;
    });
    setRoles(updated);
    localStorage.setItem('class_roles', JSON.stringify(updated));
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    const newRole: ClassRole = {
      id: `r-${Date.now()}`,
      roleName: roleName.trim(),
      description: description.trim(),
      assignedTo: assignedTo.trim() || '미지정'
    };

    const updated = [...roles, newRole];
    setRoles(updated);
    localStorage.setItem('class_roles', JSON.stringify(updated));

    // Reset Form
    setRoleName('');
    setDescription('');
    setAssignedTo('');
    setIsAdding(false);
  };

  // Helper shuffle chores
  const handleShuffleChores = () => {
    // Generate a set of random student names or let them pull anonymously
    const typicalStudents = [
      '박서연', '이지훈', '김민우', '최아름', '정현우', '윤성준', '강태현', '안혜원', '임채원', '오윤선',
      '하성진', '박은우', '서유진', '남궁현', '도민재', '배주한', '송혜교', '유아인', '윤도현', '정우성'
    ];
    
    if (window.confirm('기존 보직을 제외하고, 미지정 인원들에게 임의로 소소한 1인 1역을 자동 매칭해 볼까요? (체험 기능)')) {
      const shuffledNames = [...typicalStudents].sort(() => Math.random() - 0.5);
      const updated = roles.map((role, idx) => ({
        ...role,
        assignedTo: shuffledNames[idx % shuffledNames.length]
      }));
      setRoles(updated);
      localStorage.setItem('class_roles', JSON.stringify(updated));
    }
  };

  return (
    <div id="roles-card" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-[#55b399]" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-800">우리의 1인 1역할</h2>
            <p className="text-xs text-slate-400 mt-0.5">자율적이고 쾌적하게 2학년 2반 교실을 일궈요</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleShuffleChores}
            className="p-1 px-2.2 text-xs font-semibold text-emerald-650 hover:bg-emerald-50 rounded-lg flex items-center gap-1 transition-colors"
            style={{ color: '#55b399' }}
            title="당번 셔플/매치 체험"
          >
            <Shuffle className="w-3.5 h-3.5" />
            당번 매칭
          </button>
          
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`p-1 px-2.2 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
              isAdding ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
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
                추가
              </>
            )}
          </button>
        </div>
      </div>

      {/* 신규 직분 추가 */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-5"
          >
            <form onSubmit={handleSubmit} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-700">새 1인역할 보직 등록</h3>
              
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">역할명</label>
                  <input
                    type="text"
                    required
                    value={roleName}
                    placeholder="예: 에어컨 수호자"
                    onChange={(e) => setRoleName(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-250 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">담당 친구명</label>
                  <input
                    type="text"
                    value={assignedTo}
                    placeholder="예: 강동휘 (미입력 시 미지정)"
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-250 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">업무 및 설명</label>
                <input
                  type="text"
                  value={description}
                  placeholder="예: 마지막 귀가 시 교실 에어컨 끄기 쾌조 확인"
                  onChange={(e) => setDescription(e.target.value)}
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
                  className="px-3.5 py-1 text-xs text-white rounded-lg font-bold"
                  style={{ backgroundColor: '#55b399' }}
                >
                  보직 추가
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 역할 목록 */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {roles.map((role) => (
          <div
            key={role.id}
            className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/40 hover:bg-slate-50 hover:shadow-2xs transition-all flex items-start gap-3 relative group"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold leading-none shrink-0 bg-emerald-50 text-emerald-600 font-sans border border-emerald-100">
              {role.roleName.substring(0, 2)}
            </div>

            <div className="flex-1 min-w-0">
              {editingId === role.id ? (
                /* 수정 모드 */
                <div className="space-y-2 mt-1.5">
                  <input
                    type="text"
                    value={editName}
                    title="역할명 수정"
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-xs p-1.5 bg-white border border-slate-250 rounded-lg focus:outline-none font-bold"
                  />
                  <input
                    type="text"
                    value={editDesc}
                    title="설명 수정"
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full text-xs p-1.5 bg-white border border-slate-250 rounded-lg focus:outline-none"
                  />
                  <input
                    type="text"
                    value={editAssigned}
                    title="담당 수정"
                    onChange={(e) => setEditAssigned(e.target.value)}
                    className="w-full text-xs p-1.5 bg-white border border-slate-250 rounded-lg focus:outline-none text-emerald-700"
                  />

                  <div className="flex gap-1.5 justify-end">
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 px-2 text-[10px] bg-slate-200 text-slate-700 rounded-md"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => handleSaveEdit(role.id)}
                      className="p-1 px-2.5 text-[10px] text-white bg-emerald-600 rounded-md font-bold"
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                /* 뷰 모드 */
                <>
                  <div className="flex items-center justify-between gap-2.5">
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">
                      {role.roleName}
                    </h4>
                    
                    <span className="text-xs font-bold text-emerald-650 shrink-0 bg-emerald-50/60 px-2 py-0.5 rounded-lg border border-emerald-100/30" style={{ color: '#55b399' }}>
                      👤 {role.assignedTo}
                    </span>
                  </div>
                  
                  <p className="text-[10.5px] text-slate-400 mt-1 leading-normal break-all">
                    {role.description}
                  </p>
                </>
              )}
            </div>

            {/* 에디션 삭제 트리거 */}
            {editingId !== role.id && (
              <div className="opacity-0 group-hover:opacity-100 absolute top-1 right-1 flex gap-0.5 items-center bg-white/90 p-1 rounded-lg shadow-sm border border-slate-100 transition-all">
                <button
                  onClick={() => handleStartEdit(role)}
                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
                  title="역할 편집"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDelete(role.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-colors"
                  title="역할 삭제"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
