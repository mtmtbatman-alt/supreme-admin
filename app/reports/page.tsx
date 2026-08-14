import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';

/**
 * [V4 프로덕션] 슈프림티비 콘텐츠 및 댓글 신고 관리 센터
 */
export default function ReportManagementPage() {
  return (
    <AdminLayout title="신고 관리 센터">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">미처리 신고 접수</p>
          <h3 className="text-2xl font-bold text-red-500">3건</h3>
        </div>
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">처리 보류</p>
          <h3 className="text-2xl font-bold text-amber-500">1건</h3>
        </div>
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">조치 완료</p>
          <h3 className="text-2xl font-bold text-green-500">45건</h3>
        </div>
      </div>

      <div className="bg-[#1e1e24] rounded-xl border border-[#222226] overflow-hidden">
        <div className="p-4 border-b border-[#222226]">
          <h3 className="text-sm font-semibold text-white">실시간 이용자 신고 접수 내역</h3>
        </div>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#222226] text-gray-400 bg-[#141416]">
              <th className="p-4 w-32">신고 유형</th>
              <th className="p-4">신고 대상 및 사유</th>
              <th className="p-4 w-36">신고자 ID</th>
              <th className="p-4 w-32 text-center">처리 상태</th>
              <th className="p-4 w-32 text-center">조치 관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222226] text-gray-300">
            <tr>
              <td className="p-4"><span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded font-semibold">저작권 침해</span></td>
              <td className="p-4 font-medium text-white">비공식 불법 외부 링크 포함 영상 댓글 신고</td>
              <td className="p-4 text-gray-400 font-mono">watcher99</td>
              <td className="p-4 text-center"><span className="text-amber-500 font-medium">● 미처리</span></td>
              <td className="p-4 text-center">
                <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-medium transition-colors">
                  조치하기
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}