import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';

/**
 * [V4 프로덕션] 슈프림티비 공지 및 이벤트 팝업 관리 센터
 */
export default function PopupManagementPage() {
  return (
    <AdminLayout title="팝업 관리 센터">
      <div className="flex justify-between items-center mb-6">
        <p className="text-xs text-gray-400">플랫폼 내부에 노출되는 공지 팝업, 이벤트 팝업 및 '오늘 하루 보지 않기' 옵션을 관리합니다.</p>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-medium transition-colors shadow-lg shadow-red-900/30">
          + 신규 팝업 등록
        </button>
      </div>

      <div className="bg-[#1e1e24] rounded-xl border border-[#222226] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#222226] text-gray-400 bg-[#141416]">
              <th className="p-4">팝업 타이틀 / 내용</th>
              <th className="p-4 w-32">팝업 유형</th>
              <th className="p-4 w-40">노출 기간</th>
              <th className="p-4 w-32 text-center">노출 상태</th>
              <th className="p-4 w-32 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222226] text-gray-300">
            <tr>
              <td className="p-4 font-medium text-white">[긴급] 서비스 서버 점검 및 업데이트 안내 팝업</td>
              <td className="p-4"><span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-semibold">공지 팝업</span></td>
              <td className="p-4 text-gray-400">2026-08-14 ~ 2026-08-20</td>
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