import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';

/**
 * [V4 프로덕션] 슈프림티비 공지사항 및 상단 고정 관리 센터
 */
export default function NoticeManagementPage() {
  return (
    <AdminLayout title="공지사항 관리 센터">
      <div className="flex justify-between items-center mb-6">
        <p className="text-xs text-gray-400">서비스 이용 안내, 업데이트 소식 및 상단 고정 공지사항을 관리합니다.</p>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-medium transition-colors shadow-lg shadow-red-900/30">
          + 신규 공지 등록
        </button>
      </div>

      <div className="bg-[#1e1e24] rounded-xl border border-[#222226] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#222226] text-gray-400 bg-[#141416]">
              <th className="p-4">공지 제목</th>
              <th className="p-4 w-32 text-center">상단 고정</th>
              <th className="p-4 w-40">등록 일시</th>
              <th className="p-4 w-32 text-center">노출 상태</th>
              <th className="p-4 w-32 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222226] text-gray-300">
            <tr>
              <td className="p-4 font-medium text-white">슈프림티비 V4 프로덕션 플랫폼 공식 오픈 안내</td>
              <td className="p-4 text-center"><span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded font-semibold">고정됨</span></td>
              <td className="p-4 text-gray-400">2026-08-14 09:00</td>
              <td className="p-4 text-center"><span className="text-green-500 font-medium">● 게시중</span></td>
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