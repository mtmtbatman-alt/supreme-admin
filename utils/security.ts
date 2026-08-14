import DOMPurify from 'isomorphic-dompurify';

/**
 * [V4 프로덕션] 보안 및 방어 유틸리티 모듈
 */

/**
 * 1. XSS 방어: DOMPurify를 활용한 입력값 새니타이징
 * @param dirty - 위험할 수 있는 사용자 입력 문자열
 * @returns 안전하게 정화된 문자열
 */
export function sanitizeHTML(dirty: string): string {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty);
}

/**
 * 2. SQL 인젝션 및 특수문자 차단 검증
 * @param input - 검사할 문자열
 * @returns 위험한 패턴 포함 여부
 */
export function hasSQLInjectionRisk(input: string): boolean {
  if (!input) return false;
  // 기본적인 위험 SQL 패턴 감지 정규식
  const sqlPatterns = /(\bOR\b|\bAND\b|--|;|'|"|\/\*|\*\/)/i;
  return sqlPatterns.test(input);
}