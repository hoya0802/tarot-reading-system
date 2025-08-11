// 타로 서비스 클래스
import { supabase } from './supabase.js';
import { CardCache, findCardGroup, findSuitGroup, generateCombinationHash } from '../utils/cardUtils.js';

class TarotService {
    constructor() {
        this.cache = CardCache;
    }

    // 모든 카드 조회
    async getAllCards() {
        // 캐시 확인
        const cached = this.cache.get('all_cards');
        if (cached) {
            return cached;
        }

        try {
            const { data, error } = await supabase
                .from('tarot_cards')
                .select('*')
                .order('id');
            
            if (error) throw error;
            
            // 그룹 정보 추가
            const cardsWithGroups = data.map(card => {
                const group = findCardGroup(card.id);
                const suitGroup = card.suit ? findSuitGroup(card.suit) : null;
                
                return {
                    ...card,
                    group: group,
                    suitGroup: suitGroup
                };
            });
            
            // 캐시 저장
            this.cache.set('all_cards', cardsWithGroups);
            
            return cardsWithGroups;
        } catch (error) {
            console.error('카드 조회 실패:', error);
            throw error;
        }
    }

    // 모든 목적 조회
    async getAllPurposes() {
        try {
            const { data, error } = await supabase
                .from('tarot_purposes')
                .select('*')
                .order('id');
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('목적 조회 실패:', error);
            throw error;
        }
    }

    // 목적별 카드 해석 조회
    async getPurposeReading(cardId, purposeType, isReversed = false) {
        try {
            const { data, error } = await supabase
                .from('tarot_purpose_readings')
                .select('*')
                .eq('card_id', cardId)
                .eq('purpose_type', purposeType)
                .single();
            
            if (error) throw error;
            
            return {
                meaning: isReversed ? data.reversed_meaning : data.upright_meaning,
                keywords: data.keywords,
                advice: data.advice
            };
        } catch (error) {
            console.error('목적별 해석 조회 실패:', error);
            // 기본 해석 반환
            return this.getDefaultPurposeReading(cardId, purposeType, isReversed);
        }
    }

    // 목적별 그룹 조합 해석 조회
    async getPurposeCombination(group1Id, group2Id, group3Id, reversed1, reversed2, reversed3, purposeType) {
        try {
            const { data, error } = await supabase
                .from('tarot_purpose_combinations')
                .select('*')
                .eq('group1_id', group1Id)
                .eq('group2_id', group2Id)
                .eq('group3_id', group3Id)
                .eq('group1_reversed', reversed1)
                .eq('group2_reversed', reversed2)
                .eq('group3_reversed', reversed3)
                .eq('purpose_type', purposeType)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('목적별 조합 해석 조회 실패:', error);
            // 기본 조합 해석 반환
            return this.getDefaultCombinationReading(group1Id, group2Id, group3Id, reversed1, reversed2, reversed3, purposeType);
        }
    }

    // 사용자 리딩 저장
    async saveUserReading(cardIds, reversedFlags, readingResult) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                console.warn('사용자가 로그인되지 않았습니다.');
                return null;
            }

            const { data, error } = await supabase
                .from('user_readings')
                .insert({
                    user_id: user.id,
                    card1_id: cardIds[0],
                    card2_id: cardIds[1],
                    card3_id: cardIds[2],
                    card1_reversed: reversedFlags[0],
                    card2_reversed: reversedFlags[1],
                    card3_reversed: reversedFlags[2],
                    reading_result: readingResult
                })
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('사용자 리딩 저장 실패:', error);
            throw error;
        }
    }

    // 사용자 리딩 히스토리 조회
    async getUserReadings(limit = 10) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                return [];
            }

            const { data, error } = await supabase
                .from('user_readings')
                .select(`
                    *,
                    tarot_cards!card1_id(name as card1_name),
                    tarot_cards!card2_id(name as card2_name),
                    tarot_cards!card3_id(name as card3_name)
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('사용자 리딩 히스토리 조회 실패:', error);
            return [];
        }
    }

    // 기본 목적별 해석 생성
    getDefaultPurposeReading(cardId, purposeType, isReversed) {
        const defaultReadings = {
            love: {
                upright: '사랑과 관계에 긍정적인 영향을 미치는 시기입니다.',
                reversed: '사랑과 관계에서 주의가 필요한 시기입니다.',
                keywords: '사랑, 관계, 감정',
                advice: '진정한 마음으로 소통하세요.'
            },
            career: {
                upright: '직장과 업무에서 성공할 수 있는 기회가 있습니다.',
                reversed: '직장에서 신중한 판단이 필요한 시기입니다.',
                keywords: '업무, 성공, 기회',
                advice: '꾸준한 노력과 집중력을 유지하세요.'
            },
            daily: {
                upright: '오늘은 긍정적인 에너지가 가득한 하루입니다.',
                reversed: '오늘은 신중하게 행동해야 하는 하루입니다.',
                keywords: '일상, 에너지, 기회',
                advice: '현재 순간을 소중히 여기세요.'
            },
            health: {
                upright: '건강과 웰빙에 좋은 영향을 미치는 시기입니다.',
                reversed: '건강 관리에 더욱 신경 써야 하는 시기입니다.',
                keywords: '건강, 웰빙, 균형',
                advice: '규칙적인 생활과 운동을 유지하세요.'
            },
            money: {
                upright: '재정적으로 긍정적인 변화가 예상됩니다.',
                reversed: '재정적 결정을 신중하게 내려야 합니다.',
                keywords: '재정, 투자, 안정',
                advice: '현명한 재정 계획을 세우세요.'
            }
        };

        const reading = defaultReadings[purposeType] || defaultReadings.daily;
        
        return {
            meaning: isReversed ? reading.reversed : reading.upright,
            keywords: reading.keywords,
            advice: reading.advice
        };
    }

    // 기본 조합 해석 생성
    getDefaultCombinationReading(group1Id, group2Id, group3Id, reversed1, reversed2, reversed3, purposeType) {
        const positions = ['과거', '현재', '미래'];
        const groups = [group1Id, group2Id, group3Id];
        const reversed = [reversed1, reversed2, reversed3];

        const readings = positions.map((position, index) => {
            const group = groups[index];
            const isReversed = reversed[index];
            
            return {
                position: position,
                meaning: `${position}에는 ${group} 그룹의 ${isReversed ? '역방향' : '정방향'} 에너지가 나타납니다.`
            };
        });

        return {
            past_meaning: readings[0].meaning,
            present_meaning: readings[1].meaning,
            future_meaning: readings[2].meaning,
            overall_meaning: '전체적으로 균형 잡힌 흐름을 보여줍니다.',
            relationship_theme: '일반적인 변화',
            advice: '현재 상황을 잘 관찰하고 미래를 준비하세요.',
            love_insights: purposeType === 'love' ? '사랑에 관한 특별한 통찰이 있습니다.' : null,
            career_guidance: purposeType === 'career' ? '직장에서의 조언이 있습니다.' : null,
            daily_focus: purposeType === 'daily' ? '오늘의 집중점을 찾으세요.' : null,
            health_notes: purposeType === 'health' ? '건강 관리에 주의하세요.' : null,
            money_outlook: purposeType === 'money' ? '재정적 전망을 살펴보세요.' : null
        };
    }

    // 카드 이미지 업로드
    async uploadCardImage(file, cardId, cardType) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${cardId}.${fileExt}`;
            const filePath = `cards/${cardType}/${fileName}`;
            
            const { data, error } = await supabase.storage
                .from('tarot-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });
            
            if (error) throw error;
            
            // 공개 URL 반환
            const { data: { publicUrl } } = supabase.storage
                .from('tarot-images')
                .getPublicUrl(filePath);
            
            return publicUrl;
        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            throw error;
        }
    }

    // 카드 이미지 URL 조회
    getCardImageUrl(cardId, cardType, size = 'medium') {
        return supabase.storage
            .from('tarot-images')
            .getPublicUrl(`cards/${cardType}/${cardId}-${size}.webp`)
            .data.publicUrl;
    }

    // 인증 상태 확인
    async checkAuth() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            return !!user;
        } catch (error) {
            console.error('인증 상태 확인 실패:', error);
            return false;
        }
    }

    // 로그인
    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('로그인 실패:', error);
            throw error;
        }
    }

    // 로그아웃
    async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('로그아웃 실패:', error);
            throw error;
        }
    }

    // 회원가입
    async signUp(email, password) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('회원가입 실패:', error);
            throw error;
        }
    }

    // 실시간 구독 설정
    setupRealtimeSubscription(table, callback) {
        return supabase
            .channel(`${table}_changes`)
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: table },
                callback
            )
            .subscribe();
    }
}

export { TarotService };
