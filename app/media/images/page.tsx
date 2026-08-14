import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';

/**
 * [V4 프로덕션] 슈프림티비 이미지 관리 및 자동 WebP 압축 센터
 */
export default function ImageManagementPage() {
  return (
    <AdminLayout title="이미지 관리 센터">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">사용 중인 이미지</p>
          <h3 className="text-2xl font-bold text-white">1,240개</h3>
        </div>
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">미사용 고아 파일</p>
          <h3 className="text-2xl font-bold text-amber-400">32개</h3>
        </div>
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">총 스토리지 용량</p>
          <h3 className="text-2xl font-bold text-red-500">4.8 GB</h3>
        </div>
      </div>

      <div className="bg-[#1e1e24] p-8 rounded-xl border border-[#222226] text-center mb-8 border-dashed">
        <div className="max-w-md mx-auto">
          <span className="text-3xl mb-3 block">📁</span>
          <h3 className="text-sm font-bold text-white mb-1">드래그 앤 드롭 대량 업로드</h3>
          <p className="text-xs text-gray-400 mb-4">JPG, JPEG, PNG 파일을 올리면 자동으로 압축 및 WebP 변환이 수행됩니다.</p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-medium transition-colors shadow-lg shadow-red-900/30">
            파일 선택 및 업로드
          </button>
        </div>
      </div>

      <div className="bg-[#1e1e24] rounded-xl border border-[#222226] p-6">
        <h3 className="text-sm font-semibold text-white mb-4">최근 업로드된 미디어 에셋</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-[#141416] p-3 rounded-lg border border-[#222226] text-center">
            <div className="w-full h-24 bg-gray-800 rounded mb-2 flex items-center justify-center text-xs text-gray-500">WEBP</div>
            <p className="text-[11px] text-gray-300 truncate">poster_queen.webp</p>
            <span className="text-[10px] text-green-400">압축 완료 (84KB)</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}