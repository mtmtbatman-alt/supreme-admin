// 개발/테스트용: 로그인 가드 완전 무효화
export async function checkAuth() {
  console.log("인증 체크 우회됨");
  return true;
}

// 만약 바로 실행되는 로직이 있다면 주석 처리 또는 무력화
export const user = { email: "admin@example.com" };