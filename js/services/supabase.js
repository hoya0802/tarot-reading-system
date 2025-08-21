// Supabase 클라이언트 설정
const SUPABASE_URL = 'https://qcubdynkiawpcmsflxfu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdWJkeW5raWF3cGNtc2ZseGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDgxNzUsImV4cCI6MjA2Nzk4NDE3NX0.c2dFWAcMq62druoosEYY2JaT5FOL--7V9qjCTtPUzi0';

// Supabase 클라이언트 초기화
let supabase = null;

async function initializeSupabase() {
    if (!supabase) {
        try {
            const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js');
            supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase 클라이언트 초기화 완료');
        } catch (error) {
            console.error('Supabase 클라이언트 초기화 실패:', error);
            throw error;
        }
    }
    return supabase;
}

// 전역 변수로 supabase 클라이언트 설정
window.supabase = null;

// 초기화 함수를 전역으로 노출
window.initializeSupabase = initializeSupabase;

export { supabase, initializeSupabase };
