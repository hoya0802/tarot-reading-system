// 수치학 데이터베이스 서비스
import { initializeSupabase } from './supabase.js';

export class NumerologyService {
    async getLifePathInsight(lifePathNumber, purposeType, cardDirection) {
        try {
            const supabase = await initializeSupabase();
            const { data, error } = await supabase
                .from('numerology_insights')
                .select('*')
                .eq('insight_type', 'life_path')
                .eq('life_path_number', lifePathNumber)
                .eq('purpose_type', purposeType)
                .eq('card_direction', cardDirection)
                .single();
            
            if (error) {
                console.warn('생명수 해석 조회 실패:', error);
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('생명수 해석 조회 중 오류:', error);
            return null;
        }
    }
    
    async getSeasonInsight(seasonName, purposeType) {
        try {
            const supabase = await initializeSupabase();
            const { data, error } = await supabase
                .from('numerology_insights')
                .select('*')
                .eq('insight_type', 'season')
                .eq('season_name', seasonName)
                .eq('purpose_type', purposeType)
                .single();
            
            if (error) {
                console.warn('계절 해석 조회 실패:', error);
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('계절 해석 조회 중 오류:', error);
            return null;
        }
    }
    
    async getCombinationInsight(lifePathNumber, purposeType) {
        try {
            const supabase = await initializeSupabase();
            const { data, error } = await supabase
                .from('numerology_insights')
                .select('*')
                .eq('insight_type', 'combination')
                .eq('life_path_number', lifePathNumber)
                .eq('purpose_type', purposeType)
                .single();
            
            if (error) {
                console.warn('조합 해석 조회 실패:', error);
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('조합 해석 조회 중 오류:', error);
            return null;
        }
    }
    
    async applyNumerologicalInsight(card, purpose, lifePathNumber, birthSeason, isReversed) {
        try {
            const cardDirection = isReversed ? 'reversed' : 'upright';
            
            // 생명수별 해석 조회
            const lifePathInsight = await this.getLifePathInsight(lifePathNumber, purpose, cardDirection);
            
            // 계절별 해석 조회
            const seasonInsight = await this.getSeasonInsight(birthSeason.name, purpose);
            
            if (lifePathInsight || seasonInsight) {
                // 카드별 고유 특성을 반영한 개인화된 해석 생성
                const cardSpecificContext = this.generateCardSpecificContext(card, purpose, isReversed);
                
                // 카드별로 다른 기본 의미 생성
                const baseMeaning = this.generateCardSpecificBaseMeaning(card, lifePathInsight, seasonInsight, isReversed);
                
                // 자연스러운 문장 구성
                let finalMeaning = baseMeaning;
                if (cardSpecificContext) {
                    finalMeaning += cardSpecificContext;
                }
                
                const advice = lifePathInsight?.advice_text || '';
                
                return {
                    meaning: finalMeaning,
                    advice: advice
                };
            }
            
            return null;
        } catch (error) {
            console.error('수치학적 해석 적용 실패:', error);
            return null;
        }
    }
    
    async applyNumerologicalCombination(combinationReading, purpose, lifePathNumber, birthSeason, cardReadings) {
        try {
            // 생명수별 조합 해석 조회
            const combinationInsight = await this.getCombinationInsight(lifePathNumber, purpose);
            
            if (combinationInsight) {
                return {
                    ...combinationReading,
                    overall_meaning: combinationInsight.insight_text,
                    advice: combinationInsight.advice_text
                };
            }
            
            return null;
        } catch (error) {
            console.error('수치학적 조합 해석 적용 실패:', error);
            return null;
        }
    }
    
    // 관리용 함수들
    async getAllNumerologyInsights() {
        try {
            const supabase = await initializeSupabase();
            const { data, error } = await supabase
                .from('numerology_insights')
                .select('*')
                .order('insight_type, life_path_number, season_name, purpose_type, card_direction');
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('전체 수치학 데이터 조회 실패:', error);
            return [];
        }
    }
    
    async getInsightsByType(insightType) {
        try {
            const supabase = await initializeSupabase();
            const { data, error } = await supabase
                .from('numerology_insights')
                .select('*')
                .eq('insight_type', insightType)
                .order('purpose_type, life_path_number, season_name, card_direction');
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`${insightType} 타입 데이터 조회 실패:`, error);
            return [];
        }
    }
    
    // 카드별 고유 기본 의미 생성
    generateCardSpecificBaseMeaning(card, lifePathInsight, seasonInsight, isReversed) {
        const cardName = card.name;
        const cardNumber = card.number;
        const cardSuit = card.suit;
        const isMajor = card.major_minor === 'major';
        
        // 기본 수치학적 의미
        let baseMeaning = lifePathInsight?.insight_text || '';
        
        // 카드별 특성에 따른 기본 의미 조정
        if (isMajor) {
            // 메이저 아르카나 - 카드별 고유한 특성 반영
            switch (cardName) {
                case 'The Fool':
                    baseMeaning = isReversed ? '새로운 시작에 대한 두려움이 당신을 막고 있습니다' : '새로운 모험을 시작할 준비가 되어 있습니다';
                    break;
                case 'The Magician':
                    baseMeaning = isReversed ? '자신의 능력을 의심하고 있습니다' : '자신의 창의적 능력을 활용할 수 있습니다';
                    break;
                case 'The High Priestess':
                    baseMeaning = isReversed ? '직감을 무시하고 있습니다' : '내면의 지혜를 신뢰할 수 있습니다';
                    break;
                case 'The Empress':
                    baseMeaning = isReversed ? '창조적 에너지가 억제되고 있습니다' : '풍요로운 창조적 에너지를 발휘할 수 있습니다';
                    break;
                case 'The Emperor':
                    baseMeaning = isReversed ? '리더십을 포기하고 있습니다' : '강력한 리더십을 발휘할 수 있습니다';
                    break;
                case 'The Hierophant':
                    baseMeaning = isReversed ? '전통적 가치를 무시하고 있습니다' : '전통적 지혜를 활용할 수 있습니다';
                    break;
                case 'The Lovers':
                    baseMeaning = isReversed ? '관계에서의 선택이 어려워지고 있습니다' : '진정한 사랑과 조화를 추구할 수 있습니다';
                    break;
                case 'The Chariot':
                    baseMeaning = isReversed ? '의지력이 약해지고 있습니다' : '강한 의지력으로 목표를 향해 나아갈 수 있습니다';
                    break;
                case 'Strength':
                    baseMeaning = isReversed ? '내면의 힘을 의심하고 있습니다' : '내면의 강인함을 활용할 수 있습니다';
                    break;
                case 'The Hermit':
                    baseMeaning = isReversed ? '고독을 두려워하고 있습니다' : '내면의 지혜를 찾을 수 있습니다';
                    break;
                case 'Wheel of Fortune':
                    baseMeaning = isReversed ? '변화를 두려워하고 있습니다' : '운명의 변화를 받아들일 수 있습니다';
                    break;
                case 'Justice':
                    baseMeaning = isReversed ? '공정함을 포기하고 있습니다' : '공정하고 균형잡힌 판단을 할 수 있습니다';
                    break;
                case 'The Hanged Man':
                    baseMeaning = isReversed ? '새로운 관점을 찾지 못하고 있습니다' : '다른 관점에서 상황을 바라볼 수 있습니다';
                    break;
                case 'Death':
                    baseMeaning = isReversed ? '변화를 거부하고 있습니다' : '새로운 시작을 위한 변화를 받아들일 수 있습니다';
                    break;
                case 'Temperance':
                    baseMeaning = isReversed ? '균형을 잃고 있습니다' : '조화와 균형을 유지할 수 있습니다';
                    break;
                case 'The Devil':
                    baseMeaning = isReversed ? '속박에서 벗어나려고 합니다' : '물질적 속박을 인식할 수 있습니다';
                    break;
                case 'The Tower':
                    baseMeaning = isReversed ? '변화를 두려워하고 있습니다' : '갑작스러운 변화를 통해 성장할 수 있습니다';
                    break;
                case 'The Star':
                    baseMeaning = isReversed ? '희망을 잃고 있습니다' : '희망과 영감을 가지고 나아갈 수 있습니다';
                    break;
                case 'The Moon':
                    baseMeaning = isReversed ? '직감을 신뢰하지 못하고 있습니다' : '직감과 상상력을 활용할 수 있습니다';
                    break;
                case 'The Sun':
                    baseMeaning = isReversed ? '긍정적 에너지를 찾지 못하고 있습니다' : '밝고 긍정적인 에너지로 나아갈 수 있습니다';
                    break;
                case 'Judgement':
                    baseMeaning = isReversed ? '새로운 깨달음을 찾지 못하고 있습니다' : '새로운 깨달음과 부활을 통해 성장할 수 있습니다';
                    break;
                case 'The World':
                    baseMeaning = isReversed ? '완성에 대한 두려움이 있습니다' : '완성과 성취를 향해 나아갈 수 있습니다';
                    break;
                default:
                    baseMeaning = isReversed ? '새로운 관점을 찾아야 합니다' : '카드의 에너지를 활용할 수 있습니다';
            }
        } else {
            // 마이너 아르카나 - 수트별 특성 반영
            const suitBaseMeanings = {
                'wands': {
                    upright: '창의적 에너지와 열정을 가지고 나아갈 수 있습니다',
                    reversed: '창의적 에너지가 부족합니다'
                },
                'cups': {
                    upright: '감정적 직관과 사랑을 가지고 나아갈 수 있습니다',
                    reversed: '감정적 균형을 찾아야 합니다'
                },
                'swords': {
                    upright: '명확한 사고와 의사결정을 할 수 있습니다',
                    reversed: '사고의 혼란을 정리해야 합니다'
                },
                'pentacles': {
                    upright: '실용적 접근과 물질적 안정을 추구할 수 있습니다',
                    reversed: '물질적 가치를 재평가해야 합니다'
                }
            };
            
            baseMeaning = isReversed ? suitBaseMeanings[cardSuit].reversed : suitBaseMeanings[cardSuit].upright;
            
            // 숫자별 특성 추가
            if (cardNumber >= 1 && cardNumber <= 10) {
                const numberMeanings = {
                    1: '새로운 시작을 할 수 있습니다',
                    2: '균형과 선택을 신중히 할 수 있습니다',
                    3: '창조와 성장을 추구할 수 있습니다',
                    4: '안정과 기반을 다질 수 있습니다',
                    5: '변화와 도전을 받아들일 수 있습니다',
                    6: '조화와 균형을 유지할 수 있습니다',
                    7: '내면의 성찰을 할 수 있습니다',
                    8: '발전과 성취를 추구할 수 있습니다',
                    9: '만족과 성취를 느낄 수 있습니다',
                    10: '완성과 새로운 순환을 준비할 수 있습니다'
                };
                baseMeaning = numberMeanings[cardNumber] || baseMeaning;
            } else if (cardNumber >= 11 && cardNumber <= 14) {
                // Court Cards
                const courtMeanings = {
                    11: '새로운 학습을 시작할 수 있습니다',
                    12: '적극적인 행동을 취할 수 있습니다',
                    13: '지혜로운 판단을 할 수 있습니다',
                    14: '성숙한 리더십을 발휘할 수 있습니다'
                };
                baseMeaning = courtMeanings[cardNumber] || baseMeaning;
            }
        }
        
        // 계절별 컨텍스트 추가
        if (seasonInsight?.insight_text) {
            baseMeaning += ` ${seasonInsight.insight_text}`;
        }
        
        return baseMeaning;
    }
    
    // 카드별 고유 특성을 반영한 컨텍스트 생성
    generateCardSpecificContext(card, purpose, isReversed) {
        const cardName = card.name;
        const cardNumber = card.number;
        const cardSuit = card.suit;
        const isMajor = card.major_minor === 'major';
        
        // 카드별 고유한 특성에 따른 컨텍스트 생성
        let cardContext = '';
        
        if (isMajor) {
            // 메이저 아르카나 카드별 특성 - 더 자연스러운 문장으로
            switch (cardName) {
                case 'The Fool':
                    cardContext = isReversed ? ' 새로운 시작에 대한 두려움을 극복하세요' : ' 새로운 모험을 시작할 준비가 되어 있습니다';
                    break;
                case 'The Magician':
                    cardContext = isReversed ? ' 자신의 능력을 의심하지 마세요' : ' 자신의 창의적 능력을 활용하세요';
                    break;
                case 'The High Priestess':
                    cardContext = isReversed ? ' 직감을 무시하지 마세요' : ' 내면의 지혜를 신뢰하세요';
                    break;
                case 'The Empress':
                    cardContext = isReversed ? ' 창조적 에너지를 억누르지 마세요' : ' 풍요로운 창조적 에너지를 발휘하세요';
                    break;
                case 'The Emperor':
                    cardContext = isReversed ? ' 리더십을 포기하지 마세요' : ' 강력한 리더십을 발휘하세요';
                    break;
                case 'The Hierophant':
                    cardContext = isReversed ? ' 전통적 가치를 무시하지 마세요' : ' 전통적 지혜를 활용하세요';
                    break;
                case 'The Lovers':
                    cardContext = isReversed ? ' 관계에서의 선택을 신중히 하세요' : ' 진정한 사랑과 조화를 추구하세요';
                    break;
                case 'The Chariot':
                    cardContext = isReversed ? ' 의지력을 잃지 마세요' : ' 강한 의지력으로 목표를 향해 나아가세요';
                    break;
                case 'Strength':
                    cardContext = isReversed ? ' 내면의 힘을 의심하지 마세요' : ' 내면의 강인함을 활용하세요';
                    break;
                case 'The Hermit':
                    cardContext = isReversed ? ' 고독을 두려워하지 마세요' : ' 내면의 지혜를 찾으세요';
                    break;
                case 'Wheel of Fortune':
                    cardContext = isReversed ? ' 변화를 두려워하지 마세요' : ' 운명의 변화를 받아들이세요';
                    break;
                case 'Justice':
                    cardContext = isReversed ? ' 공정함을 포기하지 마세요' : ' 공정하고 균형잡힌 판단을 하세요';
                    break;
                case 'The Hanged Man':
                    cardContext = isReversed ? ' 새로운 관점을 찾으세요' : ' 다른 관점에서 상황을 바라보세요';
                    break;
                case 'Death':
                    cardContext = isReversed ? ' 변화를 거부하지 마세요' : ' 새로운 시작을 위한 변화를 받아들이세요';
                    break;
                case 'Temperance':
                    cardContext = isReversed ? ' 균형을 잃지 마세요' : ' 조화와 균형을 유지하세요';
                    break;
                case 'The Devil':
                    cardContext = isReversed ? ' 속박에서 벗어나세요' : ' 물질적 속박을 인식하세요';
                    break;
                case 'The Tower':
                    cardContext = isReversed ? ' 변화를 두려워하지 마세요' : ' 갑작스러운 변화를 통해 성장하세요';
                    break;
                case 'The Star':
                    cardContext = isReversed ? ' 희망을 잃지 마세요' : ' 희망과 영감을 가지고 나아가세요';
                    break;
                case 'The Moon':
                    cardContext = isReversed ? ' 직감을 신뢰하세요' : ' 직감과 상상력을 활용하세요';
                    break;
                case 'The Sun':
                    cardContext = isReversed ? ' 긍정적 에너지를 찾으세요' : ' 밝고 긍정적인 에너지로 나아가세요';
                    break;
                case 'Judgement':
                    cardContext = isReversed ? ' 새로운 깨달음을 찾으세요' : ' 새로운 깨달음과 부활을 통해 성장하세요';
                    break;
                case 'The World':
                    cardContext = isReversed ? ' 완성에 대한 두려움을 극복하세요' : ' 완성과 성취를 향해 나아가세요';
                    break;
                default:
                    cardContext = isReversed ? ' 새로운 관점을 찾으세요' : ' 카드의 에너지를 활용하세요';
            }
        } else {
            // 마이너 아르카나 - 더 자연스러운 문장으로
            const suitContexts = {
                'wands': {
                    upright: ' 창의적 에너지와 열정을 가지고 나아가세요',
                    reversed: ' 창의적 에너지를 회복하세요'
                },
                'cups': {
                    upright: ' 감정적 직관과 사랑을 가지고 나아가세요',
                    reversed: ' 감정적 균형을 찾으세요'
                },
                'swords': {
                    upright: ' 명확한 사고와 의사결정을 하세요',
                    reversed: ' 사고의 혼란을 정리하세요'
                },
                'pentacles': {
                    upright: ' 실용적 접근과 물질적 안정을 추구하세요',
                    reversed: ' 물질적 가치를 재평가하세요'
                }
            };
            
            const suitContext = suitContexts[cardSuit] || suitContexts['wands'];
            cardContext = isReversed ? suitContext.reversed : suitContext.upright;
            
            // 숫자별 특성 추가 (Page, Knight, Queen, King 제외)
            if (cardNumber >= 1 && cardNumber <= 10) {
                const numberContexts = {
                    1: ' 새로운 시작을 하세요',
                    2: ' 균형과 선택을 신중히 하세요',
                    3: ' 창조와 성장을 추구하세요',
                    4: ' 안정과 기반을 다지세요',
                    5: ' 변화와 도전을 받아들이세요',
                    6: ' 조화와 균형을 유지하세요',
                    7: ' 내면의 성찰을 하세요',
                    8: ' 발전과 성취를 추구하세요',
                    9: ' 만족과 성취를 느끼세요',
                    10: ' 완성과 새로운 순환을 준비하세요'
                };
                cardContext = numberContexts[cardNumber] || cardContext;
            } else if (cardNumber >= 11 && cardNumber <= 14) {
                // Court Cards (Page, Knight, Queen, King)
                const courtContexts = {
                    11: ' 새로운 학습을 시작하세요',
                    12: ' 적극적인 행동을 취하세요',
                    13: ' 지혜로운 판단을 하세요',
                    14: ' 성숙한 리더십을 발휘하세요'
                };
                cardContext = courtContexts[cardNumber] || cardContext;
            }
        }
        
        return cardContext;
    }
}
