import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';

/**
 * [V4 프로덕션] 슈프림티비 영상 관리 및 HLS 스트리밍 인코딩 센터
 */
export default function VideoManagementPage() {
  return (
    <AdminLayout title="영상 관리 센터">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">총 등록 영상</p>
          <h3 className="text-2xl font-bold text-white">480개</h3>
        </div>
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">HLS 변환 완료</p>
          <h3 className="text-2xl font-bold text-green-400">478개</h3>
        </div>
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">인코딩 대기 중</p>
          <h3 className="text-2xl font-bold text-amber-400">2개</h3>
        </div>
      </div>

      <div className="bg-[#1e1e24] rounded-xl border border-[#222226] overflow-hidden">
        <div className="p-4 border-b border-[#222226] flex justify-between items-center">
          <h3 className="text-sm font-semibold text-white">영상 자산 및 스트리밍 상태</h3>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-medium transition-colors shadow-lg shadow-red-900/30">
            + 신규 영상 업로드
          </button>
        </div>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#222226] text-gray-400 bg-[#141416]">
              <th className="p-4">영상 파일명 / 타이틀</th>
              <th className="p-4 w-32">포맷 유형</th>
              <th className="p-4 w-28">해상도</th>
              <th className="p-4 w-32">재생 길이</th>
              <th className="p-4 w-32 text-center">인코딩 상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222226] text-gray-300">
            <tr>
              <td className="p-4 font-mono text-white">queen_ep01_1080p.mp4</td>
              <td className="p-4"><span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-semibold">HLS (M3U8)</span></td>
              <td className="p-4 text-gray-400">1920x1080</td>
              <td className="p-4 text-gray-400">1시간 12분</td>
              <td className="p-4 text-center"><span className="text-green-500 font-medium">● 완료</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}