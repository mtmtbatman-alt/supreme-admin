import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';

/**
 * [V4 프로덕션] 슈프림티비 회원 관리 및 권한 제어 센터
 */
export default function UserManagementPage() {
  return (
    <AdminLayout title="회원 관리 센터">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">총 회원 수</p>
          <h3 className="text-2xl font-bold text-white">125,400명</h3>
        </div>
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">오늘 신규 가입</p>
          <h3 className="text-2xl font-bold text-green-400">+420명</h3>
        </div>
        <div className="bg-[#1e1e24] p-5 rounded-xl border border-[#222226]">
          <p className="text-xs text-gray-400 mb-1">이용 정지 회원</p>
          <h3 className="text-2xl font-bold text-red-500">12명</h3>
        </div>
      </div>

      <div className="bg-[#1e1e24] rounded-xl border border-[#222226] overflow-hidden">
        <div className="p-4 border-b border-[#222226] flex justify-between items-center">
          <h3 className="text-sm font-semibold text-white">플랫폼 회원 목록 및 상태 제어</h3>
          <input 
            type="text" 
            placeholder="회원 이메일 또는 닉네임 검색..." 
            className="bg-[#141416] border border-[#222226] rounded-lg px-3 py-1.5 text-xs text-gray-300 w-64 focus:outline-none focus:border-red-500"
          />
        </div>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#222226] text-gray-400 bg-[#141416]">
              <th className="p-4">회원 이메일 / 닉네임</th>
              <th className="p-4 w-32">구독 등급</th>
              <th className="p-4 w-40">가입 일시</th>
              <th className="p-4 w-32 text-center">계정 상태</th>
              <th className="p-4 w-32 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222226] text-gray-300">
            <tr>
              <td className="p-4 font-medium text-white">user01@supreme.com <span className="text-gray-500 text-[10px] block">닉네임: 슈프림시청자</span></td>
              <td className="p-4"><span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded font-semibold">프리미엄</span></td>
              <td className="p-4 text-gray-400">2026-08-01 14:22</td>
              <td className="p-4 text-center"><span className="text-green-500 font-medium">● 정상</span></td>
              <td className="p-4 text-center">
                <button className="text-gray-400 hover:text-white mr-2">상세</button>
                <button className="text-red-500 hover:text-red-400">정지</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}