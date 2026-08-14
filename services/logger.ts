import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * [V4 프로덕션] 관리자 작업 로그 및 감사(Audit) 서비스
 */

interface LogParams {
  adminId: string;
  action: string; // LOGIN, CREATE, UPDATE, DELETE 등
  target: string; // 자원 이름 (Content, Notice 등)
  ip: string;
  browser: string;
  device: string;
}

/**
 * 관리자 행위 로그를 DB에 안전하게 기록하는 함수
 */
export async function createAdminLog({ adminId, action, target, ip, browser, device }: LogParams) {
  try {
    await prisma.adminLog.create({
      data: {
        adminId,
        action,
        target,
        ip,
        browser,
        device
      }
    });
  } catch (error) {
    console.error('관리자 로그 기록 실패:', error);
  }
}