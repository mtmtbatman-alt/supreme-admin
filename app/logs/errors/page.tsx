import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';

/**
 * [V4 프로덕션] 슈프림티비 장애 로그 센터 및 외부 채널 알림 연동
 */
export default function ErrorLogCenterPage() {
  return (
    <AdminLayout title="에러 로그 및 장애 알림 센터">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#1e1e24] p-6 rounded-xl border border-[#222226]">
          <h3 className="text-sm font-bold text-white mb-2">실시간 장애 알림 (Webhook)</h3>
          <p className="text-xs text-gray-400 mb-4">심각한 에러 발생 시 즉시 알림이 발송됩니다.</p>
          <div className="flex gap-2">
            <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg text-[10px] font-semibold border border-indigo-500/20">DISCORD 활성</span>
            <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-lg text-[10px] font-semibold border border-green-500/20">SLACK 활성</span>
          </div>
        </div>
        <div className="bg-[#1e1e24] p-6 rounded-xl border border-[#222226]">
          <h3 className="text-sm font-bold text-white mb-2">오늘의 에러 통계</h3>
          <p className="text-xs text-gray-400 mb-4">현재까지 감지된 404 및 500 에러 총합입니다.</p>
          <h3 className="text-2xl font-bold text-red-500">2건</h3>
        </div>
      </div>

      <div className="bg-[#1e1e24] rounded-xl border border-[#222226] overflow-hidden">
        <div className="p-4 border-b border-[#222226]">
          <h3 className="text-sm font-semibold text-white">최근 발생 에러 로그 상세</h3>
        </div>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#222226] text-gray-400 bg-[#141416]">
              <th className="p-4 w-28">에러 코드</th>
              <th className="p-4">발생 위치</th>
              <th className="p-4 w-48">발생 일시</th>
              <th className="p-4 w-32 text-center">조치 여부</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222226] text-gray-300">
            <tr>
              <td className="p-4 font-mono text-red-500 font-bold">500 Internal</td>
              <td className="p-4 font-mono text-white">/api/v1/content/process</td>
              <td className="p-4 text-gray-400">2026-08-14 19:20:01</td>
              <td className="p-4 text-center"><span className="text-amber-500 font-medium">● 미확인</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}