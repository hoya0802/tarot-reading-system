// Supabase 클라이언트 설정
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

// 환경 변수 설정
// ⚠️ 중요: 아래 값들을 실제 Supabase 프로젝트 정보로 변경하세요!
const SUPABASE_URL = 'https://qcubdynkiawpcmsflxfu.supabase.co'; // Supabase 프로젝트 URL로 변경
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdWJkeW5raWF3cGNtc2ZseGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDgxNzUsImV4cCI6MjA2Nzk4NDE3NX0.c2dFWAcMq62druoosEYY2JaT5FOL--7V9qjCTtPUzi0'; // Supabase anon key로 변경


// 디버깅 정보 출력
console.log('Supabase 설정 확인:');
console.log('URL:', SUPABASE_URL);
console.log('Key 길이:', SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY.length : 0);

// 설정이 올바르지 않은 경우 경고
if (SUPABASE_URL === 'YOUR_SUPABASE_PROJECT_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
    console.error('⚠️ Supabase 연결 정보가 설정되지 않았습니다!');
    console.error('js/services/supabase.js 파일에서 실제 URL과 API 키를 입력하세요.');
}

// Supabase 클라이언트 생성
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 설정 확인 함수
export function checkSupabaseConnection() {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('Supabase 연결 테스트 시작...');
            
            // 기본 연결 테스트
            const { data, error } = await supabase
                .from('tarot_cards')
                .select('count')
                .limit(1);
            
            console.log('Supabase 응답:', { data, error });
            
            if (error) {
                console.error('Supabase 연결 오류:', error);
                
                // 구체적인 오류 메시지
                if (error.code === 'PGRST116') {
                    console.error('오류: 잘못된 URL 또는 API 키');
                } else if (error.code === 'PGRST301') {
                    console.error('오류: 인증 실패');
                } else if (error.message.includes('fetch')) {
                    console.error('오류: 네트워크 연결 문제');
                }
                
                reject(error);
            } else {
                console.log('Supabase 연결 성공');
                resolve(true);
            }
        } catch (error) {
            console.error('Supabase 연결 확인 실패:', error);
            
            // 추가 디버깅 정보
            if (error.message.includes('fetch')) {
                console.error('네트워크 오류 - CORS 또는 네트워크 문제일 수 있습니다.');
            }
            
            reject(error);
        }
    });
}

// 설정 가이드 출력
export function showSetupGuide() {
    console.log(`
=== Supabase 설정 가이드 ===
1. Supabase 프로젝트 대시보드에서 Settings > API로 이동
2. Project URL과 anon public key를 복사
3. 이 파일에서 다음 값들을 변경:
   - SUPABASE_URL: 'YOUR_SUPABASE_PROJECT_URL' → 실제 URL
   - SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY' → 실제 키
4. 데이터베이스 스키마가 생성되었는지 확인
5. 페이지를 새로고침하여 연결 테스트

현재 설정값:
- URL: ${SUPABASE_URL}
- Key: ${SUPABASE_ANON_KEY ? '설정됨' : '설정되지 않음'}
================================
    `);
}

// 간단한 연결 테스트 함수
async function simpleConnectionTest() {
    try {
        console.log('간단한 연결 테스트 시작...');
        
        // 가장 기본적인 테스트
        const { data, error } = await supabase
            .from('tarot_cards')
            .select('name')
            .limit(1);
        
        if (error) {
            console.error('간단한 테스트 실패:', error);
            return false;
        }
        
        console.log('간단한 테스트 성공:', data);
        return true;
    } catch (error) {
        console.error('간단한 테스트 예외:', error);
        return false;
    }
}

export { checkSupabaseConnection, showSetupGuide, simpleConnectionTest };
export default supabase;
