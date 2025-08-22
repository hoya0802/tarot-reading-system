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
                const baseMeaning = lifePathInsight?.insight_text || '';
                const seasonContext = seasonInsight?.insight_text ? ` ${seasonInsight.insight_text}` : '';
                const advice = lifePathInsight?.advice_text || '';
                
                // 카드별 고유 특성을 반영한 개인화된 해석 생성
                const cardSpecificContext = this.generateCardSpecificContext(card, purpose, isReversed);
                
                return {
                    meaning: baseMeaning + seasonContext + cardSpecificContext,
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
    
    // 카드별 고유 특성을 반영한 컨텍스트 생성
    generateCardSpecificContext(card, purpose, isReversed) {
        const cardName = card.name;
        const cardNumber = card.number;
        const cardSuit = card.suit;
        const isMajor = card.major_minor === 'major';
        
        // 카드별 고유한 특성에 따른 컨텍스트 생성
        let cardContext = '';
        
        if (isMajor) {
            // 메이저 아르카나 카드별 특성
            switch (cardName) {
                case 'The Fool':
                    cardContext = isReversed ? ' 새로운 시작에 대한 두려움을 극복하고' : ' 새로운 모험을 시작할 준비가 되어 있고';
                    break;
                case 'The Magician':
                    cardContext = isReversed ? ' 자신의 능력을 의심하지 말고' : ' 자신의 창의적 능력을 활용하여';
                    break;
                case 'The High Priestess':
                    cardContext = isReversed ? ' 직감을 무시하지 말고' : ' 내면의 지혜를 신뢰하여';
                    break;
                case 'The Empress':
                    cardContext = isReversed ? ' 창조적 에너지를 억누르지 말고' : ' 풍요로운 창조적 에너지를 발휘하여';
                    break;
                case 'The Emperor':
                    cardContext = isReversed ? ' 리더십을 포기하지 말고' : ' 강력한 리더십을 발휘하여';
                    break;
                case 'The Hierophant':
                    cardContext = isReversed ? ' 전통적 가치를 무시하지 말고' : ' 전통적 지혜를 활용하여';
                    break;
                case 'The Lovers':
                    cardContext = isReversed ? ' 관계에서의 선택을 신중히 하고' : ' 진정한 사랑과 조화를 추구하여';
                    break;
                case 'The Chariot':
                    cardContext = isReversed ? ' 의지력을 잃지 말고' : ' 강한 의지력으로 목표를 향해';
                    break;
                case 'Strength':
                    cardContext = isReversed ? ' 내면의 힘을 의심하지 말고' : ' 내면의 강인함을 활용하여';
                    break;
                case 'The Hermit':
                    cardContext = isReversed ? ' 고독을 두려워하지 말고' : ' 내면의 지혜를 찾아';
                    break;
                case 'Wheel of Fortune':
                    cardContext = isReversed ? ' 변화를 두려워하지 말고' : ' 운명의 변화를 받아들여';
                    break;
                case 'Justice':
                    cardContext = isReversed ? ' 공정함을 포기하지 말고' : ' 공정하고 균형잡힌 판단으로';
                    break;
                case 'The Hanged Man':
                    cardContext = isReversed ? ' 새로운 관점을 찾아' : ' 다른 관점에서 상황을 바라보며';
                    break;
                case 'Death':
                    cardContext = isReversed ? ' 변화를 거부하지 말고' : ' 새로운 시작을 위한 변화를 받아들여';
                    break;
                case 'Temperance':
                    cardContext = isReversed ? ' 균형을 잃지 말고' : ' 조화와 균형을 유지하며';
                    break;
                case 'The Devil':
                    cardContext = isReversed ? ' 속박에서 벗어나' : ' 물질적 속박을 인식하고';
                    break;
                case 'The Tower':
                    cardContext = isReversed ? ' 변화를 두려워하지 말고' : ' 갑작스러운 변화를 통해';
                    break;
                case 'The Star':
                    cardContext = isReversed ? ' 희망을 잃지 말고' : ' 희망과 영감을 가지고';
                    break;
                case 'The Moon':
                    cardContext = isReversed ? ' 직감을 신뢰하고' : ' 직감과 상상력을 활용하여';
                    break;
                case 'The Sun':
                    cardContext = isReversed ? ' 긍정적 에너지를 찾아' : ' 밝고 긍정적인 에너지로';
                    break;
                case 'Judgement':
                    cardContext = isReversed ? ' 새로운 깨달음을 찾아' : ' 새로운 깨달음과 부활을 통해';
                    break;
                case 'The World':
                    cardContext = isReversed ? ' 완성에 대한 두려움을 극복하고' : ' 완성과 성취를 향해';
                    break;
                default:
                    cardContext = isReversed ? ' 새로운 관점을 찾아' : ' 카드의 에너지를 활용하여';
            }
        } else {
            // 마이너 아르카나 수트별 특성
            const suitContexts = {
                'wands': {
                    upright: ' 창의적 에너지와 열정을 가지고',
                    reversed: ' 창의적 에너지를 회복하여'
                },
                'cups': {
                    upright: ' 감정적 직관과 사랑을 가지고',
                    reversed: ' 감정적 균형을 찾아'
                },
                'swords': {
                    upright: ' 명확한 사고와 의사결정으로',
                    reversed: ' 사고의 혼란을 정리하여'
                },
                'pentacles': {
                    upright: ' 실용적 접근과 물질적 안정으로',
                    reversed: ' 물질적 가치를 재평가하여'
                }
            };
            
            const suitContext = suitContexts[cardSuit] || suitContexts['wands'];
            cardContext = isReversed ? suitContext.reversed : suitContext.upright;
            
            // 숫자별 특성 추가
            if (cardNumber >= 1 && cardNumber <= 10) {
                const numberContexts = {
                    1: ' 새로운 시작을',
                    2: ' 균형과 선택을',
                    3: ' 창조와 성장을',
                    4: ' 안정과 기반을',
                    5: ' 변화와 도전을',
                    6: ' 조화와 균형을',
                    7: ' 내면의 성찰을',
                    8: ' 발전과 성취를',
                    9: ' 완성과 준비를',
                    10: ' 완성과 새로운 순환을'
                };
                cardContext += numberContexts[cardNumber] || ' 현재 상황을';
            }
        }
        
        return cardContext;
    }
}
