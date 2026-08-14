import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';

/**
 * [V4 프로덕션] 슈프림티비 카테고리 관리 및 드래그 정렬 센터
 */
export default function CategoryManagementPage() {
  return (
    <AdminLayout title="카테고리 관리 센터">
      <div className="flex justify-between items-center mb-6">
        <p className="text-xs text-gray-400">영화, 드라마, 예능 등 메인 네비게이션 카테고리 순서 및 노출 여부를 관리합니다.</p>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-medium transition-colors shadow-lg shadow-red-900/30">
          + 신규 카테고리 생성
        </button>
      </div>

      <div className="bg-[#1e1e24] rounded-xl border border-[#222226] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#222226] text-gray-400 bg-[#141416]">
              <th className="p-4 w-20 text-center">정렬 순서</th>
              <th className="p-4">카테고리명</th>
              <th className="p-4 w-40">URL 슬러그</th>
              <th className="p-4 w-32 text-center">노출 상태</th>
              <th className="p-4 w-32 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222226] text-gray-300">
            <tr>
              <td className="p-4 text-center font-mono text-gray-500">↕ 1</td>
              <td className="p-4 font-medium text-white">오리지널 드라마</td>
              <td className="p-4 font-mono text-gray-400">/category/original-drama</td>
              <td className="p-4 text-center"><span className="text-green-500 font-medium">● 노출중</span></td>
              <td className="p-4 text-center">
                <button className="text-gray-400 hover:text-white mr-2">수정</button>
                <button className="text-red-500 hover:text-red-400">삭제</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}