import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';

/**
 * [V4 프로덕션] 슈프림티비 자동 백업 및 원클릭 복구 센터
 */
export default function BackupCenterPage() {
  return (
    <AdminLayout title="백업 센터">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#1e1e24] p-6 rounded-xl border border-[#222226]">
          <h3 className="text-sm font-bold text-white mb-2">자동 백업 설정</h3>
          <p className="text-xs text-gray-400 mb-4">매일 새벽 03:00, 데이터베이스 및 S3 미디어 자산이 자동 백업됩니다.</p>
          <span className="inline-block bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg text-xs font-semibold border border-green-500/20">
            ● 시스템 상태: 정상 작동 중
          </span>
        </div>
        <div className="bg-[#1e1e24] p-6 rounded-xl border border-[#222226]">
          <h3 className="text-sm font-bold text-white mb-2">백업 무결성 검증</h3>
          <p className="text-xs text-gray-400 mb-4">마지막 복구 시뮬레이션 테스트가 2026-08-14 05:00에 완료되었습니다.</p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-medium transition-colors">
            즉시 백업 테스트 실행
          </button>
        </div>
      </div>

      <div className="bg-[#1e1e24] rounded-xl border border-[#222226] overflow-hidden">
        <div className="p-4 border-b border-[#222226]">
          <h3 className="text-sm font-semibold text-white">최근 백업 이력 리스트</h3>
        </div>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#222226] text-gray-400 bg-[#141416]">
              <th className="p-4">백업 시점</th>
              <th className="p-4">백업 항목</th>
              <th className="p-4">파일 크기</th>
              <th className="p-4 text-center">검증 상태</th>
              <th className="p-4 text-center">복구</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222226] text-gray-300">
            <tr>
              <td className="p-4 font-mono">2026-08-14 03:00</td>
              <td className="p-4">DB(PostgreSQL) + S3 에셋</td>
              <td className="p-4">18.4 GB</td>
              <td className="p-4 text-center text-green-500">● 통과</td>
              <td className="p-4 text-center">
                <button className="text-red-500 hover:text-red-400 font-medium">원클릭 복원</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}