import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';

/**
 * [V4 프로덕션] 슈프림티비 S3 통합 파일 탐색기 및 용량 통계 센터
 */
export default function FileManagerPage() {
  return (
    <AdminLayout title="통합 파일 관리자">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">전체 에셋 파일</p>
          <h3 className="text-2xl font-bold text-white">3,450개</h3>
        </div>
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">사용 중인 파일</p>
          <h3 className="text-2xl font-bold text-green-400">3,310개</h3>
        </div>
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">미사용 고아 파일</p>
          <h3 className="text-2xl font-bold text-amber-400">140개</h3>
        </div>
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">스토리지 총 사용량</p>
          <h3 className="text-2xl font-bold text-red-500">1.2 TB</h3>
        </div>
      </div>

      <div className="bg-[#1e1e24] rounded-xl border border-[#222226] overflow-hidden">
        <div className="p-4 border-b border-[#222226] flex justify-between items-center">
          <h3 className="text-sm font-semibold text-white">스토리지 파일 탐색기</h3>
          <button className="bg-red-600/10 hover:bg-red-600/20 text-red-500 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-red-500/20">
            🧹 미사용 파일 일괄 정리
          </button>
        </div>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#222226] text-gray-400 bg-[#141416]">
              <th className="p-4">파일 경로 및 이름</th>
              <th className="p-4 w-32">분류</th>
              <th className="p-4 w-28">파일 용량</th>
              <th className="p-4 w-32 text-center">연결 상태</th>
              <th className="p-4 w-32 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222226] text-gray-300">
            <tr>
              <td className="p-4 font-mono text-white">s3://supreme-bucket/assets/videos/ep01.mp4</td>
              <td className="p-4 text-gray-400">동영상</td>
              <td className="p-4 text-gray-400">1.2 GB</td>
              <td className="p-4 text-center"><span className="text-green-500 font-medium">● 사용중</span></td>
              <td className="p-4 text-center">
                <button className="text-gray-400 hover:text-white mr-2">다운로드</button>
                <button className="text-red-500 hover:text-red-400">삭제</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}