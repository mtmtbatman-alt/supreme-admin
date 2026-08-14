import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Express Request 타입 확장 (관리자 정보 담기용)
export interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * JWT 및 HttpOnly 쿠키 기반 관리자 인증 미들웨어
 */
export function verifyAdminJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    // 1. 쿠키 또는 헤더에서 Access Token 추출
    const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: '인증 토큰이 존재하지 않습니다. 로그인 후 이용해주세요.' });
    }

    // 2. 토큰 검증
    const secret = process.env.JWT_SECRET || 'supreme_tv_default_secret_key';
    const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string };

    // 3. 요청 객체에 관리자 정보 주입
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: '유효하지 않거나 만료된 토큰입니다.' });
  }
}

/**
 * 역할(Role)별 접근 제어 미들웨어 (예: SUPER_ADMIN 전용 기능 보호)
 */
export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.admin || !allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({ success: false, message: '해당 기능을 실행할 권한이 없습니다.' });
    }
    next();
  };
}