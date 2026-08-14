import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';

/**
 * [V4 프로덕션] 슈프림티비 트래픽 및 시청자 통계 분석 센터
 */
export default function AnalyticsCenterPage() {
  return (
    <AdminLayout title="통계 분석 및 트래픽 관제">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">실시간 동시 접속</p>
          <h3 className="text-2xl font-bold text-green-400">14,280명</h3>
        </div>
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">오늘 총 방문자</p>
          <h3 className="text-2xl font-bold text-white">328,500명</h3>
        </div>
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">평균 시청 지속 시간</p>
          <h3 className="text-2xl font-bold text-blue-400">1시간 42분</h3>
        </div>
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">가장 높은 유입 채널</p>
          <h3 className="text-2xl font-bold text-amber-400">Google (48%)</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1e1e24] p-6 rounded-xl border border-[#222226]">
          <h3 className="text-sm font-bold text-white mb-4">실시간 인기 스트리밍 콘텐츠 순위</h3>
          <ul className="space-y-3 text-xs">
            <li className="flex justify-between items-center bg-[#141416] p-3 rounded-lg border border-[#222226]">
              <span className="text-white font-medium">1. 퀸 of 테어즈 (Queen of Tears)</span>
              <span className="text-red-500 font-semibold">시청 점유율 34.2%</span>
            </li>
            <li className="flex justify-between items-center bg-[#141416] p-3 rounded-lg border border-[#222226]">
              <span className="text-white font-medium">2. 오리지널 서울 다이어리</span>
              <span className="text-gray-400 font-semibold">시청 점유율 18.5%</span>
            </li>
          </ul>
        </div>
        <div className="bg-[#1e1e24] p-6 rounded-xl border border-[#222226]">
          <h3 className="text-sm font-bold text-white mb-4">플랫폼 유입 경로 분석 (Traffic Sources)</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center bg-[#141416] p-3 rounded-lg border border-[#222226]">
              <span className="text-gray-300">Google 검색</span>
              <span className="text-green-400 font-semibold">48.2%</span>
            </div>
            <div className="flex justify-between items-center bg-[#141416] p-3 rounded-lg border border-[#222226]">
              <span className="text-gray-300">Naver 검색</span>
              <span className="text-green-400 font-semibold">28.4%</span>
            </div>
            <div className="flex justify-between items-center bg-[#141416] p-3 rounded-lg border border-[#222226]">
              <span className="text-gray-300">SNS 및 Direct 유입</span>
              <span className="text-green-400 font-semibold">23.4%</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}