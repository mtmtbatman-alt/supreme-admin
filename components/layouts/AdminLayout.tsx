import React, { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

/**
 * [V4 프로덕션] 슈프림티비 관리자 통합 레이아웃 컴포넌트
 */
export default function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <div className="bg-[#0b0b0b] text-white min-h-screen flex m-0 font-sans">
      {/* 사이드바 영역 */}
      <aside className="w-64 bg-[#141416] border-r border-[#222226] p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <h1 className="text-red-600 font-bold text-lg tracking-wider">SUPREME TV V4</h1>
          </div>
          <nav className="space-y-2 text-sm text-gray-400">
            <a href="/dashboard" className="flex items-center px-4 py-3 rounded-xl hover:text-white hover:bg-[#1e1e24] transition-colors">
              대시보드 홈
            </a>
            <a href="/contents" className="flex items-center px-4 py-3 rounded-xl hover:text-white hover:bg-[#1e1e24] transition-colors">
              콘텐츠 관리
            </a>
            <a href="/security" className="flex items-center px-4 py-3 rounded-xl hover:text-white hover:bg-[#1e1e24] transition-colors">
              보안 센터
            </a>
            <a href="/logs" className="flex items-center px-4 py-3 rounded-xl hover:text-white hover:bg-[#1e1e24] transition-colors">
              관리자 로그
            </a>
            <a href="/backup" className="flex items-center px-4 py-3 rounded-xl hover:text-white hover:bg-[#1e1e24] transition-colors">
              백업 센터
            </a>
          </nav>
        </div>
        <div className="pt-4 border-t border-[#222226]">
          <button className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors">
            안전 로그아웃
          </button>
        </div>
      </aside>

      {/* 메인 컨텐츠 영역 */}
      <main className="flex-1 p-10 overflow-y-auto bg-[#0b0b0b]">
        <header className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-xs text-gray-500 mt-1">엔터프라이즈급 OTT CMS 프로덕션 환경</p>
        </header>
        <div className="bg-[#141416] rounded-2xl border border-[#222226] p-6 shadow-2xl">
          {children}
        </div>
      </main>
    </div>
  );
}