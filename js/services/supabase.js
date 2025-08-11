// Supabase 클라이언트 설정
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

// 환경 변수 설정
const SUPABASE_URL = 'https://qcubdynkiawpcmsflxfu.supabase.co'; // Supabase 프로젝트 URL로 변경
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdWJkeW5raWF3cGNtc2ZseGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDgxNzUsImV4cCI6MjA2Nzk4NDE3NX0.c2dFWAcMq62druoosEYY2JaT5FOL--7V9qjCTtPUzi0'; // Supabase anon key로 변경

// Supabase 클라이언트 생성
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 설정 확인 함수
export function checkSupabaseConnection() {
    return new Promise(async (resolve, reject) => {
        try {
            const { data, error } = await supabase
                .from('tarot_cards')
                .select('count')
                .limit(1);
            
            if (error) {
                console.error('Supabase 연결 오류:', error);
                reject(error);
            } else {
                console.log('Supabase 연결 성공');
                resolve(true);
            }
        } catch (error) {
            console.error('Supabase 연결 확인 실패:', error);
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
================================
    `);
}

export default supabase;
