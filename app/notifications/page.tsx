import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';

/**
 * [V4 프로덕션] 슈프림티비 시스템 실시간 알림 및 장애 대응 센터
 */
export default function NotificationCenterPage() {
  return (
    <AdminLayout title="실시간 알림 센터">
      <div className="flex justify-between items-center mb-6">
        <p className="text-xs text-gray-400">시스템 보안 경고, 신규 회원 가입, 콘텐츠 신고 및 장애 상황을 실시간으로 확인합니다.</p>
        <button className="bg-red-600/10 hover:bg-red-600/20 text-red-500 px-4 py-2 rounded-xl text-xs font-medium transition-colors border border-red-500/20">
          모두 읽음으로 표시
        </button>
      </div>

      <div className="bg-[#1e1e24] rounded-xl border border-[#222226] overflow-hidden">
        <div className="divide-y divide-[#222226]">
          <div className="p-4 hover:bg-[#1a1a20] transition-colors flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="text-xs font-bold text-white mb-0.5">보안 경고: 의심스러운 로그인 시도 감지</h4>
                <p className="text-[11px] text-gray-400">IP: 192.168.1.100 (서울) - 시도 횟수: 5회</p>
              </div>
            </div>
            <span className="text-[10px] text-gray-500">방금 전</span>
          </div>
          <div className="p-4 hover:bg-[#1a1a20] transition-colors flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xl">👤</span>
              <div>
                <h4 className="text-xs font-bold text-white mb-0.5">신규 회원 가입 알림</h4>
                <p className="text-[11px] text-gray-400">새로운 회원이 프리미엄 멤버십으로 가입하였습니다.</p>
              </div>
            </div>
            <span className="text-[10px] text-gray-500">5분 전</span>
          </div>
          <div className="p-4 hover:bg-[#1a1a20] transition-colors flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xl">🚨</span>
              <div>
                <h4 className="text-xs font-bold text-white mb-0.5">신규 신고 접수</h4>
                <p className="text-[11px] text-gray-400">콘텐츠 신고 관리 센터에 새로운 신고가 접수되었습니다.</p>
              </div>
            </div>
            <span className="text-[10px] text-gray-500">12분 전</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}