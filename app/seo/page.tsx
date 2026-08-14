import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';

/**
 * [V4 프로덕션] 슈프림티비 SEO 및 검색엔진 최적화 관제 센터
 */
export default function SeoCenterPage() {
  return (
    <AdminLayout title="SEO 센터 및 메타태그 관리">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#1e1e24] p-6 rounded-xl border border-[#222226]">
          <h3 className="text-sm font-bold text-white mb-2">자동 색인 및 사이트맵</h3>
          <p className="text-xs text-gray-400 mb-4">Google, Naver 검색엔진 크롤링을 위한 sitemap.xml 및 robots.txt가 실시간 동기화되고 있습니다.</p>
          <span className="inline-block bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg text-xs font-semibold border border-green-500/20">
            ● Sitemap Status: 최신 동기화 완료 (오늘 04:00)
          </span>
        </div>
        <div className="bg-[#1e1e24] p-6 rounded-xl border border-[#222226]">
          <h3 className="text-sm font-bold text-white mb-2">Schema.org 구조화된 데이터</h3>
          <p className="text-xs text-gray-400 mb-4">Movie, TVSeries, Organization 규격의 JSON-LD가 자동 생성됩니다.</p>
          <span className="inline-block bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-500/20">
            ● JSON-LD 자동 생성 활성화
          </span>
        </div>
      </div>

      <div className="bg-[#1e1e24] rounded-xl border border-[#222226] p-6">
        <h3 className="text-sm font-semibold text-white mb-4">기본 글로벌 SEO 메타태그 설정</h3>
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-400 mb-1">메인 SEO 타이틀 (Title)</label>
            <input 
              type="text" 
              defaultValue="슈프림티비 - 대한민국 최고의 프리미엄 OTT 스트리밍 서비스" 
              className="w-full bg-[#141416] border border-[#222226] rounded-lg p-2.5 text-gray-300 focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">메타 디스크립션 (Description)</label>
            <textarea 
              rows={2}
              defaultValue="최신 영화, 오리지널 드라마, 예능, 스포츠까지 슈프림티비에서 고화질 스트리밍으로 만나보세요."
              className="w-full bg-[#141416] border border-[#222226] rounded-lg p-2.5 text-gray-300 focus:outline-none focus:border-red-500"
            />
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium transition-colors">
            SEO 설정 저장
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}