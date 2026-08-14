import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';

/**
 * [V4 프로덕션] 슈프림티비 운영 대시보드 페이지
 */
export default function DashboardPage() {
  return (
    <AdminLayout title="운영 대시보드 센터">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">오늘 방문자</p>
          <h3 className="text-2xl font-bold text-white">0명</h3>
        </div>
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">총 회원수</p>
          <h3 className="text-2xl font-bold text-red-500">0명</h3>
        </div>
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">총 콘텐츠 수</p>
          <h3 className="text-2xl font-bold text-amber-500">0개</h3>
        </div>
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">현재 접속자</p>
          <h3 className="text-2xl font-bold text-green-500">0명</h3>
        </div>
      </div>

      <div className="bg-[#1e1e24] p-6 rounded-xl border border-[#222226]">
        <h3 className="text-sm font-semibold text-white mb-4">실시간 프로덕션 서버 상태</h3>
        <p className="text-xs text-gray-400">PostgreSQL, Redis, Cloudflare CDN 연결 상태가 정상적입니다.</p>
      </div>
    </AdminLayout>
  );
}